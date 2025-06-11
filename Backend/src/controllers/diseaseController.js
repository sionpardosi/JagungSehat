const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { diseaseSchema } = require('../utils/validation');

const getAllDiseases = async (req, res, next) => {
    try {
        const diseases = await prisma.disease.findMany({
            include: {
                cornReferenceImages: {
                    select: {
                        id: true,
                        imagePath: true,
                        imageName: true
                    }
                },
                _count: {
                    select: {
                        scanHistory: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        sendSuccess(res, diseases, 'Diseases retrieved successfully');
    } catch (error) {
        next(error);
    }
};

const getDiseaseById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const disease = await prisma.disease.findUnique({
            where: { id: parseInt(id) },
            include: {
                cornReferenceImages: {
                    select: {
                        id: true,
                        imagePath: true,
                        imageName: true,
                        isTrainingData: true
                    }
                },
                _count: {
                    select: {
                        scanHistory: true
                    }
                }
            }
        });

        if (!disease) {
            return sendError(res, 'Disease not found', 404);
        }

        sendSuccess(res, disease, 'Disease retrieved successfully');
    } catch (error) {
        next(error);
    }
};

const createDisease = async (req, res, next) => {
    try {
        const { error } = diseaseSchema.validate(req.body);
        if (error) {
            return sendError(res, 'Validation error', 400, error.details);
        }

        const disease = await prisma.disease.create({
            data: {
                ...req.body,
                updatedAt: new Date()
            }
        });

        sendSuccess(res, disease, 'Disease created successfully', 201);
    } catch (error) {
        next(error);
    }
};

const updateDisease = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error } = diseaseSchema.validate(req.body);

        if (error) {
            return sendError(res, 'Validation error', 400, error.details);
        }

        const disease = await prisma.disease.update({
            where: { id: parseInt(id) },
            data: {
                ...req.body,
                updatedAt: new Date()
            }
        });

        sendSuccess(res, disease, 'Disease updated successfully');
    } catch (error) {
        next(error);
    }
};

const deleteDisease = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.disease.delete({
            where: { id: parseInt(id) }
        });

        sendSuccess(res, null, 'Disease deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllDiseases,
    getDiseaseById,
    createDisease,
    updateDisease,
    deleteDisease
};