const express = require('express');
const router = express.Router();
const { saveHistory, getHistory, getMistakes, getStats, getLevelProgress, completeTopicHistory } = require('../controllers/learningController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/history', authMiddleware, saveHistory);
router.get('/history', authMiddleware, getHistory);
router.get('/mistakes', authMiddleware, getMistakes);
router.get('/stats', authMiddleware, getStats);
router.get('/progress/:level', authMiddleware, getLevelProgress);
router.post('/complete-topic', authMiddleware, completeTopicHistory);

module.exports = router;
