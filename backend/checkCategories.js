const mongoose = require('mongoose');
const Flashcard = require('./models/Flashcard');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/english_flashcard_db';

async function check() {
  await mongoose.connect(MONGO_URI);
  const cats = await Flashcard.distinct('category');
  console.log('Categories:', cats);
  
  // Count by category
  for (const cat of cats) {
    const count = await Flashcard.countDocuments({ category: cat });
    console.log(`  ${cat}: ${count}`);
  }
  
  await mongoose.disconnect();
}

check();
