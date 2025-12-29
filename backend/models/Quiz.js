const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  level: { type: String, required: true },
  topic: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [{
    flashcard: { type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard' },
    isCorrect: { type: Boolean }
  }],
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
