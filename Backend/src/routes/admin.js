const express = require('express');
const {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllScanHistory,
    deleteScanHistory,
    uploadReferenceImage,
    deleteReferenceImage
} = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/adminAuth');
const upload = require('../config/multer');

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken, requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Scan history management
router.get('/scan-history', getAllScanHistory);
router.delete('/scan-history/:id', deleteScanHistory);

// Reference image management
router.post('/reference-images', upload.single('image'), uploadReferenceImage);
router.delete('/reference-images/:id', deleteReferenceImage);

module.exports = router;
