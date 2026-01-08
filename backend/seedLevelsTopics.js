const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Level = require('./models/Level');
const Topic = require('./models/Topic');

dotenv.config();

const defaultLevels = [
  { id: 'basic', name: 'Cơ bản', icon: '📚', color: 'blue', description: 'Từ vựng cơ bản cho người mới bắt đầu', order: 0 },
  { id: 'intermediate', name: 'Trung cấp', icon: '📖', color: 'green', description: 'Mở rộng vốn từ vựng hàng ngày', order: 1 },
  { id: 'advanced', name: 'Nâng cao', icon: '🎓', color: 'purple', description: 'Từ vựng chuyên sâu và học thuật', order: 2 },
  { id: 'communication', name: 'Giao tiếp', icon: '💬', color: 'orange', description: 'Kỹ năng giao tiếp thực tế', order: 3 },
  { id: 'specialized', name: 'Chuyên ngành', icon: '💼', color: 'red', description: 'Tiếng Anh chuyên ngành', order: 4 }
];

const defaultTopics = {
  basic: [
    { id: 'colors', name: 'Màu sắc', icon: '🎨', order: 0 },
    { id: 'numbers', name: 'Số đếm', icon: '🔢', order: 1 },
    { id: 'family', name: 'Gia đình', icon: '👨‍👩‍👧‍👦', order: 2 },
    { id: 'animals', name: 'Con vật', icon: '🐾', order: 3 }
  ],
  intermediate: [
    { id: 'intermediate-food', name: 'Thức ăn', icon: '🍽️', order: 0 },
    { id: 'intermediate-travel', name: 'Du lịch', icon: '✈️', order: 1 },
    { id: 'intermediate-weather', name: 'Thời tiết', icon: '🌤️', order: 2 },
    { id: 'intermediate-jobs', name: 'Công việc', icon: '💼', order: 3 }
  ],
  advanced: [
    { id: 'advanced-business', name: 'Kinh doanh', icon: '💼', order: 0 },
    { id: 'advanced-technology', name: 'Công nghệ', icon: '💻', order: 1 },
    { id: 'advanced-science', name: 'Khoa học', icon: '🔬', order: 2 },
    { id: 'advanced-literature', name: 'Văn học', icon: '📚', order: 3 }
  ],
  communication: [
    { id: 'daily', name: 'Hàng ngày', icon: '☀️', order: 0 },
    { id: 'workplace', name: 'Nơi làm việc', icon: '🏢', order: 1 },
    { id: 'social', name: 'Xã hội', icon: '👥', order: 2 },
    { id: 'phone', name: 'Điện thoại', icon: '📱', order: 3 }
  ],
  'specialized-it': [
    { id: 'specialized-it-software', name: 'Phần mềm', icon: '💻', order: 0 },
    { id: 'specialized-it-hardware', name: 'Phần cứng', icon: '🖥️', order: 1 },
    { id: 'specialized-it-network', name: 'Mạng', icon: '🌐', order: 2 },
    { id: 'specialized-it-security', name: 'Bảo mật', icon: '🔒', order: 3 }
  ],
  'specialized-economics': [
    { id: 'specialized-econ-macro', name: 'Kinh tế vĩ mô', icon: '📊', order: 0 },
    { id: 'specialized-econ-micro', name: 'Kinh tế vi mô', icon: '💹', order: 1 },
    { id: 'specialized-econ-trade', name: 'Thương mại', icon: '🏪', order: 2 },
    { id: 'specialized-econ-finance', name: 'Tài chính', icon: '💰', order: 3 }
  ],
  'specialized-medical': [
    { id: 'specialized-med-anatomy', name: 'Giải phẫu', icon: '🫀', order: 0 },
    { id: 'specialized-med-pharma', name: 'Dược học', icon: '💊', order: 1 },
    { id: 'specialized-med-surgery', name: 'Phẫu thuật', icon: '🔬', order: 2 },
    { id: 'specialized-med-nursing', name: 'Điều dưỡng', icon: '⚕️', order: 3 }
  ],
  'specialized-education': [
    { id: 'specialized-edu-pedagogy', name: 'Sư phạm', icon: '📚', order: 0 },
    { id: 'specialized-edu-psychology', name: 'Tâm lý học', icon: '🧠', order: 1 },
    { id: 'specialized-edu-curriculum', name: 'Chương trình học', icon: '📖', order: 2 },
    { id: 'specialized-edu-assessment', name: 'Đánh giá', icon: '✅', order: 3 }
  ],
  'specialized-engineering': [
    { id: 'specialized-eng-civil', name: 'Xây dựng', icon: '🏗️', order: 0 },
    { id: 'specialized-eng-mechanical', name: 'Cơ khí', icon: '⚙️', order: 1 },
    { id: 'specialized-eng-electrical', name: 'Điện', icon: '⚡', order: 2 },
    { id: 'specialized-eng-chemical', name: 'Hóa học', icon: '🧪', order: 3 }
  ]
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Kết nối MongoDB thành công');

    // Seed Levels
    console.log('\n📚 Đang seed Levels...');
    for (const levelData of defaultLevels) {
      const existing = await Level.findOne({ id: levelData.id });
      if (!existing) {
        await Level.create(levelData);
        console.log(`  ✅ Tạo level: ${levelData.name}`);
      } else {
        console.log(`  ⏭️ Level đã tồn tại: ${levelData.name}`);
      }
    }

    // Seed Topics
    console.log('\n📖 Đang seed Topics...');
    for (const [levelId, topics] of Object.entries(defaultTopics)) {
      for (const topicData of topics) {
        const existing = await Topic.findOne({ id: topicData.id, levelId });
        if (!existing) {
          await Topic.create({ ...topicData, levelId });
          console.log(`  ✅ Tạo topic: ${topicData.name} (${levelId})`);
        } else {
          console.log(`  ⏭️ Topic đã tồn tại: ${topicData.name} (${levelId})`);
        }
      }
    }

    console.log('\n🎉 Seed dữ liệu hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
};

seedData();
