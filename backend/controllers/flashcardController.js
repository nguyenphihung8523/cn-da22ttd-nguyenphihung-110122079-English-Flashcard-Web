const Flashcard = require('../models/Flashcard');

const getAll = async (req, res) => {
  try {
    const { category, level, topic } = req.query;
    console.log('📥 Query params:', { category, level, topic });
    
    const filter = {};
    if (category) filter.category = category;
    if (level) filter.level = level;
    
    // Nếu có topic, tìm theo topic hoặc category chứa topic
    if (topic) {
      const categoryPattern = level ? `${level}-${topic}` : topic;
      filter.$or = [
        { topic: topic },
        { category: categoryPattern },
        { category: topic }
      ];
      delete filter.level; // Xóa level khỏi filter chính vì đã có trong $or
    }
    
    console.log('🔍 Filter:', JSON.stringify(filter));
    
    const cards = await Flashcard.find(filter).limit(200);
    console.log(`📊 Found ${cards.length} cards`);
    
    res.json(cards);
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({message: 'Lỗi server'});
  }
};

const createCard = async (req, res) => {
  try {
    const { word, meaning, example, pronunciation } = req.body;
    const newCard = new Flashcard({ word, meaning, example, pronunciation });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({message: 'Lỗi server'});
  }
};

const updateCard = async (req, res) => {
  try {
    const updated = await Flashcard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({message: 'Lỗi server'});
  }
};

const deleteCard = async (req, res) => {
  try {
    await Flashcard.findByIdAndDelete(req.params.id);
    res.json({message: 'Xóa thành công'});
  } catch (err) {
    res.status(500).json({message: 'Lỗi server'});
  }
};

module.exports = { getAll, createCard, updateCard, deleteCard };
