const mongoose = require('mongoose');
const SpeakingSession = require('./models/SpeakingSession');
const PracticeResult = require('./models/PracticeResult');
const UserProgress = require('./models/UserProgress');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/english_flashcard_db';

async function seedSpeakingData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find test user
    const testUser = await User.findOne({ email: 'test@test.com' });
    if (!testUser) {
      console.log('❌ Test user not found. Please create test user first.');
      return;
    }

    console.log('👤 Found test user:', testUser.email);

    // Clear existing speaking data for test user
    await SpeakingSession.deleteMany({ userId: testUser._id });
    await PracticeResult.deleteMany({ userId: testUser._id });
    await UserProgress.deleteMany({ userId: testUser._id });
    console.log('🧹 Cleared existing speaking data');

    // Create sample sessions and results
    const levels = ['basic', 'conversation', 'paragraph'];
    const topics = {
      basic: ['animals', 'fruits', 'family'],
      conversation: ['daily', 'workplace', 'social'],
      paragraph: ['phone', 'business', 'technology']
    };

    const sampleTexts = {
      'basic-animals': ['Cat', 'Dog', 'Bird', 'Fish', 'Elephant'],
      'basic-fruits': ['Apple', 'Banana', 'Orange', 'Strawberry', 'Watermelon'],
      'basic-family': ['Mother', 'Father', 'Sister', 'Brother', 'Grandmother'],
      'conversation-daily': ['Good morning. How are you today?', 'I am fine, thank you.', 'What did you do yesterday?'],
      'conversation-workplace': ['Good morning. Did you finish the project?', 'Yes, I completed it yesterday.'],
      'conversation-social': ['Are you coming to the party tonight?', 'Yes, I will be there.'],
      'paragraph-phone': ['Alexander Graham Bell patented the first practical telephone in 1876.'],
      'paragraph-business': ['Globalization and technological advancement have reshaped how companies operate.'],
      'paragraph-technology': ['Artificial intelligence can now perform complex tasks like image recognition.']
    };

    let sessionCount = 0;
    let resultCount = 0;

    // Generate data for the last 30 days
    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      
      // Random number of sessions per day (0-3)
      const sessionsPerDay = Math.floor(Math.random() * 4);
      
      for (let sessionIndex = 0; sessionIndex < sessionsPerDay; sessionIndex++) {
        const level = levels[Math.floor(Math.random() * levels.length)];
        const topicList = topics[level];
        const topic = topicList[Math.floor(Math.random() * topicList.length)];
        
        // Create session
        const sessionStartTime = new Date(date);
        sessionStartTime.setHours(Math.floor(Math.random() * 12) + 8); // 8 AM to 8 PM
        sessionStartTime.setMinutes(Math.floor(Math.random() * 60));
        
        const sessionEndTime = new Date(sessionStartTime);
        sessionEndTime.setMinutes(sessionEndTime.getMinutes() + Math.floor(Math.random() * 20) + 5); // 5-25 minutes
        
        const session = new SpeakingSession({
          userId: testUser._id,
          level,
          topic,
          startTime: sessionStartTime,
          endTime: sessionEndTime,
          status: 'completed',
          totalItems: Math.floor(Math.random() * 8) + 3, // 3-10 items
          completedItems: 0,
          averageAccuracy: 0,
          pronunciationScore: 0
        });

        await session.save();
        sessionCount++;

        // Create practice results for this session
        const textsForTopic = sampleTexts[`${level}-${topic}`] || ['Sample text'];
        const numResults = Math.floor(Math.random() * 5) + 3; // 3-7 results per session
        
        let sessionAccuracySum = 0;
        let sessionPronunciationSum = 0;
        
        for (let i = 0; i < numResults; i++) {
          const text = textsForTopic[i % textsForTopic.length];
          const accuracy = Math.floor(Math.random() * 40) + 60; // 60-100%
          const pronunciationScore = Math.floor(Math.random() * 35) + 65; // 65-100
          
          // Generate some common mistakes
          const commonMistakes = ['the', 'and', 'pronunciation', 'difficult', 'practice'];
          const mistakes = [];
          if (accuracy < 80) {
            const numMistakes = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numMistakes; j++) {
              mistakes.push(commonMistakes[Math.floor(Math.random() * commonMistakes.length)]);
            }
          }

          const result = new PracticeResult({
            userId: testUser._id,
            sessionId: session._id,
            itemId: (i + 1).toString(),
            text,
            meaning: `Nghĩa của: ${text}`,
            spokenText: text.toLowerCase() + (accuracy < 80 ? ' mistake' : ''),
            accuracy,
            pronunciationScore,
            level,
            topic,
            mistakes,
            createdAt: new Date(sessionStartTime.getTime() + i * 60000) // Spread results over session time
          });

          await result.save();
          resultCount++;
          
          sessionAccuracySum += accuracy;
          sessionPronunciationSum += pronunciationScore;
        }

        // Update session with calculated averages
        session.completedItems = numResults;
        session.averageAccuracy = Math.round(sessionAccuracySum / numResults);
        session.pronunciationScore = Math.round(sessionPronunciationSum / numResults);
        session.results = []; // We'll populate this if needed
        await session.save();
      }
    }

    // Create user progress
    const userProgress = new UserProgress({
      userId: testUser._id,
      totalSessions: sessionCount,
      totalPracticeTime: sessionCount * 15, // Average 15 minutes per session
      completedTopics: [
        { level: 'basic', topic: 'animals', averageScore: 85, totalAttempts: 10 },
        { level: 'basic', topic: 'fruits', averageScore: 78, totalAttempts: 8 },
        { level: 'conversation', topic: 'daily', averageScore: 72, totalAttempts: 12 }
      ],
      currentStreak: Math.floor(Math.random() * 10) + 1,
      longestStreak: Math.floor(Math.random() * 15) + 5,
      lastPracticeDate: new Date(),
      weeklyGoal: 5,
      monthlyGoal: 20,
      achievements: ['first_session', 'week_streak', 'accuracy_master'],
      level: 'conversation'
    });

    await userProgress.save();

    console.log(`✅ Created ${sessionCount} speaking sessions`);
    console.log(`✅ Created ${resultCount} practice results`);
    console.log('✅ Created user progress data');
    console.log('🎉 Speaking data seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding speaking data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedSpeakingData();