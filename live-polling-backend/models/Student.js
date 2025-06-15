const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  socketId: String,
  name: String,
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);