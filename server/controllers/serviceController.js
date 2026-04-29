const Service = require('../models/Service');

const getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .select('title description tag icon createdAt')
      .sort({ createdAt: -1 })
      .lean();
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
    return res.json(services);
  } catch {
    return res.status(500).json({ message: 'Failed to fetch services.' });
  }
};

const createService = async (req, res) => {
  try {
    const { title, description, tag = '', icon = 'fa-solid fa-tooth' } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }
    const service = await Service.create({ title, description, tag, icon });
    return res.status(201).json(service);
  } catch {
    return res.status(500).json({ message: 'Failed to create service.' });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    return res.json({ message: 'Service deleted.' });
  } catch {
    return res.status(500).json({ message: 'Failed to delete service.' });
  }
};

module.exports = {
  getServices,
  createService,
  deleteService,
};
