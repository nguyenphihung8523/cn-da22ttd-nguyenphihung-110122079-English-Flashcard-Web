const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  icon: { type: String, default: '📖' },
  levelId: { type: String, required: true }, // Reference to level id
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index for unique topic within a level
topicSchema.index({ id: 1, levelId: 1 }, { unique: true });

module.exports = mongoose.model('Topic', topicSchema);
