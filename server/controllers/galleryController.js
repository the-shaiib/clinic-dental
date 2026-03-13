const GalleryItem = require('../models/GalleryItem');

const getGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch {
    return res.status(500).json({ message: 'Failed to fetch gallery items.' });
  }
};

const createGalleryItem = async (req, res) => {
  try {
    const { title = '', description = '', image } = req.body;
    if (!image) {
      return res.status(400).json({ message: 'Image is required.' });
    }
    const item = await GalleryItem.create({ title, description, image });
    return res.status(201).json(item);
  } catch {
    return res.status(500).json({ message: 'Failed to create gallery item.' });
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found.' });
    }
    return res.json({ message: 'Gallery item deleted.' });
  } catch {
    return res.status(500).json({ message: 'Failed to delete gallery item.' });
  }
};

module.exports = {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
};
