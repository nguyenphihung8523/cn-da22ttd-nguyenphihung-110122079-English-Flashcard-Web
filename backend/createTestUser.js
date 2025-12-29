const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/english_flashcard_db';

const createTestUser = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@test.com' });
    if (existingUser) {
      console.log('✅ Test user already exists');
      process.exit(0);
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('123456', 10);
    const testUser = new User({
      username: 'testuser',
      email: 'test@test.com',
      password: hashedPassword,
      learningProgress: {
        totalWordsLearned: 0,
        totalSpeakingPractices: 0,
        lastStudyDate: new Date()
      },
      levelScores: {
        basic: 100,
        intermediate: 100,
        advanced: 100,
        communication: 0,
        specialized: 0
      },
      specializationScores: {
        it: 0,
        economics: 0,
        medicine: 0,
        law: 0,
        engineering: 0
      }
    });

    await testUser.save();
    console.log('✅ Test user created successfully');
    console.log('📧 Email: test@test.com');
    console.log('🔑 Password: 123456');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    mongoose.disconnect();
  }
};

createTestUser();