const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getReviewQuestions,
  getReviewQuestionsByCategory,
  submitReviewResult,
  getAvailableCategories
} = require('../controllers/reviewController');

// @route   GET /api/review/test
// @desc    Test endpoint
// @access  Public
router.get('/test', (req, res) => {
  console.log('🧪 Test endpoint called');
  res.json({ message: 'Review API is working!', timestamp: new Date() });
});

// @route   GET /api/review/test-questions
// @desc    Test questions endpoint without auth
// @access  Public
router.get('/test-questions', async (req, res) => {
  console.log('🧪 Test questions endpoint called with query:', req.query);
  try {
    const { level = 'basic', limit = 10 } = req.query;
    console.log(`🔍 Looking for ${limit} questions at level: ${level}`);
    
    const QuizQuestion = require('../models/QuizQuestion');
    
    // Lấy câu hỏi theo cấp độ
    const questions = await QuizQuestion.find({ level })
      .limit(parseInt(limit))
      .select('-__v');
    
    console.log(`📊 Found ${questions.length} questions for level ${level}`);
    
    if (questions.length === 0) {
      console.log('❌ No questions found');
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi cho cấp độ này' });
    }

    // Trộn thứ tự câu hỏi
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    
    console.log('✅ Sending response with questions');
    res.json({
      questions: shuffledQuestions,
      total: shuffledQuestions.length,
      level,
      message: 'Test successful!'
    });
  } catch (err) {
    console.error('❌ Test questions error:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// @route   GET /api/review/questions
// @desc    Lấy câu hỏi ôn tập theo cấp độ
// @access  Public (temporarily for testing)
router.get('/questions', getReviewQuestions);

// @route   GET /api/review/questions-public
// @desc    Lấy câu hỏi ôn tập theo cấp độ (public for testing)
// @access  Public
router.get('/questions-public', getReviewQuestions);

// @route   GET /api/review/questions/category
// @desc    Lấy câu hỏi ôn tập theo danh mục
// @access  Private
router.get('/questions/category', auth, getReviewQuestionsByCategory);

// @route   POST /api/review/submit
// @desc    Lưu kết quả bài ôn tập
// @access  Private
router.post('/submit', auth, submitReviewResult);

// @route   GET /api/review/categories
// @desc    Lấy danh sách các danh mục có sẵn
// @access  Private
router.get('/categories', auth, getAvailableCategories);

module.exports = router;