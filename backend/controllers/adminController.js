const User = require('../models/User');
const Flashcard = require('../models/Flashcard');
const QuizQuestion = require('../models/QuizQuestion');
const Level = require('../models/Level');
const Topic = require('../models/Topic');
const SpeakingTopic = require('../models/SpeakingTopic');
const SpeakingItem = require('../models/SpeakingItem');
const SpeakingLevel = require('../models/SpeakingLevel');

// ============ USER MANAGEMENT ============

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    console.log('🔍 getAllUsers called - User role:', req.user.role);
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    console.log('✅ Found users:', users.length);
    res.json({
      success: true,
      users,
      total: users.length
    });
  } catch (error) {
    console.error('❌ Error in getAllUsers:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { username, email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role, isActive, updatedAt: Date.now() },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle user active status
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.isActive = !user.isActive;
    user.updatedAt = Date.now();
    await user.save();
    
    res.json({ 
      success: true, 
      user: user.toObject({ transform: (doc, ret) => { delete ret.password; return ret; } }),
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change user role
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, updatedAt: Date.now() },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user, message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ FLASHCARD MANAGEMENT ============

// Get all flashcards
exports.getAllFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      flashcards,
      total: flashcards.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create flashcard
exports.createFlashcard = async (req, res) => {
  try {
    const { word, meaning, example, exampleTranslation, pronunciation, level, topic, image } = req.body;
    
    // Tự động tạo category từ level và topic để tương thích với trang user
    const category = topic ? `${level}-${topic}` : level;
    
    const flashcard = new Flashcard({
      word,
      meaning,
      example,
      exampleTranslation,
      pronunciation,
      level,
      topic,
      category,
      image
    });
    
    await flashcard.save();
    res.status(201).json({ success: true, flashcard, message: 'Flashcard created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update flashcard
exports.updateFlashcard = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Tự động cập nhật category nếu level hoặc topic thay đổi
    if (updateData.level && updateData.topic) {
      updateData.category = `${updateData.level}-${updateData.topic}`;
    } else if (updateData.level || updateData.topic) {
      // Lấy flashcard hiện tại để lấy level/topic còn thiếu
      const currentFlashcard = await Flashcard.findById(req.params.id);
      if (currentFlashcard) {
        const level = updateData.level || currentFlashcard.level;
        const topic = updateData.topic || currentFlashcard.topic;
        updateData.category = topic ? `${level}-${topic}` : level;
      }
    }
    
    const flashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!flashcard) return res.status(404).json({ success: false, message: 'Flashcard not found' });
    res.json({ success: true, flashcard, message: 'Flashcard updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete flashcard
exports.deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findByIdAndDelete(req.params.id);
    if (!flashcard) return res.status(404).json({ success: false, message: 'Flashcard not found' });
    res.json({ success: true, message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get flashcards by level
exports.getFlashcardsByLevel = async (req, res) => {
  try {
    const { level } = req.params;
    const flashcards = await Flashcard.find({ level }).sort({ topic: 1 });
    res.json({ success: true, flashcards, total: flashcards.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ QUIZ MANAGEMENT ============

// Get all quiz questions
exports.getAllQuizQuestions = async (req, res) => {
  try {
    const questions = await QuizQuestion.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      questions,
      total: questions.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create quiz question
exports.createQuizQuestion = async (req, res) => {
  try {
    const { question, questionVi, options, level, category, explanation } = req.body;
    
    const quizQuestion = new QuizQuestion({
      question,
      questionVi,
      options,
      level,
      category,
      explanation
    });
    
    await quizQuestion.save();
    res.status(201).json({ success: true, quizQuestion, message: 'Quiz question created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update quiz question
exports.updateQuizQuestion = async (req, res) => {
  try {
    const question = await QuizQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!question) return res.status(404).json({ success: false, message: 'Quiz question not found' });
    res.json({ success: true, question, message: 'Quiz question updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete quiz question
exports.deleteQuizQuestion = async (req, res) => {
  try {
    const question = await QuizQuestion.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Quiz question not found' });
    res.json({ success: true, message: 'Quiz question deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ SYSTEM MANAGEMENT ============

// Get system statistics
exports.getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const totalFlashcards = await Flashcard.countDocuments();
    const totalQuizQuestions = await QuizQuestion.countDocuments();
    
    // Thống kê người dùng mới đăng ký
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: startOfToday } });
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: startOfWeek } });
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });
    
    const flashcardsByLevel = await Flashcard.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        adminUsers,
        totalFlashcards,
        totalQuizQuestions,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
        flashcardsByLevel
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user activity
exports.getUserActivity = async (req, res) => {
  try {
    const users = await User.find()
      .select('username email learningProgress.lastStudyDate createdAt isActive')
      .sort({ 'learningProgress.lastStudyDate': -1 })
      .limit(50);
    
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ FEEDBACK MANAGEMENT ============

// Get all feedbacks from users
exports.getAllFeedbacks = async (req, res) => {
  try {
    const users = await User.find({ 'feedbacks.0': { $exists: true } })
      .select('username email feedbacks')
      .sort({ 'feedbacks.createdAt': -1 });
    
    // Flatten feedbacks with user info
    const allFeedbacks = [];
    users.forEach(user => {
      user.feedbacks.forEach(feedback => {
        allFeedbacks.push({
          userId: user._id,
          username: user.username,
          email: user.email,
          feedback: feedback
        });
      });
    });
    
    // Sort by createdAt descending
    allFeedbacks.sort((a, b) => new Date(b.feedback.createdAt) - new Date(a.feedback.createdAt));
    
    res.json({ success: true, feedbacks: allFeedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update feedback status
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { userId, feedbackId } = req.params;
    const { status } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const feedback = user.feedbacks.id(feedbackId);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    
    feedback.status = status;
    await user.save();
    
    res.json({ success: true, message: 'Feedback status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reply to feedback
exports.replyToFeedback = async (req, res) => {
  try {
    const { userId, feedbackId } = req.params;
    const { adminReply } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const feedback = user.feedbacks.id(feedbackId);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    
    feedback.adminReply = adminReply;
    feedback.status = 'resolved';
    await user.save();
    
    res.json({ success: true, message: 'Reply sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ LEVEL MANAGEMENT ============

// Get all levels
exports.getAllLevels = async (req, res) => {
  try {
    const levels = await Level.find().sort({ order: 1 });
    res.json({ success: true, levels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new level
exports.createLevel = async (req, res) => {
  try {
    const { id, name, icon, color, description } = req.body;
    
    // Check if level id already exists
    const existingLevel = await Level.findOne({ id });
    if (existingLevel) {
      return res.status(400).json({ success: false, message: 'Level ID already exists' });
    }
    
    // Get max order
    const maxOrder = await Level.findOne().sort({ order: -1 });
    const newOrder = maxOrder ? maxOrder.order + 1 : 0;
    
    const level = new Level({
      id,
      name,
      icon: icon || '📚',
      color: color || 'blue',
      description: description || '',
      order: newOrder
    });
    
    await level.save();
    res.status(201).json({ success: true, level, message: 'Level created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update level
exports.updateLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, color, description, isActive } = req.body;
    
    const level = await Level.findOneAndUpdate(
      { id },
      { name, icon, color, description, isActive, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!level) {
      return res.status(404).json({ success: false, message: 'Level not found' });
    }
    
    res.json({ success: true, level, message: 'Level updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete level
exports.deleteLevel = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if there are flashcards using this level
    const flashcardsCount = await Flashcard.countDocuments({ level: id });
    if (flashcardsCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete level. ${flashcardsCount} flashcards are using this level.` 
      });
    }
    
    const level = await Level.findOneAndDelete({ id });
    if (!level) {
      return res.status(404).json({ success: false, message: 'Level not found' });
    }
    
    res.json({ success: true, message: 'Level deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ TOPIC MANAGEMENT ============

// Get all topics
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ levelId: 1, order: 1 });
    res.json({ success: true, topics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get topics by level
exports.getTopicsByLevel = async (req, res) => {
  try {
    const { levelId } = req.params;
    const topics = await Topic.find({ levelId, isActive: true }).sort({ order: 1 });
    res.json({ success: true, topics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new topic
exports.createTopic = async (req, res) => {
  try {
    const { id, name, icon, levelId, description } = req.body;
    
    // Check if topic id already exists in this level
    const existingTopic = await Topic.findOne({ id, levelId });
    if (existingTopic) {
      return res.status(400).json({ success: false, message: 'Topic ID already exists in this level' });
    }
    
    // Get max order for this level
    const maxOrder = await Topic.findOne({ levelId }).sort({ order: -1 });
    const newOrder = maxOrder ? maxOrder.order + 1 : 0;
    
    const topic = new Topic({
      id,
      name,
      icon: icon || '📖',
      levelId,
      description: description || '',
      order: newOrder
    });
    
    await topic.save();
    res.status(201).json({ success: true, topic, message: 'Topic created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update topic
exports.updateTopic = async (req, res) => {
  try {
    const { id, levelId } = req.params;
    const { name, icon, description, isActive } = req.body;
    
    const topic = await Topic.findOneAndUpdate(
      { id, levelId },
      { name, icon, description, isActive, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }
    
    res.json({ success: true, topic, message: 'Topic updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete topic
exports.deleteTopic = async (req, res) => {
  try {
    const { id, levelId } = req.params;
    
    // Check if there are flashcards using this topic
    const flashcardsCount = await Flashcard.countDocuments({ topic: id, level: levelId });
    if (flashcardsCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete topic. ${flashcardsCount} flashcards are using this topic.` 
      });
    }
    
    const topic = await Topic.findOneAndDelete({ id, levelId });
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }
    
    res.json({ success: true, message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ SPEAKING TOPIC MANAGEMENT ============

// Get all speaking topics
exports.getAllSpeakingTopics = async (req, res) => {
  try {
    const topics = await SpeakingTopic.find().sort({ levelId: 1, order: 1 });
    res.json({ success: true, topics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get speaking topics by level
exports.getSpeakingTopicsByLevel = async (req, res) => {
  try {
    const { levelId } = req.params;
    const topics = await SpeakingTopic.find({ levelId, isActive: true }).sort({ order: 1 });
    
    // Count speaking items for each topic
    const topicsWithCount = await Promise.all(topics.map(async (topic) => {
      const count = await SpeakingItem.countDocuments({ level: levelId, topic: topic.id });
      return {
        ...topic.toObject(),
        count
      };
    }));
    
    res.json({ success: true, topics: topicsWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create speaking topic
exports.createSpeakingTopic = async (req, res) => {
  try {
    const { id, name, icon, levelId, description } = req.body;
    
    // Check if topic id already exists in this level
    const existingTopic = await SpeakingTopic.findOne({ id, levelId });
    if (existingTopic) {
      return res.status(400).json({ success: false, message: 'Speaking topic ID already exists in this level' });
    }
    
    // Get max order for this level
    const maxOrder = await SpeakingTopic.findOne({ levelId }).sort({ order: -1 });
    const newOrder = maxOrder ? maxOrder.order + 1 : 0;
    
    const topic = new SpeakingTopic({
      id,
      name,
      icon: icon || '🎤',
      levelId,
      description: description || '',
      order: newOrder
    });
    
    await topic.save();
    res.status(201).json({ success: true, topic, message: 'Speaking topic created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update speaking topic
exports.updateSpeakingTopic = async (req, res) => {
  try {
    const { id, levelId } = req.params;
    const { name, icon, description, isActive } = req.body;
    
    const topic = await SpeakingTopic.findOneAndUpdate(
      { id, levelId },
      { name, icon, description, isActive, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Speaking topic not found' });
    }
    
    res.json({ success: true, topic, message: 'Speaking topic updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete speaking topic
exports.deleteSpeakingTopic = async (req, res) => {
  try {
    const { id, levelId } = req.params;
    
    // Check if there are speaking items using this topic
    const itemsCount = await SpeakingItem.countDocuments({ topic: id, level: levelId });
    if (itemsCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete topic. ${itemsCount} speaking items are using this topic.` 
      });
    }
    
    const topic = await SpeakingTopic.findOneAndDelete({ id, levelId });
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Speaking topic not found' });
    }
    
    res.json({ success: true, message: 'Speaking topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ SPEAKING ITEM MANAGEMENT ============

// Get all speaking items
exports.getAllSpeakingItems = async (req, res) => {
  try {
    const items = await SpeakingItem.find().sort({ level: 1, topic: 1, order: 1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get speaking items by level and topic
exports.getSpeakingItemsByTopic = async (req, res) => {
  try {
    const { levelId, topicId } = req.params;
    const items = await SpeakingItem.find({ level: levelId, topic: topicId, isActive: true }).sort({ order: 1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create speaking item
exports.createSpeakingItem = async (req, res) => {
  try {
    const { text, meaning, level, topic } = req.body;
    
    // Get max order for this topic
    const maxOrder = await SpeakingItem.findOne({ level, topic }).sort({ order: -1 });
    const newOrder = maxOrder ? maxOrder.order + 1 : 0;
    
    const item = new SpeakingItem({
      text,
      meaning: meaning || '',
      level,
      topic,
      order: newOrder
    });
    
    await item.save();
    res.status(201).json({ success: true, item, message: 'Speaking item created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update speaking item
exports.updateSpeakingItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, meaning, isActive } = req.body;
    
    const item = await SpeakingItem.findByIdAndUpdate(
      id,
      { text, meaning, isActive, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!item) {
      return res.status(404).json({ success: false, message: 'Speaking item not found' });
    }
    
    res.json({ success: true, item, message: 'Speaking item updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete speaking item
exports.deleteSpeakingItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await SpeakingItem.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Speaking item not found' });
    }
    
    res.json({ success: true, message: 'Speaking item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ SPEAKING LEVEL MANAGEMENT ============

// Get all speaking levels
exports.getAllSpeakingLevels = async (req, res) => {
  try {
    const levels = await SpeakingLevel.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, levels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create speaking level
exports.createSpeakingLevel = async (req, res) => {
  try {
    const { id, name, icon, description } = req.body;
    
    // Check if level id already exists
    const existingLevel = await SpeakingLevel.findOne({ id });
    if (existingLevel) {
      return res.status(400).json({ success: false, message: 'Speaking level ID already exists' });
    }
    
    // Get max order
    const maxOrder = await SpeakingLevel.findOne().sort({ order: -1 });
    const newOrder = maxOrder ? maxOrder.order + 1 : 0;
    
    const level = new SpeakingLevel({
      id,
      name,
      icon: icon || '🎤',
      description: description || '',
      order: newOrder
    });
    
    await level.save();
    res.status(201).json({ success: true, level, message: 'Speaking level created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update speaking level
exports.updateSpeakingLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, description, isActive } = req.body;
    
    const level = await SpeakingLevel.findOneAndUpdate(
      { id },
      { name, icon, description, isActive, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!level) {
      return res.status(404).json({ success: false, message: 'Speaking level not found' });
    }
    
    res.json({ success: true, level, message: 'Speaking level updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete speaking level
exports.deleteSpeakingLevel = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if there are topics using this level
    const topicsCount = await SpeakingTopic.countDocuments({ levelId: id });
    if (topicsCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Không thể xóa cấp độ. Có ${topicsCount} chủ đề đang sử dụng cấp độ này.` 
      });
    }
    
    const level = await SpeakingLevel.findOneAndDelete({ id });
    if (!level) {
      return res.status(404).json({ success: false, message: 'Speaking level not found' });
    }
    
    res.json({ success: true, message: 'Speaking level deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
