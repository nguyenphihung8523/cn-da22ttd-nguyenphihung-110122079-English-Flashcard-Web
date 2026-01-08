const mongoose = require('mongoose');

const speakingLevelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // basic, conversation, paragraph
  name: { type: String, required: true }, // Cơ bản, Giao tiếp, Đoạn văn
  icon: { type: String, default: '🎤' },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SpeakingLevel', speakingLevelSchema);
