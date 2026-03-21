const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  issue: {
    type: String,
    required: true,
    trim: true,
  },
  preferredSlot: {
    type: String,
    trim: true,
    default: '',
  },
  urgency: {
    type: String,
    trim: true,
    default: 'standard',
  },
  message: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ContactRequest', contactRequestSchema);
