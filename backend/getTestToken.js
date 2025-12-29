const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/english_flashcard_db';
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey123';

const getTestToken = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find test user
    const testUser = await User.findOne({ email: 'test@test.com' });
    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }

    // Generate new token
    const token = jwt.sign(
      { id: testUser._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Test user found:');
    console.log(`📧 Email: ${testUser.email}`);
    console.log(`👤 Username: ${testUser.username}`);
    console.log(`🆔 ID: ${testUser._id}`);
    console.log('\n🔑 New Token (valid for 7 days):');
    console.log(token);
    console.log('\n📋 Copy this token to test API calls:');
    console.log(`Authorization: Bearer ${token}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

getTestToken();