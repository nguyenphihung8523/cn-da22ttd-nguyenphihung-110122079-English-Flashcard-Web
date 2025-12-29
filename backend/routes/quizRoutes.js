const express = require('express');
const router = express.Router();
const { getQuizQuestions, submitQuiz, getQuizHistory } = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/questions', authMiddleware, getQuizQuestions);
router.post('/submit', authMiddleware, submitQuiz);
router.get('/history', authMiddleware, getQuizHistory);

module.exports = router;
