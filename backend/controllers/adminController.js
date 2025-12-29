const User = require('../models/User');
const Flashcard = require('../models/Flashcard');
const QuizQuestion = require('../models/QuizQuestion');

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
    const { english, vietnamese, level, topic, image, pronunciation } = req.body;
    
    const flashcard = new Flashcard({
      english,
      vietnamese,
      level,
      topic,
      image,
      pronunciation
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
    const flashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    const { question, options, correctAnswer, level, topic } = req.body;
    
    const quizQuestion = new QuizQuestion({
      question,
      options,
      correctAnswer,
      level,
      topic
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
