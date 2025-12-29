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

module.exports = router;
