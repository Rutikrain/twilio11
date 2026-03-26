const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, default: 'Marketing' },
  language: { type: String, default: 'en-US' },
  content: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'Pending', 'Approved', 'Rejected'], default: 'Pending' },
  buttons: [{
    type: { type: String, enum: ['URL', 'PHONE_NUMBER'] },
    text: String,
    value: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', templateSchema);