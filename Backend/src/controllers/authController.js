const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const { registerSchema, loginSchema } = require('../utils/validation');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const register = async (req, res, next) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return sendError(res, 'Validation error', 400, error.details);
        }

        const { username, email, password } = req.body;

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return sendError(res, 'User already exists', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        const token = generateToken(user.id);

        sendSuccess(res, { user, token }, 'User registered successfully', 201);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return sendError(res, 'Validation error', 400, error.details);
        }

        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return sendError(res, 'Invalid credentials', 401);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return sendError(res, 'Invalid credentials', 401);
        }

        const token = generateToken(user.id);

        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        sendSuccess(res, { user: userResponse, token }, 'Login successful');
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        sendSuccess(res, user, 'Profile retrieved successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getProfile
};
