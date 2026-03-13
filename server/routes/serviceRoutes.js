const express = require('express');
const { protect, requireAdmin } = require('../middleware/authMiddleware');
const { getServices, createService, deleteService } = require('../controllers/serviceController');

const router = express.Router();

router.get('/', getServices);
router.post('/', protect, requireAdmin, createService);
router.delete('/:id', protect, requireAdmin, deleteService);

module.exports = router;
