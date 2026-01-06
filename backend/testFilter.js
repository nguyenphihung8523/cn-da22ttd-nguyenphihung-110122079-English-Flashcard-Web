const mongoose = require('mongoose');
const Flashcard = require('./models/Flashcard');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/english_flashcard_db';

async function test() {
  await mongoose.connect(MONGO_URI);
  
  // Test filter
  const level = 'Cơ bản';
  const topic = 'Màu sắc';
  
  console.log(`Testing filter: level="${level}", topic="${topic}"`);
  
  const cards = await Flashcard.find({ level, topic });
  console.log(`Found ${cards.length} cards:`);
  cards.forEach(c => console.log(`  - ${c.word}: ${c.meaning} (level: ${c.level}, topic: ${c.topic})`));
  
  await mongoose.disconnect();
}

test();
