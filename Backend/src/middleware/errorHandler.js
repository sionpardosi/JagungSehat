const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Prisma errors
    if (err.code === 'P2002') {
        return sendError(res, 'Duplicate entry', 400);
    }

    if (err.code === 'P2025') {
        return sendError(res, 'Record not found', 404);
    }

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return sendError(res, 'File too large', 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return sendError(res, 'Invalid token', 401);
    }

    if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Token expired', 401);
    }

    // Default error
    sendError(res, err.message || 'Internal server error', err.status || 500);
};

module.exports = errorHandler;
