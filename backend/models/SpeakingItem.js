const mongoose = require('mongoose');

const speakingItemSchema = new mongoose.Schema({
  text: { type: String, required: true }, // Câu tiếng Anh
  meaning: { type: String, default: '' }, // Nghĩa tiếng Việt
  level: { type: String, required: true }, // basic, conversation, paragraph
  topic: { type: String, required: true }, // animals, fruits, daily, etc.
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SpeakingItem', speakingItemSchema);
