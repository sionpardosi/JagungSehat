const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const Joi = require('joi');

const updateProfileSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(50).optional(),
    email: Joi.string().email().max(100).optional()
});

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(255).required()
});

const updateProfile = async (req, res, next) => {
    try {
        const { error } = updateProfileSchema.validate(req.body);
        if (error) {
            return sendError(res, 'Validation error', 400, error.details);
        }

        const { username, email } = req.body;
        const updateData = {};

        if (username) updateData.username = username;
        if (email) updateData.email = email;

        if (Object.keys(updateData).length === 0) {
            return sendError(res, 'No data to update', 400);
        }

        if (username || email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    AND: [
                        { id: { not: req.user.id } },
                        {
                            OR: [
                                username ? { username } : {},
                                email ? { email } : {}
                            ].filter(obj => Object.keys(obj).length > 0)
                        }
                    ]
                }
            });

            if (existingUser) {
                return sendError(res, 'Username or email already exists', 400);
            }
        }

        updateData.updatedAt = new Date();

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        sendSuccess(res, user, 'Profile updated successfully');
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { error } = changePasswordSchema.validate(req.body);
        if (error) {
            return sendError(res, 'Validation error', 400, error.details);
        }

        const { currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return sendError(res, 'Current password is incorrect', 400);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                password: hashedPassword,
                updatedAt: new Date()
            }
        });

        sendSuccess(res, null, 'Password changed successfully');
    } catch (error) {
        next(error);
    }
};

const getStats = async (req, res, next) => {
    try {
        const stats = await prisma.scanHistory.groupBy({
            by: ['diseaseId'],
            where: { userId: req.user.id },
            _count: {
                id: true
            }
        });

        const totalScans = await prisma.scanHistory.count({
            where: { userId: req.user.id }
        });

        const diseaseStats = await Promise.all(
            stats.map(async (stat) => {
                const disease = await prisma.disease.findUnique({
                    where: { id: stat.diseaseId },
                    select: { name: true, title: true }
                });
                return {
                    disease,
                    count: stat._count.id
                };
            })
        );

        const result = {
            totalScans,
            diseaseStats,
            recentScans: await prisma.scanHistory.findMany({
                where: { userId: req.user.id },
                include: {
                    disease: {
                        select: { name: true, title: true }
                    }
                },
                orderBy: { scanDate: 'desc' },
                take: 5
            })
        };

        sendSuccess(res, result, 'User statistics retrieved successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateProfile,
    changePassword,
    getStats
};
