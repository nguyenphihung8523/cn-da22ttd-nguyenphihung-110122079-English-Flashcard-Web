const mongoose = require('mongoose');

const completedTopicSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
    enum: ['basic', 'conversation', 'paragraph']
  },
  topic: {
    type: String,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  averageScore: {
    type: Number,
    default: 0
  },
  totalAttempts: {
    type: Number,
    default: 0
  }
});

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  totalPracticeTime: {
    type: Number, // in minutes
    default: 0
  },
  completedTopics: [completedTopicSchema],
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastPracticeDate: {
    type: Date
  },
  weeklyGoal: {
    type: Number,
    default: 5 // sessions per week
  },
  monthlyGoal: {
    type: Number,
    default: 20 // sessions per month
  },
  achievements: [{
    type: String
  }],
  level: {
    type: String,
    enum: ['basic', 'conversation', 'paragraph'],
    default: 'basic'
  },
  totalAccuracy: {
    type: Number,
    default: 0
  },
  totalPronunciationScore: {
    type: Number,
    default: 0
  },
  practiceHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    sessionsCount: {
      type: Number,
      default: 0
    },
    averageAccuracy: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

// Indexes for performance
userProgressSchema.index({ userId: 1 });
userProgressSchema.index({ 'practiceHistory.date': -1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);