const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
  birthDate: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  favoriteWords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard' }],
  customFlashcards: [{
    _id: { type: String },
    word: { type: String, required: true },
    pronunciation: { type: String, default: '' },
    image: { type: String, default: '' },
    meaning: { type: String, required: true },
    example: { type: String, default: '' },
    exampleTranslation: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  }],
  learningProgress: {
    totalWordsLearned: { type: Number, default: 0 },
    totalSpeakingPractices: { type: Number, default: 0 },
    lastStudyDate: { type: Date }
  },
  levelScores: {
    basic: { type: Number, default: 100 },
    intermediate: { type: Number, default: 100 },
    advanced: { type: Number, default: 100 },
    communication: { type: Number, default: 0 },
    specialized: { type: Number, default: 0 }
  },
  specializationScores: {
    it: { type: Number, default: 0 },
    economics: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    engineering: { type: Number, default: 0 }
  },
  unlockedLevels: {
    type: [String],
    default: ['basic', 'intermediate', 'advanced', 'communication', 'specialized']
  },
  settings: {
    voiceGender: { type: String, enum: ['male', 'female'], default: 'female' },
    voiceAccent: { type: String, enum: ['us', 'uk'], default: 'us' },
    showImages: { type: Boolean, default: true }
  },
  selectedSpecialization: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
