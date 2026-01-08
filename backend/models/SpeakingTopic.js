const mongoose = require('mongoose');

const speakingTopicSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  icon: { type: String, default: '🎤' },
  levelId: { type: String, required: true }, // basic, conversation, paragraph
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SpeakingTopic', speakingTopicSchema);
