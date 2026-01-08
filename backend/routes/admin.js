const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  console.log('🔐 isAdmin middleware - User:', req.user?.username, 'Role:', req.user?.role);
  if (req.user.role !== 'admin') {
    console.log('❌ Access denied - not admin');
    return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
  }
  console.log('✅ Admin access granted');
  next();
};

// ============ USER MANAGEMENT ============
router.get('/users', auth, isAdmin, adminController.getAllUsers);
router.get('/users/:id', auth, isAdmin, adminController.getUserById);
router.put('/users/:id', auth, isAdmin, adminController.updateUser);
router.delete('/users/:id', auth, isAdmin, adminController.deleteUser);
router.patch('/users/:id/toggle-status', auth, isAdmin, adminController.toggleUserStatus);
router.patch('/users/:id/change-role', auth, isAdmin, adminController.changeUserRole);

// ============ FLASHCARD MANAGEMENT ============
router.get('/flashcards', auth, isAdmin, adminController.getAllFlashcards);
router.post('/flashcards', auth, isAdmin, adminController.createFlashcard);
router.put('/flashcards/:id', auth, isAdmin, adminController.updateFlashcard);
router.delete('/flashcards/:id', auth, isAdmin, adminController.deleteFlashcard);
router.get('/flashcards/level/:level', auth, isAdmin, adminController.getFlashcardsByLevel);

// ============ QUIZ MANAGEMENT ============
router.get('/quiz-questions', auth, isAdmin, adminController.getAllQuizQuestions);
router.post('/quiz-questions', auth, isAdmin, adminController.createQuizQuestion);
router.put('/quiz-questions/:id', auth, isAdmin, adminController.updateQuizQuestion);
router.delete('/quiz-questions/:id', auth, isAdmin, adminController.deleteQuizQuestion);

// ============ SYSTEM MANAGEMENT ============
router.get('/stats', auth, isAdmin, adminController.getSystemStats);
router.get('/activity', auth, isAdmin, adminController.getUserActivity);

// ============ FEEDBACK MANAGEMENT ============
router.get('/feedbacks', auth, isAdmin, adminController.getAllFeedbacks);
router.patch('/feedbacks/:userId/:feedbackId', auth, isAdmin, adminController.updateFeedbackStatus);
router.patch('/feedbacks/:userId/:feedbackId/reply', auth, isAdmin, adminController.replyToFeedback);

// ============ LEVEL MANAGEMENT ============
router.get('/levels', auth, isAdmin, adminController.getAllLevels);
router.post('/levels', auth, isAdmin, adminController.createLevel);
router.put('/levels/:id', auth, isAdmin, adminController.updateLevel);
router.delete('/levels/:id', auth, isAdmin, adminController.deleteLevel);

// ============ TOPIC MANAGEMENT ============
router.get('/topics', auth, isAdmin, adminController.getAllTopics);
router.get('/topics/level/:levelId', auth, isAdmin, adminController.getTopicsByLevel);
router.post('/topics', auth, isAdmin, adminController.createTopic);
router.put('/topics/:levelId/:id', auth, isAdmin, adminController.updateTopic);
router.delete('/topics/:levelId/:id', auth, isAdmin, adminController.deleteTopic);

// ============ SPEAKING TOPIC MANAGEMENT ============
router.get('/speaking-topics', auth, isAdmin, adminController.getAllSpeakingTopics);
router.get('/speaking-topics/level/:levelId', auth, isAdmin, adminController.getSpeakingTopicsByLevel);
router.post('/speaking-topics', auth, isAdmin, adminController.createSpeakingTopic);
router.put('/speaking-topics/:levelId/:id', auth, isAdmin, adminController.updateSpeakingTopic);
router.delete('/speaking-topics/:levelId/:id', auth, isAdmin, adminController.deleteSpeakingTopic);

// ============ SPEAKING ITEM MANAGEMENT ============
router.get('/speaking-items', auth, isAdmin, adminController.getAllSpeakingItems);
router.get('/speaking-items/:levelId/:topicId', auth, isAdmin, adminController.getSpeakingItemsByTopic);
router.post('/speaking-items', auth, isAdmin, adminController.createSpeakingItem);
router.put('/speaking-items/:id', auth, isAdmin, adminController.updateSpeakingItem);
router.delete('/speaking-items/:id', auth, isAdmin, adminController.deleteSpeakingItem);

// ============ SPEAKING LEVEL MANAGEMENT ============
router.get('/speaking-levels', auth, isAdmin, adminController.getAllSpeakingLevels);
router.post('/speaking-levels', auth, isAdmin, adminController.createSpeakingLevel);
router.put('/speaking-levels/:id', auth, isAdmin, adminController.updateSpeakingLevel);
router.delete('/speaking-levels/:id', auth, isAdmin, adminController.deleteSpeakingLevel);

module.exports = router;
