const mongoose = require('mongoose');

const practiceResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpeakingSession',
    required: true
  },
  itemId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  meaning: {
    type: String,
    required: true
  },
  spokenText: {
    type: String,
    required: true
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  pronunciationScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  level: {
    type: String,
    required: true,
    enum: ['basic', 'conversation', 'paragraph']
  },
  topic: {
    type: String,
    required: true
  },
  mistakes: [{
    type: String
  }],
  duration: {
    type: Number, // in milliseconds
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for performance
practiceResultSchema.index({ userId: 1, createdAt: -1 });
practiceResultSchema.index({ userId: 1, level: 1, topic: 1 });
practiceResultSchema.index({ userId: 1, accuracy: 1 });
practiceResultSchema.index({ sessionId: 1 });

module.exports = mongoose.model('PracticeResult', practiceResultSchema);