const express = require('express');
const {
    updateProfile,
    changePassword,
    getStats
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/stats', getStats);

module.exports = router;
