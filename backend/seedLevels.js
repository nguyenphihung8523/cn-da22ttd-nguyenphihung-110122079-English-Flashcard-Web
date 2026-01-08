const mongoose = require('mongoose');
require('dotenv').config();

const Level = require('./models/Level');

const defaultLevels = [
  { id: 'basic', name: 'Cơ bản', icon: '🌱', color: 'green', description: 'Từ vựng cơ bản cho người mới bắt đầu', order: 0 },
  { id: 'intermediate', name: 'Trung cấp', icon: '📈', color: 'blue', description: 'Từ vựng trung cấp', order: 1 },
  { id: 'advanced', name: 'Nâng cao', icon: '🚀', color: 'purple', description: 'Từ vựng nâng cao', order: 2 },
  { id: 'communication', name: 'Giao tiếp', icon: '💬', color: 'orange', description: 'Từ vựng giao tiếp hàng ngày', order: 3 },
  { id: 'specialized', name: 'Chuyên ngành', icon: '🎓', color: 'red', description: 'Từ vựng chuyên ngành', order: 4 }
];

const seedLevels = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing levels
    await Level.deleteMany({});
    console.log('Cleared existing levels');

    // Insert default levels
    await Level.insertMany(defaultLevels);
    console.log('Seeded default levels successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding levels:', error);
    process.exit(1);
  }
};

seedLevels();
