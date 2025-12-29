const QuizQuestion = require('../models/QuizQuestion');
const User = require('../models/User');

// Lấy câu hỏi ôn tập theo cấp độ
const getReviewQuestions = async (req, res) => {
  try {
    console.log('🔍 Review API called with:', req.query);
    const { level, specialization, limit = 10 } = req.query;
    
    let query = { level };
    
    // Nếu là cấp độ specialized, lọc theo specialization
    if (level === 'specialized' && specialization) {
      // Mapping specialization ID to category prefix
      const specializationMap = {
        'it': 'it',
        'economics': 'econ',
        'medical': 'med',
        'education': 'edu',
        'engineering': 'eng'
      };
      
      const categoryPrefix = specializationMap[specialization];
      if (categoryPrefix) {
        // Sử dụng MongoDB $regex operator
        query.category = { $regex: `^${categoryPrefix}-`, $options: 'i' };
        console.log('🔍 Query with specialization:', query);
      }
    }
    
    // Lấy câu hỏi theo cấp độ (và specialization nếu có)
    const questions = await QuizQuestion.find(query)
      .limit(parseInt(limit))
      .select('-__v');
    
    console.log('📊 Found questions:', questions.length, 'for specialization:', specialization);
    console.log('📋 Questions categories:', questions.map(q => q.category));
    
    if (questions.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi cho cấp độ này' });
    }

    // Trộn thứ tự câu hỏi
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    
    console.log('✅ Sending response with', shuffledQuestions.length, 'questions');
    res.json({
      questions: shuffledQuestions,
      total: shuffledQuestions.length,
      level,
      specialization
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy câu hỏi ôn tập theo danh mục
const getReviewQuestionsByCategory = async (req, res) => {
  try {
    const { level, category, limit = 5 } = req.query;
    
    const questions = await QuizQuestion.find({ level, category })
      .limit(parseInt(limit))
      .select('-__v');
    
    if (questions.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi cho danh mục này' });
    }

    // Trộn thứ tự câu hỏi
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    
    res.json({
      questions: shuffledQuestions,
      total: shuffledQuestions.length,
      level,
      category
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lưu kết quả bài ôn tập
const submitReviewResult = async (req, res) => {
  try {
    const { level, category, score, totalQuestions, timeSpent, specialization } = req.body;
    
    // Lấy thông tin user
    const user = await User.findById(req.user.id);
    const percentage = Math.round((score / totalQuestions) * 100);
    
    console.log('💾 Saving result - Level:', level, 'Specialization:', specialization, 'Score:', score);
    
    // Nếu là cấp độ specialized, lưu điểm số riêng cho chuyên ngành
    if (level === 'specialized' && specialization) {
      const currentScore = user.specializationScores[specialization] || 0;
      if (score > currentScore) {
        user.specializationScores[specialization] = score;
        console.log('✅ Updated specialization score:', specialization, '=', score);
      }
    } else {
      // Cập nhật điểm số cho level hiện tại
      if (score > user.levelScores[level]) {
        user.levelScores[level] = score;
        console.log('✅ Updated level score:', level, '=', score);
      }
    }
    
    // Kiểm tra điều kiện mở khóa cấp độ tiếp theo
    let newLevelUnlocked = false;
    let nextLevel = null;
    
    const levelOrder = ['basic', 'intermediate', 'advanced', 'communication', 'specialized'];
    const currentLevelIndex = levelOrder.indexOf(level);
    
    // Nếu đạt 7 điểm (7/10 câu đúng) và chưa mở khóa cấp độ tiếp theo
    if (score >= 7 && currentLevelIndex < levelOrder.length - 1) {
      nextLevel = levelOrder[currentLevelIndex + 1];
      
      if (!user.unlockedLevels.includes(nextLevel)) {
        user.unlockedLevels.push(nextLevel);
        newLevelUnlocked = true;
      }
    }
    
    // Lưu thay đổi
    await user.save();
    
    console.log('💾 User saved successfully');
    
    res.json({
      message: 'Đã lưu kết quả ôn tập',
      score,
      totalQuestions,
      percentage,
      timeSpent,
      newLevelUnlocked,
      nextLevel,
      unlockedLevels: user.unlockedLevels
    });
  } catch (err) {
    console.error('❌ Error saving result:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách các danh mục có sẵn
const getAvailableCategories = async (req, res) => {
  try {
    const { level } = req.query;
    
    const categories = await QuizQuestion.distinct('category', { level });
    
    res.json({
      categories,
      level
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getReviewQuestions,
  getReviewQuestionsByCategory,
  submitReviewResult,
  getAvailableCategories
};