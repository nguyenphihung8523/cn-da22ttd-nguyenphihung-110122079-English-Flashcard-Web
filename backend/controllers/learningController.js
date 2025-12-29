const LearningHistory = require('../models/LearningHistory');
const MistakeWord = require('../models/MistakeWord');
const User = require('../models/User');

// Lưu lịch sử học tập
const saveHistory = async (req, res) => {
  try {
    const { flashcardId, level, topic, activityType, spokenText, accuracy } = req.body;
    
    const history = new LearningHistory({
      user: req.user.id,
      flashcard: flashcardId,
      level,
      topic,
      activityType,
      spokenText,
      accuracy
    });
    
    await history.save();
    
    // Cập nhật tiến độ user
    const user = await User.findById(req.user.id);
    
    if (activityType === 'view') {
      // Kiểm tra xem từ này đã được học trước đó chưa
      const existingView = await LearningHistory.findOne({
        user: req.user.id,
        flashcard: flashcardId,
        activityType: 'view',
        _id: { $ne: history._id } // Loại trừ record vừa tạo
      });
      
      // Chỉ cộng nếu đây là lần đầu tiên học từ này
      if (!existingView) {
        user.learningProgress.totalWordsLearned += 1;
      }
    } else if (activityType.includes('speaking')) {
      user.learningProgress.totalSpeakingPractices += 1;
    }
    user.learningProgress.lastStudyDate = new Date();
    await user.save();
    
    // Nếu phát âm sai, lưu vào danh sách từ cần ôn
    if (activityType === 'speaking_incorrect') {
      let mistake = await MistakeWord.findOne({ user: req.user.id, flashcard: flashcardId });
      if (mistake) {
        mistake.mistakeCount += 1;
        mistake.lastMistakeDate = new Date();
      } else {
        mistake = new MistakeWord({
          user: req.user.id,
          flashcard: flashcardId
        });
      }
      await mistake.save();
    }
    
    res.json({ message: 'Đã lưu lịch sử' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy tiến độ học theo level
const getLevelProgress = async (req, res) => {
  try {
    const { level } = req.params;
    
    // Lấy danh sách các topic đã hoàn thành
    const completedTopics = await LearningHistory.distinct('topic', {
      user: req.user.id,
      level,
      activityType: 'topic_completed'
    });
    
    res.json({ completedTopics });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đánh dấu topic đã hoàn thành
const completeTopicHistory = async (req, res) => {
  try {
    const { level, topic } = req.body;
    
    // Kiểm tra xem đã hoàn thành chưa
    const existing = await LearningHistory.findOne({
      user: req.user.id,
      level,
      topic,
      activityType: 'topic_completed'
    });
    
    if (!existing) {
      const history = new LearningHistory({
        user: req.user.id,
        flashcard: null,
        level,
        topic,
        activityType: 'topic_completed'
      });
      await history.save();
    }
    
    res.json({ message: 'Đã đánh dấu hoàn thành' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy lịch sử học tập
const getHistory = async (req, res) => {
  try {
    const history = await LearningHistory.find({ user: req.user.id })
      .populate('flashcard')
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách từ cần ôn lại
const getMistakes = async (req, res) => {
  try {
    const mistakes = await MistakeWord.find({ user: req.user.id })
      .populate('flashcard')
      .sort({ mistakeCount: -1 });
    res.json(mistakes);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy thống kê
const getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Thống kê theo ngày
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayHistory = await LearningHistory.countDocuments({
      user: req.user.id,
      timestamp: { $gte: today }
    });
    
    const todaySpeaking = await LearningHistory.countDocuments({
      user: req.user.id,
      activityType: { $in: ['speaking_correct', 'speaking_incorrect'] },
      timestamp: { $gte: today }
    });
    
    res.json({
      totalWordsLearned: user.learningProgress.totalWordsLearned,
      totalSpeakingPractices: user.learningProgress.totalSpeakingPractices,
      todayActivities: todayHistory,
      todaySpeaking: todaySpeaking,
      lastStudyDate: user.learningProgress.lastStudyDate
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  saveHistory,
  getHistory,
  getMistakes,
  getStats,
  getLevelProgress,
  completeTopicHistory
};
