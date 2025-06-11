const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { sendError } = require('../utils/response');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return sendError(res, 'Access token required', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, email: true, role: true }
        });

        if (!user) {
            return sendError(res, 'User not found', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        return sendError(res, 'Invalid token', 401);
    }
};

const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, username: true, email: true, role: true }
            });
            req.user = user;
        }
        next();
    } catch (error) {
        next();
    }
};

module.exports = { authenticateToken, optionalAuth };
