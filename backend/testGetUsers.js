const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/english_flashcard_db')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const users = await User.find().select('-password');
    console.log('Total users in database:', users.length);
    
    if (users.length > 0) {
      console.log('\nUsers:');
      users.forEach(user => {
        console.log(`- ${user.username} (${user.email}) - Role: ${user.role}`);
      });
    } else {
      console.log('No users found in database');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
