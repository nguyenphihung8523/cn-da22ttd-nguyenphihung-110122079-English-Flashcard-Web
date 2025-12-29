const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Flashcard = require('../models/Flashcard');

// Lấy câu hỏi quiz
const getQuizQuestions = async (req, res) => {
  try {
    const { level, topic } = req.query;
    const category = `${level}-${topic}`;
    
    // Lấy ngẫu nhiên 10 flashcards
    const flashcards = await Flashcard.aggregate([
      { $match: { category } },
      { $sample: { size: 10 } }
    ]);
    
    // Tạo câu hỏi với 4 đáp án
    const questions = flashcards.map(card => {
      // Lấy 3 đáp án sai ngẫu nhiên
      return {
        _id: card._id,
        word: card.word,
        image: card.image,
        pronunciation: card.pronunciation,
        correctAnswer: card.meaning
      };
    });
    
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lưu kết quả quiz
const submitQuiz = async (req, res) => {
  try {
    const { level, topic, answers, score, totalQuestions } = req.body;
    
    // Lưu kết quả quiz
    const quiz = new Quiz({
      user: req.user.id,
      level,
      topic,
      score,
      totalQuestions,
      answers
    });
    await quiz.save();
    
    // Cập nhật điểm của user
    const user = await User.findById(req.user.id);
    if (!user.levelScores[level]) {
      user.levelScores[level] = 0;
    }
    user.levelScores[level] = Math.max(user.levelScores[level], score);
    
    // Kiểm tra mở khóa cấp độ tiếp theo
    const levelOrder = ['basic', 'intermediate', 'advanced', 'communication', 'specialized'];
    const minScoreToUnlock = 70; // Điểm tối thiểu để mở khóa cấp độ tiếp theo
    
    const currentLevelIndex = levelOrder.indexOf(level);
    const nextLevel = levelOrder[currentLevelIndex + 1];
    
    let newLevelUnlocked = false;
    
    // Nếu đạt điểm tối thiểu và có cấp độ tiếp theo
    if (score >= minScoreToUnlock && nextLevel && !user.unlockedLevels.includes(nextLevel)) {
      user.unlockedLevels.push(nextLevel);
      newLevelUnlocked = true;
    }
    
    await user.save();
    
    res.json({
      message: 'Đã lưu kết quả',
      levelScore: user.levelScores[level],
      unlockedLevels: user.unlockedLevels,
      newLevelUnlocked,
      nextLevel: newLevelUnlocked ? nextLevel : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy lịch sử quiz
const getQuizHistory = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user.id })
      .sort({ completedAt: -1 })
      .limit(20);
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getQuizQuestions,
  submitQuiz,
  getQuizHistory
};
