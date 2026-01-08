const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  questionVi: { type: String, default: '' }, // Câu hỏi tiếng Việt
  options: [{
    text: { type: String, required: true },
    textVi: { type: String, default: '' }, // Đáp án tiếng Việt
    isCorrect: { type: Boolean, default: false }
  }],
  level: { type: String, required: true }, // basic, intermediate, advanced, etc.
  category: { type: String, default: 'general' }, // colors, numbers, family, animals, etc.
  explanation: { type: String, default: '' }, // Giải thích đáp án
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);