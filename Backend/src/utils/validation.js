const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(50).required(),
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(6).max(255).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const diseaseSchema = Joi.object({
    name: Joi.string().max(50).required(),
    title: Joi.string().max(100).required(),
    description: Joi.string().optional(),
    symptoms: Joi.string().optional(),
    treatment: Joi.string().optional()
});

module.exports = {
    registerSchema,
    loginSchema,
    diseaseSchema
};
