const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { predictDisease } = require('../services/mlService');
const fs = require('fs').promises;

const scanImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return sendError(res, 'Image file is required', 400);
        }

        const prediction = await predictDisease(req.file.path);

        console.log('Prediction result:', prediction);

        if (prediction.diseaseId === null) { 
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
            return sendError(res, 'Prediction not reliable, disease ID is null', 400);
        }

        const diseaseExists = await prisma.disease.findUnique({
            where: { id: prediction.diseaseId },
            select: {
                id: true,
                name: true,
                title: true,
                description: true,
                symptoms: true,
                treatment: true
            }
        });

        if (!diseaseExists) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
            
            console.error(`Disease with ID ${prediction.diseaseId} not found in database`);
            
            const availableDiseases = await prisma.disease.findMany({
                select: { id: true, name: true }
            });
            console.log('Available diseases in database:', availableDiseases);
            
            return sendError(res, `Disease with ID ${prediction.diseaseId} not found in database`, 400);
        }

        const result = {
            diseaseId: prediction.diseaseId,
            diseaseName: prediction.diseaseName,
            confidence: prediction.confidence,
            imagePath: req.file.path,
            timestamp: new Date()  
        };

        if (req.user) {
            try {
                const scanHistory = await prisma.scanHistory.create({
                    data: {
                        userId: req.user.id,
                        diseaseId: prediction.diseaseId,
                        imagePath: req.file.path,
                        result: JSON.stringify(result),
                        confidence: prediction.confidence
                    },
                    include: {
                        disease: {
                            select: {
                                name: true,
                                title: true,
                                description: true,
                                symptoms: true,
                                treatment: true
                            }
                        }
                    }
                });

                result.scanId = scanHistory.id;
                result.disease = scanHistory.disease;  
            } catch (dbError) {
                try {
                    await fs.unlink(req.file.path);
                } catch (unlinkError) {
                    console.error('Error deleting file:', unlinkError);
                }
                
                console.error('Database error when creating scan history:', dbError);
                return sendError(res, 'Failed to save scan history', 500);
            }
        } else {
            result.disease = {
                name: diseaseExists.name,
                title: diseaseExists.title,
                description: diseaseExists.description,
                symptoms: diseaseExists.symptoms,
                treatment: diseaseExists.treatment
            };
        }

        sendSuccess(res, result, 'Image scanned successfully');
    } catch (error) {
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        console.error('Error in scanImage:', error);
        next(error);
    }
};

const getScanHistory = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const [scanHistory, total] = await Promise.all([
            prisma.scanHistory.findMany({
                where: { userId: req.user.id },
                include: {
                    disease: {
                        select: {
                            name: true,
                            title: true,
                            description: true,
                            symptoms: true,
                            treatment: true
                        }
                    }
                },
                orderBy: { scanDate: 'desc' },
                skip: parseInt(skip),
                take: parseInt(limit)
            }),
            prisma.scanHistory.count({
                where: { userId: req.user.id }
            })
        ]);

        const pagination = {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: parseInt(limit)
        };

        sendSuccess(res, { scanHistory, pagination }, 'Scan history retrieved successfully');
    } catch (error) {
        console.error('Error in getScanHistory:', error);
        next(error);
    }
};

const getScanById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const scan = await prisma.scanHistory.findFirst({
            where: {
                id: parseInt(id),
                userId: req.user.id
            },
            include: {
                disease: {
                    select: {
                        name: true,
                        title: true,
                        description: true,
                        symptoms: true,
                        treatment: true
                    }
                }
            }
        });

        if (!scan) {
            return sendError(res, 'Scan not found', 404);
        }

        sendSuccess(res, scan, 'Scan retrieved successfully');
    } catch (error) {
        console.error('Error in getScanById:', error);
        next(error);
    }
};

const deleteScan = async (req, res, next) => {
    try {
        const { id } = req.params;

        const scan = await prisma.scanHistory.findFirst({
            where: {
                id: parseInt(id),
                userId: req.user.id
            }
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

        sendSuccess(res, null, 'Scan deleted successfully');
    } catch (error) {
        console.error('Error in deleteScan:', error);
        next(error);
    }
};

module.exports = {
    scanImage,
    getScanHistory,
    getScanById,
    deleteScan
};