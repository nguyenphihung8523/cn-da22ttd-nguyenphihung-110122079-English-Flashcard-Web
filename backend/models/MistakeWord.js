const mongoose = require('mongoose');

const mistakeWordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flashcard: { type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard', required: true },
  mistakeCount: { type: Number, default: 1 },
  lastMistakeDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MistakeWord', mistakeWordSchema);
