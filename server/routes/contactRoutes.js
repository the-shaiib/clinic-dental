const express = require('express');
const { protect, requireAdmin } = require('../middleware/authMiddleware');
const {
  getContactRequests,
  createContactRequest,
  deleteContactRequest,
} = require('../controllers/contactController');

const router = express.Router();

router.get('/', protect, requireAdmin, getContactRequests);
router.post('/', createContactRequest);
router.delete('/:id', protect, requireAdmin, deleteContactRequest);

module.exports = router;
