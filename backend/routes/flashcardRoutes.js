const express = require('express');
const router = express.Router();
const { getAll, createCard, updateCard, deleteCard } = require('../controllers/flashcardController');
const auth = require('../middleware/authMiddleware');

// Public get all flashcards
router.get('/', getAll);

// Protected create/update/delete
router.post('/', auth, createCard);
router.put('/:id', auth, updateCard);
router.delete('/:id', auth, deleteCard);

module.exports = router;
