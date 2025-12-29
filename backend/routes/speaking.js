const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  startSpeakingSession,
  saveSpeakingResult,
  completeSpeakingSession,
  getSpeakingStats,
  getSpeakingRecommendations,
  getUserProgress,
  getProgressChart,
  getLevelRecommendation,
  updatePracticeCount,
  getDetailedStats
} = require('../controllers/speakingController');
const SpeakingSession = require('../models/SpeakingSession');

// @route   POST /api/speaking/start
// @desc    Bắt đầu phiên luyện nói mới
// @access  Private
router.post('/start', auth, startSpeakingSession);

// @route   POST /api/speaking/save-result
// @desc    Lưu kết quả luyện nói cho một item
// @access  Private
router.post('/save-result', auth, saveSpeakingResult);

// @route   POST /api/speaking/complete
// @desc    Hoàn thành phiên luyện nói
// @access  Private
router.post('/complete', auth, completeSpeakingSession);

// @route   GET /api/speaking/test
// @desc    Test endpoint để debug
// @access  Private
router.get('/test', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Test endpoint - User ID:', userId);
    
    const sessions = await SpeakingSession.find({ userId: userId });
    console.log('Found sessions for user:', sessions.length);
    
    const allSessions = await SpeakingSession.find({}).populate('userId', 'email');
    console.log('All sessions in DB:', allSessions.length);
    
    res.json({
      userId,
      userSessions: sessions.length,
      allSessions: allSessions.length,
      sessions: sessions.map(s => ({
        level: s.level,
        topic: s.topic,
        items: s.items.length
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/speaking/stats
// @desc    Lấy thống kê luyện nói
// @access  Private
router.get('/stats', auth, getSpeakingStats);

// @route   GET /api/speaking/recommendations
// @desc    Lấy gợi ý luyện nói cá nhân hóa
// @access  Private
router.get('/recommendations', auth, getSpeakingRecommendations);

// @route   GET /api/speaking/progress
// @desc    Lấy tiến độ luyện nói của user
// @access  Private
router.get('/progress', auth, getUserProgress);

// @route   GET /api/speaking/progress/chart
// @desc    Lấy dữ liệu biểu đồ tiến bộ
// @access  Private
router.get('/progress/chart', auth, getProgressChart);

// @route   GET /api/speaking/recommendations/level
// @desc    Lấy gợi ý cấp độ phù hợp
// @access  Private
router.get('/recommendations/level', auth, getLevelRecommendation);

// @route   POST /api/speaking/practice-count
// @desc    Cập nhật số lần luyện tập
// @access  Private
router.post('/practice-count', auth, updatePracticeCount);

// @route   GET /api/speaking/detailed-stats
// @desc    Lấy thống kê chi tiết cho trang luyện nói
// @access  Private
router.get('/detailed-stats', auth, getDetailedStats);

module.exports = router;