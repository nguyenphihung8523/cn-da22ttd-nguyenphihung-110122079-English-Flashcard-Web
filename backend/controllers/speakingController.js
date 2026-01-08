const SpeakingSession = require('../models/SpeakingSession');
const PracticeResult = require('../models/PracticeResult');
const UserProgress = require('../models/UserProgress');
const LearningHistory = require('../models/LearningHistory');
const User = require('../models/User');
const SpeakingLevel = require('../models/SpeakingLevel');
const SpeakingTopic = require('../models/SpeakingTopic');
const SpeakingItem = require('../models/SpeakingItem');
const mongoose = require('mongoose');

// @desc    Bắt đầu phiên luyện nói mới
// @access  Private
const startSpeakingSession = async (req, res) => {
  try {
    const { level, topic, scenario } = req.body;
    const userId = req.user.id;

    // Tạo session mới
    const session = new SpeakingSession({
      userId,
      level,
      topic,
      startTime: new Date(),
      totalItems: getItemCount(level, topic) // Helper function to get expected item count
    });

    await session.save();

    // Cập nhật user progress
    let userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      userProgress = new UserProgress({ userId });
    }
    userProgress.totalSessions += 1;
    await userProgress.save();

    res.json({
      success: true,
      sessionId: session._id,
      message: 'Đã bắt đầu phiên luyện nói'
    });
  } catch (error) {
    console.error('Lỗi bắt đầu phiên luyện nói:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Helper function to get expected item count for a topic
const getItemCount = (level, topic) => {
  // This should match the items count in your frontend speakingItems
  const itemCounts = {
    'basic-animals': 10,
    'basic-fruits': 10,
    'basic-family': 10,
    'conversation-daily': 10,
    'conversation-workplace': 10,
    'conversation-social': 10,
    'paragraph-phone': 10,
    'paragraph-business': 10,
    'paragraph-technology': 10
  };
  return itemCounts[`${level}-${topic}`] || 10;
};

// @desc    Lưu kết quả luyện nói cho một item
// @access  Private
const saveSpeakingResult = async (req, res) => {
  try {
    const { sessionId, itemId, text, meaning, spokenText, accuracy, pronunciationScore } = req.body;
    const userId = req.user.id;

    // Tìm session
    const session = await SpeakingSession.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({ message: 'Không tìm thấy phiên luyện nói' });
    }

    // Tạo practice result
    const practiceResult = new PracticeResult({
      userId,
      sessionId,
      itemId,
      text,
      meaning,
      spokenText,
      accuracy,
      pronunciationScore,
      level: session.level,
      topic: session.topic,
      mistakes: spokenText.toLowerCase().split(' ').filter(word => 
        !text.toLowerCase().includes(word) && word.length > 2
      )
    });

    await practiceResult.save();

    // Cập nhật session
    session.results.push(practiceResult._id);
    session.completedItems += 1;
    
    // Tính lại average scores
    const allResults = await PracticeResult.find({ sessionId });
    const totalAccuracy = allResults.reduce((sum, r) => sum + r.accuracy, 0);
    const totalPronunciation = allResults.reduce((sum, r) => sum + r.pronunciationScore, 0);
    
    session.averageAccuracy = Math.round(totalAccuracy / allResults.length);
    session.pronunciationScore = Math.round(totalPronunciation / allResults.length);

    await session.save();

    // Lưu vào LearningHistory để tương thích với code cũ
    const historyEntry = new LearningHistory({
      user: userId,
      level: session.level,
      topic: session.topic,
      activityType: accuracy >= 80 ? 'speaking_correct' : 'speaking_incorrect',
      spokenText,
      accuracy
    });
    await historyEntry.save();

    res.json({
      success: true,
      message: 'Đã lưu kết quả',
      session: {
        completedItems: session.completedItems,
        totalItems: session.totalItems,
        averageAccuracy: session.averageAccuracy,
        pronunciationScore: session.pronunciationScore
      }
    });
  } catch (error) {
    console.error('Lỗi lưu kết quả luyện nói:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Hoàn thành phiên luyện nói
// @access  Private
const completeSpeakingSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    const session = await SpeakingSession.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({ message: 'Không tìm thấy phiên luyện nói' });
    }

    // Cập nhật thông tin hoàn thành
    session.endTime = new Date();
    session.status = 'completed';

    await session.save();

    // Cập nhật user progress
    let userProgress = await UserProgress.findOne({ userId });
    if (userProgress) {
      // Check if topic is completed (all items done with good accuracy)
      const topicResults = await PracticeResult.find({ 
        userId, 
        level: session.level, 
        topic: session.topic 
      });
      
      const avgAccuracy = topicResults.reduce((sum, r) => sum + r.accuracy, 0) / topicResults.length;
      
      if (avgAccuracy >= 70) {
        // Mark topic as completed if not already
        const existingTopic = userProgress.completedTopics.find(
          t => t.level === session.level && t.topic === session.topic
        );
        
        if (!existingTopic) {
          userProgress.completedTopics.push({
            level: session.level,
            topic: session.topic,
            averageScore: Math.round(avgAccuracy),
            totalAttempts: topicResults.length
          });
        }
      }
      
      await userProgress.save();
    }

    // Lưu topic_completed vào LearningHistory để tương thích
    const completionEntry = new LearningHistory({
      user: userId,
      level: session.level,
      topic: session.topic,
      activityType: 'topic_completed'
    });
    await completionEntry.save();

    res.json({
      success: true,
      message: 'Đã hoàn thành phiên luyện nói',
      session: {
        averageAccuracy: session.averageAccuracy,
        pronunciationScore: session.pronunciationScore,
        totalItems: session.completedItems
      }
    });
  } catch (error) {
    console.error('Lỗi hoàn thành phiên luyện nói:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy thống kê luyện nói của user
// @access  Private
const getSpeakingStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting speaking stats for user:', userId);

    // Lấy tất cả sessions của user
    const allSessions = await SpeakingSession.find({
      userId: userId
    }).sort({ startTime: -1 });

    console.log('Query user ID:', userId);
    console.log('Found sessions:', allSessions.length);

    // Debug: Check all sessions in database
    const allSessionsInDB = await SpeakingSession.find({}).populate('userId', 'email');
    console.log('All sessions in DB:');
    allSessionsInDB.forEach((session, index) => {
      console.log(`${index + 1}. User ID: ${session.userId._id}, Email: ${session.userId.email}, Match: ${session.userId._id.toString() === userId}`);
    });

    console.log('Found sessions:', allSessions.length);

    // Get all practice results for this user
    const allResults = await PracticeResult.find({ userId });
    console.log('Found practice results:', allResults.length);

    // Tính thống kê đơn giản
    const totalSessions = allSessions.length;
    let totalItems = allResults.length;
    let totalAccuracy = 0;
    let totalPronunciation = 0;
    let itemCount = allResults.length;

    // Thống kê theo level
    const levelStats = {};

    // Process practice results
    allResults.forEach(result => {
      totalAccuracy += result.accuracy || 0;
      totalPronunciation += result.pronunciationScore || 0;
      
      // Level stats
      if (!levelStats[result.level]) {
        levelStats[result.level] = { sessions: 0, items: 0, totalAccuracy: 0, itemCount: 0 };
      }
      levelStats[result.level].items += 1;
      levelStats[result.level].totalAccuracy += result.accuracy || 0;
      levelStats[result.level].itemCount++;
    });

    // Count sessions per level
    allSessions.forEach(session => {
      if (!levelStats[session.level]) {
        levelStats[session.level] = { sessions: 0, items: 0, totalAccuracy: 0, itemCount: 0 };
      }
      levelStats[session.level].sessions += 1;
    });

    console.log(`Totals: sessions=${totalSessions}, items=${totalItems}, itemCount=${itemCount}`);

    const avgAccuracy = itemCount > 0 ? Math.round(totalAccuracy / itemCount) : 0;
    const avgPronunciation = itemCount > 0 ? Math.round(totalPronunciation / itemCount) : 0;

    // Calculate level averages
    Object.keys(levelStats).forEach(level => {
      const levelData = levelStats[level];
      levelData.avgAccuracy = levelData.itemCount > 0 ? 
        Math.round(levelData.totalAccuracy / levelData.itemCount) : 0;
      delete levelData.totalAccuracy;
      delete levelData.itemCount;
    });

    const finalStats = {
      totalSessions,
      totalItems,
      avgAccuracy,
      avgPronunciation,
      avgFluency: 0, // Simplified for now
      levelStats,
      progressData: [] // Simplified for now
    };

    console.log('Final stats:', finalStats);

    res.json({
      success: true,
      stats: finalStats
    });
  } catch (error) {
    console.error('Lỗi lấy thống kê luyện nói:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy gợi ý luyện nói cá nhân hóa
// @access  Private
const getSpeakingRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy lịch sử luyện tập gần đây
    const recentHistory = await LearningHistory.find({
      user: userId,
      activityType: { $in: ['speaking_correct', 'speaking_incorrect'] }
    }).sort({ timestamp: -1 }).limit(50);

    // Phân tích lỗi thường gặp
    const mistakes = {};
    recentHistory.forEach(entry => {
      if (entry.activityType === 'speaking_incorrect' && entry.spokenText) {
        // Đơn giản hóa: phân tích từ sai (có thể cải thiện với NLP)
        const words = entry.spokenText.toLowerCase().split(' ');
        words.forEach(word => {
          if (word.length > 2) { // Bỏ qua từ ngắn
            mistakes[word] = (mistakes[word] || 0) + 1;
          }
        });
      }
    });

    // Lấy sessions gần đây để xác định level phù hợp
    const recentSessions = await SpeakingSession.find({
      userId: userId,
      status: 'completed'
    }).sort({ endTime: -1 }).limit(5);

    let recommendedLevel = 'basic';
    if (recentSessions.length > 0) {
      const avgAccuracy = recentSessions.reduce((sum, s) => sum + s.averageAccuracy, 0) / recentSessions.length;
      if (avgAccuracy >= 85) {
        recommendedLevel = 'conversation';
      } else if (avgAccuracy >= 70) {
        recommendedLevel = 'paragraph';
      }
    }

    // Tạo gợi ý
    const recommendations = {
      recommendedLevel,
      commonMistakes: Object.entries(mistakes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([word, count]) => ({ word, frequency: count })),
      suggestedTopics: [],
      tips: []
    };

    // Gợi ý topics dựa trên level
    if (recommendedLevel === 'basic') {
      recommendations.suggestedTopics = ['animals', 'fruits', 'family'];
      recommendations.tips = [
        'Hãy phát âm rõ ràng từng từ',
        'Luyện tập với tốc độ chậm trước',
        'Nghe kỹ và lặp lại nhiều lần'
      ];
    } else if (recommendedLevel === 'conversation') {
      recommendations.suggestedTopics = ['daily', 'workplace', 'social'];
      recommendations.tips = [
        'Luyện tập hội thoại hàng ngày',
        'Chú ý ngữ điệu và trọng âm',
        'Thử nói trước gương'
      ];
    } else {
      recommendations.suggestedTopics = ['phone', 'business', 'technology'];
      recommendations.tips = [
        'Luyện tập đoạn hội thoại dài',
        'Chú ý sự liên kết giữa các câu',
        'Ghi âm và nghe lại để cải thiện'
      ];
    }

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Lỗi lấy gợi ý luyện nói:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy tiến độ luyện nói của user
// @access  Private
const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    // Tìm hoặc tạo user progress
    let userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      userProgress = new UserProgress({ userId });
      await userProgress.save();
    }

    // Tính toán dữ liệu thực tế từ database
    const totalSessions = await SpeakingSession.countDocuments({ 
      userId,
      status: { $in: ['completed', 'active'] }
    });

    // Tính tổng thời gian luyện tập (từ các session đã hoàn thành)
    const completedSessions = await SpeakingSession.find({ 
      userId,
      status: 'completed',
      endTime: { $exists: true }
    });

    let totalPracticeTime = 0;
    completedSessions.forEach(session => {
      if (session.endTime && session.startTime) {
        totalPracticeTime += (session.endTime - session.startTime) / 1000; // Convert to seconds
      }
    });

    // Tính số chủ đề đã hoàn thành (unique level-topic combinations)
    const completedTopics = await SpeakingSession.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { level: '$level', topic: '$topic' },
          averageScore: { $avg: '$averageAccuracy' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          level: '$_id.level',
          topic: '$_id.topic',
          averageScore: { $round: ['$averageScore', 0] },
          count: 1,
          _id: 0
        }
      }
    ]);

    // Lấy thống kê tuần này
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weeklyStats = await SpeakingSession.countDocuments({
      userId,
      createdAt: { $gte: weekStart },
      status: { $in: ['completed', 'active'] }
    });

    // Lấy common mistakes từ practice results
    const commonMistakes = await PracticeResult.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$mistakes' },
      { $group: { _id: '$mistakes', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { word: '$_id', count: 1, _id: 0 } }
    ]);

    // Cập nhật userProgress với dữ liệu thực tế
    const updatedProgress = {
      ...userProgress.toObject(),
      totalSessions,
      totalPracticeTime,
      completedTopics,
      weeklyGoal: userProgress.weeklyGoal || 5,
      currentStreak: userProgress.currentStreak || 0,
      achievements: userProgress.achievements || []
    };

    res.json({
      success: true,
      progress: updatedProgress,
      weeklyStats: [{ count: weeklyStats }],
      commonMistakes
    });
  } catch (error) {
    console.error('Lỗi lấy tiến độ:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy dữ liệu biểu đồ tiến bộ
// @access  Private
const getProgressChart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { range = 'week' } = req.query;

    let startDate = new Date();
    let groupBy = {};

    if (range === 'week') {
      startDate.setDate(startDate.getDate() - 7);
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
    } else if (range === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
    }

    const chartData = await PracticeResult.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          avgAccuracy: { $avg: '$accuracy' },
          avgPronunciation: { $avg: '$pronunciationScore' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      success: true,
      chartData: chartData.map(item => ({
        date: `${item._id.year}-${item._id.month}-${item._id.day}`,
        accuracy: Math.round(item.avgAccuracy),
        pronunciation: Math.round(item.avgPronunciation),
        count: item.count
      }))
    });
  } catch (error) {
    console.error('Lỗi lấy biểu đồ:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy gợi ý cấp độ
// @access  Private
const getLevelRecommendation = async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy 10 kết quả gần nhất
    const recentResults = await PracticeResult.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    if (recentResults.length === 0) {
      return res.json({
        success: true,
        recommendation: {
          message: 'Hãy bắt đầu luyện tập để nhận gợi ý!',
          suggestedLevel: 'basic'
        }
      });
    }

    const avgAccuracy = recentResults.reduce((sum, r) => sum + r.accuracy, 0) / recentResults.length;
    const avgPronunciation = recentResults.reduce((sum, r) => sum + r.pronunciationScore, 0) / recentResults.length;

    let recommendation = {};

    if (avgAccuracy >= 85 && avgPronunciation >= 80) {
      recommendation = {
        message: 'Bạn đã thành thạo! Hãy thử cấp độ cao hơn',
        suggestedLevel: 'paragraph'
      };
    } else if (avgAccuracy >= 70 && avgPronunciation >= 65) {
      recommendation = {
        message: 'Tiến bộ tốt! Có thể thử cấp độ giao tiếp',
        suggestedLevel: 'conversation'
      };
    } else {
      recommendation = {
        message: 'Hãy luyện tập thêm ở cấp độ cơ bản',
        suggestedLevel: 'basic'
      };
    }

    res.json({
      success: true,
      recommendation
    });
  } catch (error) {
    console.error('Lỗi lấy gợi ý cấp độ:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Cập nhật số lần luyện tập
// @access  Private
const updatePracticeCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { level, topic, accuracy, pronunciationScore } = req.body;

    // Cập nhật user progress
    let userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      userProgress = new UserProgress({ userId });
    }

    // Cập nhật streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastPractice = userProgress.lastPracticeDate;
    if (lastPractice) {
      const lastPracticeDate = new Date(lastPractice);
      lastPracticeDate.setHours(0, 0, 0, 0);
      
      const daysDiff = (today - lastPracticeDate) / (1000 * 60 * 60 * 24);
      
      if (daysDiff === 1) {
        // Consecutive day
        userProgress.currentStreak += 1;
      } else if (daysDiff > 1) {
        // Streak broken
        userProgress.currentStreak = 1;
      }
      // Same day, keep streak
    } else {
      // First practice
      userProgress.currentStreak = 1;
    }

    userProgress.longestStreak = Math.max(userProgress.longestStreak, userProgress.currentStreak);
    userProgress.lastPracticeDate = new Date();

    // Update practice history
    const todayHistory = userProgress.practiceHistory.find(h => {
      const historyDate = new Date(h.date);
      historyDate.setHours(0, 0, 0, 0);
      return historyDate.getTime() === today.getTime();
    });

    if (todayHistory) {
      todayHistory.sessionsCount += 1;
      todayHistory.averageAccuracy = (todayHistory.averageAccuracy + accuracy) / 2;
    } else {
      userProgress.practiceHistory.push({
        date: today,
        sessionsCount: 1,
        averageAccuracy: accuracy
      });
    }

    // Keep only last 30 days of history
    userProgress.practiceHistory = userProgress.practiceHistory
      .sort((a, b) => b.date - a.date)
      .slice(0, 30);

    await userProgress.save();

    res.json({
      success: true,
      message: 'Đã cập nhật tiến độ',
      currentStreak: userProgress.currentStreak
    });
  } catch (error) {
    console.error('Lỗi cập nhật số lần luyện:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy thống kê chi tiết cho trang luyện nói
// @access  Private
const getDetailedStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeRange = 'week' } = req.query; // week, month, all

    // Calculate date range
    let startDate = new Date();
    if (timeRange === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeRange === 'all') {
      startDate = new Date(0); // Beginning of time
    }

    // Get practice results in time range
    const practiceResults = await PracticeResult.find({
      userId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    // Get sessions in time range
    const sessions = await SpeakingSession.find({
      userId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    // Calculate detailed statistics
    const stats = {
      overview: {
        totalSessions: sessions.length,
        totalPracticeItems: practiceResults.length,
        averageAccuracy: practiceResults.length > 0 ? 
          Math.round(practiceResults.reduce((sum, r) => sum + r.accuracy, 0) / practiceResults.length) : 0,
        averagePronunciation: practiceResults.length > 0 ? 
          Math.round(practiceResults.reduce((sum, r) => sum + r.pronunciationScore, 0) / practiceResults.length) : 0,
        totalPracticeTime: sessions.reduce((sum, s) => {
          if (s.endTime && s.startTime) {
            return sum + (s.endTime - s.startTime) / (1000 * 60); // minutes
          }
          return sum;
        }, 0)
      },
      
      // Performance by level
      levelPerformance: {},
      
      // Performance by topic
      topicPerformance: {},
      
      // Daily practice data
      dailyPractice: [],
      
      // Accuracy distribution
      accuracyDistribution: {
        excellent: 0, // 90-100%
        good: 0,      // 80-89%
        fair: 0,      // 70-79%
        poor: 0       // <70%
      },
      
      // Most practiced topics
      mostPracticedTopics: [],
      
      // Improvement trends
      improvementTrend: {
        accuracyTrend: 'stable', // improving, declining, stable
        pronunciationTrend: 'stable',
        weeklyProgress: 0 // percentage change from last week
      },
      
      // Common mistakes (top 10)
      commonMistakes: [],
      
      // Best performing topics
      bestTopics: [],
      
      // Topics needing improvement
      improvementNeeded: []
    };

    // Calculate level performance
    const levelGroups = practiceResults.reduce((acc, result) => {
      if (!acc[result.level]) {
        acc[result.level] = [];
      }
      acc[result.level].push(result);
      return acc;
    }, {});

    Object.keys(levelGroups).forEach(level => {
      const results = levelGroups[level];
      stats.levelPerformance[level] = {
        totalItems: results.length,
        averageAccuracy: Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length),
        averagePronunciation: Math.round(results.reduce((sum, r) => sum + r.pronunciationScore, 0) / results.length),
        sessionsCount: sessions.filter(s => s.level === level).length
      };
    });

    // Calculate topic performance
    const topicGroups = practiceResults.reduce((acc, result) => {
      const key = `${result.level}-${result.topic}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(result);
      return acc;
    }, {});

    Object.keys(topicGroups).forEach(topicKey => {
      const results = topicGroups[topicKey];
      const [level, topic] = topicKey.split('-');
      stats.topicPerformance[topicKey] = {
        level,
        topic,
        totalItems: results.length,
        averageAccuracy: Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length),
        averagePronunciation: Math.round(results.reduce((sum, r) => sum + r.pronunciationScore, 0) / results.length),
        lastPracticed: results[0].createdAt
      };
    });

    // Calculate daily practice data (last 7 days)
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayResults = practiceResults.filter(r => 
        r.createdAt >= date && r.createdAt < nextDate
      );
      
      stats.dailyPractice.push({
        date: date.toISOString().split('T')[0],
        itemsCount: dayResults.length,
        sessionsCount: sessions.filter(s => 
          s.createdAt >= date && s.createdAt < nextDate
        ).length,
        averageAccuracy: dayResults.length > 0 ? 
          Math.round(dayResults.reduce((sum, r) => sum + r.accuracy, 0) / dayResults.length) : 0
      });
    }

    // Calculate accuracy distribution
    practiceResults.forEach(result => {
      if (result.accuracy >= 90) stats.accuracyDistribution.excellent++;
      else if (result.accuracy >= 80) stats.accuracyDistribution.good++;
      else if (result.accuracy >= 70) stats.accuracyDistribution.fair++;
      else stats.accuracyDistribution.poor++;
    });

    // Most practiced topics
    stats.mostPracticedTopics = Object.entries(stats.topicPerformance)
      .sort(([,a], [,b]) => b.totalItems - a.totalItems)
      .slice(0, 5)
      .map(([key, data]) => ({ key, ...data }));

    // Best performing topics
    stats.bestTopics = Object.entries(stats.topicPerformance)
      .filter(([,data]) => data.totalItems >= 3) // At least 3 attempts
      .sort(([,a], [,b]) => b.averageAccuracy - a.averageAccuracy)
      .slice(0, 5)
      .map(([key, data]) => ({ key, ...data }));

    // Topics needing improvement
    stats.improvementNeeded = Object.entries(stats.topicPerformance)
      .filter(([,data]) => data.totalItems >= 3 && data.averageAccuracy < 70)
      .sort(([,a], [,b]) => a.averageAccuracy - b.averageAccuracy)
      .slice(0, 5)
      .map(([key, data]) => ({ key, ...data }));

    // Common mistakes
    const allMistakes = practiceResults.reduce((acc, result) => {
      result.mistakes.forEach(mistake => {
        acc[mistake] = (acc[mistake] || 0) + 1;
      });
      return acc;
    }, {});

    stats.commonMistakes = Object.entries(allMistakes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    // Calculate improvement trend
    if (practiceResults.length >= 10) {
      const recent = practiceResults.slice(0, Math.floor(practiceResults.length / 2));
      const older = practiceResults.slice(Math.floor(practiceResults.length / 2));
      
      const recentAvgAccuracy = recent.reduce((sum, r) => sum + r.accuracy, 0) / recent.length;
      const olderAvgAccuracy = older.reduce((sum, r) => sum + r.accuracy, 0) / older.length;
      
      const accuracyChange = recentAvgAccuracy - olderAvgAccuracy;
      if (accuracyChange > 5) stats.improvementTrend.accuracyTrend = 'improving';
      else if (accuracyChange < -5) stats.improvementTrend.accuracyTrend = 'declining';
      
      stats.improvementTrend.weeklyProgress = Math.round(accuracyChange);
    }

    res.json({
      success: true,
      stats,
      timeRange
    });
  } catch (error) {
    console.error('Lỗi lấy thống kê chi tiết:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = {
  startSpeakingSession,
  saveSpeakingResult,
  completeSpeakingSession,
  getSpeakingStats,
  getSpeakingRecommendations,
  getUserProgress,
  getProgressChart,
  getLevelRecommendation,
  updatePracticeCount,
  getDetailedStats,
  // Public APIs for user page
  getPublicSpeakingLevels: async (req, res) => {
    try {
      const levels = await SpeakingLevel.find({ isActive: true }).sort({ order: 1 });
      
      // Fallback to default levels if no data in DB
      if (levels.length === 0) {
        return res.json({
          success: true,
          levels: [
            { id: 'basic', name: 'Cơ bản', icon: '🌱', description: 'Từ vựng đơn giản' },
            { id: 'conversation', name: 'Giao tiếp', icon: '💬', description: 'Hội thoại hàng ngày' },
            { id: 'paragraph', name: 'Đoạn văn', icon: '📝', description: 'Đoạn văn mẫu' }
          ]
        });
      }
      
      res.json({ success: true, levels });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  getPublicSpeakingTopics: async (req, res) => {
    try {
      const { levelId } = req.params;
      const topics = await SpeakingTopic.find({ levelId, isActive: true }).sort({ order: 1 });
      
      // Count items for each topic
      const topicsWithCount = await Promise.all(topics.map(async (topic) => {
        const count = await SpeakingItem.countDocuments({ level: levelId, topic: topic.id, isActive: true });
        return {
          ...topic.toObject(),
          count
        };
      }));
      
      res.json({ success: true, topics: topicsWithCount });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  getPublicSpeakingItems: async (req, res) => {
    try {
      const { levelId, topicId } = req.params;
      const items = await SpeakingItem.find({ level: levelId, topic: topicId, isActive: true }).sort({ order: 1 });
      res.json({ success: true, items });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};