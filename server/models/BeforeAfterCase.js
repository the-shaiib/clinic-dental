const mongoose = require('mongoose');

const beforeAfterCaseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: '',
  },
  note: {
    type: String,
    trim: true,
    default: '',
  },
  beforeImage: {
    type: String,
    required: true,
  },
  afterImage: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BeforeAfterCase', beforeAfterCaseSchema);
