const ContactRequest = require('../models/ContactRequest');

const getContactRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find().sort({ createdAt: -1 });
    return res.json(requests);
  } catch {
    return res.status(500).json({ message: 'Failed to fetch contact requests.' });
  }
};

const createContactRequest = async (req, res) => {
  try {
    const { name, phone, email, issue, preferredSlot, urgency, message } = req.body;
    if (!name || !phone || !email || !issue) {
      return res.status(400).json({ message: 'Name, phone, email, and issue are required.' });
    }
    const request = await ContactRequest.create({
      name,
      phone,
      email,
      issue,
      preferredSlot,
      urgency,
      message,
    });
    return res.status(201).json(request);
  } catch {
    return res.status(500).json({ message: 'Failed to create contact request.' });
  }
};

const deleteContactRequest = async (req, res) => {
  try {
    const request = await ContactRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Contact request not found.' });
    }
    return res.json({ message: 'Contact request deleted.' });
  } catch {
    return res.status(500).json({ message: 'Failed to delete contact request.' });
  }
};

module.exports = {
  getContactRequests,
  createContactRequest,
  deleteContactRequest,
};
