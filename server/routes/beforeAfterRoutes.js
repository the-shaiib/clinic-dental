const express = require('express');
const { protect, requireAdmin } = require('../middleware/authMiddleware');
const {
  getBeforeAfterCases,
  createBeforeAfterCase,
  deleteBeforeAfterCase,
} = require('../controllers/beforeAfterController');

const router = express.Router();

router.get('/', getBeforeAfterCases);
router.post('/', protect, requireAdmin, createBeforeAfterCase);
router.delete('/:id', protect, requireAdmin, deleteBeforeAfterCase);

module.exports = router;
