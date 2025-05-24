const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  ip: String,
  createdAt: { type: Date, default: Date.now }
});

ContactMessageSchema.index({ ip: 1, createdAt: 1 }); // for efficient querying

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);

