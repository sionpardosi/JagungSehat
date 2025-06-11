const express = require('express');
const {
    getAllDiseases,
    getDiseaseById,
    createDisease,
    updateDisease,
    deleteDisease
} = require('../controllers/diseaseController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/adminAuth');

const router = express.Router();

// Public routes
router.get('/', getAllDiseases);
router.get('/:id', getDiseaseById);

// Admin only routes
router.post('/', authenticateToken, requireAdmin, createDisease);
router.put('/:id', authenticateToken, requireAdmin, updateDisease);
router.delete('/:id', authenticateToken, requireAdmin, deleteDisease);

module.exports = router;
