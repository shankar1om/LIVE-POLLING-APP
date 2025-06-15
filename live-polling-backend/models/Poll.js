const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: String,
  votes: { type: Number, default: 0 }
});

const PollSchema = new mongoose.Schema({
  question: String,
  options: [OptionSchema],
  createdBy: String,
  voters: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  timeLimit: { type: Number, default: 60 },
  correctIndex: { type: Number, default: 0 }
});

module.exports = mongoose.model('Poll', PollSchema);