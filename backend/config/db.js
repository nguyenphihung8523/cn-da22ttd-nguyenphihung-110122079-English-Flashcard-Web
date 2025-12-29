const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/english_flashcard_db';

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected (config)');
  } catch (err) {
    console.error('MongoDB connection error (config):', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
