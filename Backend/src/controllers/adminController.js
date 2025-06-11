const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;

const getDashboardStats = async (req, res, next) => {
    try {
        const [
            totalUsers,
            totalDiseases,
            totalScans,
            recentScans,
            userStats,
            diseaseStats
        ] = await Promise.all([
            prisma.user.count(),
            prisma.disease.count(),
            prisma.scanHistory.count(),
            prisma.scanHistory.findMany({
                include: {
                    user: {
                        select: { username: true, email: true }
                    },
                    disease: {
                        select: { name: true, title: true }
                    }
                },
                orderBy: { scanDate: 'desc' },
                take: 10
            }),
            prisma.user.groupBy({
                by: ['role'],
                _count: { id: true }
            }),
            prisma.scanHistory.groupBy({
                by: ['diseaseId'],
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 5
            })
        ]);

        const topDiseases = await Promise.all(
            diseaseStats.map(async (stat) => {
                const disease = await prisma.disease.findUnique({
                    where: { id: stat.diseaseId },
                    select: { name: true, title: true }
                });
                return {
                    disease,
                    scanCount: stat._count.id
                };
            })
        );

        const stats = {
            overview: {
                totalUsers,
                totalDiseases,
                totalScans,
                totalAdmins: userStats.find(s => s.role === 'ADMIN')?._count.id || 0
            },
            recentScans,
            topDiseases,
            userRoleDistribution: userStats
        };

        sendSuccess(res, stats, 'Dashboard statistics retrieved successfully');
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, role, search } = req.query;
        const skip = (page - 1) * limit;

        const where = {};
        if (role) where.role = role;
        if (search) {
            where.OR = [
                { username: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    _count: {
                        select: { scanHistory: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: parseInt(skip),
                take: parseInt(limit)
            }),
            prisma.user.count({ where })
        ]);

        const pagination = {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: parseInt(limit)
        };

        sendSuccess(res, { users, pagination }, 'Users retrieved successfully');
    } catch (error) {
        next(error);
    }
};

const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['USER', 'ADMIN'].includes(role)) {
            return sendError(res, 'Invalid role', 400);
        }

        const user = await prisma.user.update({
            where: { id },
            data: {
                role,
                updatedAt: new Date()
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                updatedAt: true
            }
        });

        sendSuccess(res, user, 'User role updated successfully');
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (id === req.user.id) {
            return sendError(res, 'Cannot delete your own account', 400);
        }

        const scanHistory = await prisma.scanHistory.findMany({
            where: { userId: id },
            select: { imagePath: true }
        });

        await prisma.user.delete({
            where: { id }
        });

        for (const scan of scanHistory) {
            if (scan.imagePath) {
                try {
                    await fs.unlink(scan.imagePath);
                } catch (error) {
                    console.error('Error deleting image file:', error);
                }
            }
        }

        sendSuccess(res, null, 'User deleted successfully');
    } catch (error) {
        next(error);
    }
};

const getAllScanHistory = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, userId, diseaseId } = req.query;
        const skip = (page - 1) * limit;

        const where = {};
        if (userId) where.userId = userId;
        if (diseaseId) where.diseaseId = parseInt(diseaseId);

        const [scanHistory, total] = await Promise.all([
            prisma.scanHistory.findMany({
                where,
                include: {
                    user: {
                        select: { username: true, email: true }
                    },
                    disease: {
                        select: { name: true, title: true }
                    }
                },
                orderBy: { scanDate: 'desc' },
                skip: parseInt(skip),
                take: parseInt(limit)
            }),
            prisma.scanHistory.count({ where })
        ]);

        const pagination = {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: parseInt(limit)
        };

        sendSuccess(res, { scanHistory, pagination }, 'Scan history retrieved successfully');
    } catch (error) {
        next(error);
    }
};

const deleteScanHistory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const scan = await prisma.scanHistory.findUnique({
            where: { id: parseInt(id) }
        });

        if (!scan) {
            return sendError(res, 'Scan not found', 404);
        }

        if (scan.imagePath) {
            try {
                await fs.unlink(scan.imagePath);
            } catch (error) {
                console.error('Error deleting image file:', error);
            }
        }

        await prisma.scanHistory.delete({
            where: { id: parseInt(id) }
        });

        sendSuccess(res, null, 'Scan history deleted successfully');
    } catch (error) {
        next(error);
    }
};

const uploadReferenceImage = async (req, res, next) => {
    try {
        const { diseaseId } = req.body;

        if (!req.file) {
            return sendError(res, 'Image file is required', 400);
        }

        if (!diseaseId) {
            return sendError(res, 'Disease ID is required', 400);
        }

        const disease = await prisma.disease.findUnique({
            where: { id: parseInt(diseaseId) }
        });

        if (!disease) {
            return sendError(res, 'Disease not found', 404);
        }

        const referenceImage = await prisma.cornReferenceImage.create({
            data: {
                diseaseId: parseInt(diseaseId),
                imagePath: req.file.path,
                imageName: req.file.originalname,
                isTrainingData: req.body.isTrainingData === 'true'
            },
            include: {
                disease: {
                    select: { name: true, title: true }
                }
            }
        });

        sendSuccess(res, referenceImage, 'Reference image uploaded successfully', 201);
    } catch (error) {
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        next(error);
    }
};

const deleteReferenceImage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const referenceImage = await prisma.cornReferenceImage.findUnique({
            where: { id: parseInt(id) }
        });

        if (!referenceImage) {
            return sendError(res, 'Reference image not found', 404);
        }

        try {
            await fs.unlink(referenceImage.imagePath);
        } catch (error) {
            console.error('Error deleting image file:', error);
        }

        await prisma.cornReferenceImage.delete({
            where: { id: parseInt(id) }
        });

        sendSuccess(res, null, 'Reference image deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllScanHistory,
    deleteScanHistory,
    uploadReferenceImage,
    deleteReferenceImage
};
