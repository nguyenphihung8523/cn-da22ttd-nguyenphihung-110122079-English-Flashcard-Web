const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  word: { type: String, required: true },
  meaning: { type: String, default: '' },
  example: { type: String, default: '' },
  exampleTranslation: { type: String, default: '' },
  pronunciation: { type: String, default: '' },
  category: { type: String, default: 'general' },
  level: { type: String, default: 'Cơ bản' },
  topic: { type: String, default: '' },
  image: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
