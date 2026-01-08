const express = require('express');
const router = express.Router();
const { getAll, createCard, updateCard, deleteCard } = require('../controllers/flashcardController');
const Level = require('../models/Level');
const Topic = require('../models/Topic');
const auth = require('../middleware/authMiddleware');

// Get all levels (public)
router.get('/levels', async (req, res) => {
  try {
    const levels = await Level.find({ isActive: true }).sort({ order: 1 });
    console.log('📊 Levels API called, found:', levels.length, 'levels');
    res.json({ success: true, levels });
  } catch (error) {
    console.error('❌ Error loading levels:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get topics by level (public)
router.get('/topics/:levelId', async (req, res) => {
  try {
    const { levelId } = req.params;
    const topics = await Topic.find({ levelId, isActive: true }).sort({ order: 1 });
    console.log('📚 Topics API called for level:', levelId, ', found:', topics.length, 'topics');
    res.json({ success: true, topics });
  } catch (error) {
    console.error('❌ Error loading topics:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public get all flashcards
router.get('/', getAll);

// Protected create/update/delete
router.post('/', auth, createCard);
router.put('/:id', auth, updateCard);
router.delete('/:id', auth, deleteCard);

module.exports = router;
