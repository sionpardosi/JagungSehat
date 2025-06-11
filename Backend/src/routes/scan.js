const express = require('express');
const {
    scanImage,
    getScanHistory,
    getScanById,
    deleteScan
} = require('../controllers/scanController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

// Scan image (public with optional auth)
router.post('/', optionalAuth, upload.single('image'), scanImage);

// Authenticated routes
router.get('/history', authenticateToken, getScanHistory);
router.get('/history/:id', authenticateToken, getScanById);
router.delete('/history/:id', authenticateToken, deleteScan);

module.exports = router;
