const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');
const userRoutes = require('./routes/userRoutes');
const learningRoutes = require('./routes/learningRoutes');
const quizRoutes = require('./routes/quizRoutes');
const reviewRoutes = require('./routes/review');
const speakingRoutes = require('./routes/speaking');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/english_flashcard_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

app.use('/api/auth', authRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/user', userRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/speaking', speakingRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send({message: 'Server is running'});
});

app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
