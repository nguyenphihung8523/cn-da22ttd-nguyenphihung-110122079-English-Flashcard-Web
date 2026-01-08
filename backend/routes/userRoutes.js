const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateSettings, changePassword, logoutAll, addFavorite, removeFavorite, getFavorites, addCustomFlashcard, getCustomFlashcards, deleteCustomFlashcard, sendFeedback } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/settings', authMiddleware, updateSettings);
router.post('/change-password', authMiddleware, changePassword);
router.post('/logout-all', authMiddleware, logoutAll);
router.post('/favorites/add', authMiddleware, addFavorite);
router.post('/favorites/remove', authMiddleware, removeFavorite);
router.get('/favorites', authMiddleware, getFavorites);

// Custom flashcard routes
router.post('/custom-flashcards', authMiddleware, addCustomFlashcard);
router.get('/custom-flashcards', authMiddleware, getCustomFlashcards);
router.delete('/custom-flashcards/:id', authMiddleware, deleteCustomFlashcard);

// Feedback route
router.post('/feedback', authMiddleware, sendFeedback);

module.exports = router;
