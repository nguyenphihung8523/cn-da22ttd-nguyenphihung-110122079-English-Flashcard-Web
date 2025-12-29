const mongoose = require('mongoose');

const speakingSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
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
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  totalItems: {
    type: Number,
    default: 0
  },
  completedItems: {
    type: Number,
    default: 0
  },
  averageAccuracy: {
    type: Number,
    default: 0
  },
  pronunciationScore: {
    type: Number,
    default: 0
  },
  results: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PracticeResult'
  }]
}, {
  timestamps: true
});

// Indexes for performance
speakingSessionSchema.index({ userId: 1, createdAt: -1 });
speakingSessionSchema.index({ userId: 1, status: 1 });
speakingSessionSchema.index({ userId: 1, level: 1, topic: 1 });

module.exports = mongoose.model('SpeakingSession', speakingSessionSchema);