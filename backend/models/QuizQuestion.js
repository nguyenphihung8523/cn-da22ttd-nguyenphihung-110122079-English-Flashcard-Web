const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  questionVi: { type: String, required: true }, // Câu hỏi tiếng Việt
  options: [{
    text: { type: String, required: true },
    textVi: { type: String, required: true }, // Đáp án tiếng Việt
    isCorrect: { type: Boolean, default: false }
  }],
  level: { type: String, required: true }, // basic, intermediate, advanced, etc.
  category: { type: String, required: true }, // colors, numbers, family, animals, etc.
  explanation: { type: String }, // Giải thích đáp án
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);