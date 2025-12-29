const Flashcard = require('../models/Flashcard');

const getAll = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const cards = await Flashcard.find(filter).limit(200);
    res.json(cards);
  } catch (err) {
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
