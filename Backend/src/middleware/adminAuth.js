const { sendError } = require('../utils/response');

const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return sendError(res, 'Authentication required', 401);
    }

    if (req.user.role !== 'ADMIN') {
        return sendError(res, 'Admin access required', 403);
    }

    next();
};

module.exports = { requireAdmin };
