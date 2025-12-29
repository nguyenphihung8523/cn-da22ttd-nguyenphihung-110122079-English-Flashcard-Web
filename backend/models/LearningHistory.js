const mongoose = require('mongoose');

const learningHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flashcard: { type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard', required: false }, // Không bắt buộc cho topic_completed
  level: { type: String, required: true },
  topic: { type: String, required: true },
  activityType: { type: String, enum: ['view', 'speaking_correct', 'speaking_incorrect', 'topic_completed'], required: true },
  spokenText: { type: String, default: '' },
  accuracy: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LearningHistory', learningHistorySchema);
