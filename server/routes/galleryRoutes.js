const express = require('express');
const { protect, requireAdmin } = require('../middleware/authMiddleware');
const {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');

const router = express.Router();

router.get('/', getGalleryItems);
router.post('/', protect, requireAdmin, createGalleryItem);
router.delete('/:id', protect, requireAdmin, deleteGalleryItem);

module.exports = router;
