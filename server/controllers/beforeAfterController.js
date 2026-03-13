const BeforeAfterCase = require('../models/BeforeAfterCase');

const getBeforeAfterCases = async (req, res) => {
  try {
    const cases = await BeforeAfterCase.find().sort({ createdAt: -1 });
    return res.json(cases);
  } catch {
    return res.status(500).json({ message: 'Failed to fetch before/after cases.' });
  }
};

const createBeforeAfterCase = async (req, res) => {
  try {
    const { title = '', note = '', beforeImage, afterImage } = req.body;
    if (!beforeImage || !afterImage) {
      return res.status(400).json({ message: 'Before and after images are required.' });
    }
    const newCase = await BeforeAfterCase.create({ title, note, beforeImage, afterImage });
    return res.status(201).json(newCase);
  } catch {
    return res.status(500).json({ message: 'Failed to create before/after case.' });
  }
};

const deleteBeforeAfterCase = async (req, res) => {
  try {
    const item = await BeforeAfterCase.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Case not found.' });
    }
    return res.json({ message: 'Case deleted.' });
  } catch {
    return res.status(500).json({ message: 'Failed to delete case.' });
  }
};

module.exports = {
  getBeforeAfterCases,
  createBeforeAfterCase,
  deleteBeforeAfterCase,
};
