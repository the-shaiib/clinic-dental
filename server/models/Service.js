const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  tag: {
    type: String,
    trim: true,
    default: '',
  },
  icon: {
    type: String,
    trim: true,
    default: 'fa-solid fa-tooth',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

serviceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Service', serviceSchema);
