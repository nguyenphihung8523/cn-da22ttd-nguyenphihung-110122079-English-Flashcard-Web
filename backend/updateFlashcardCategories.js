const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flashcard = require('./models/Flashcard');

dotenv.config();

// Map topic name (Vietnamese) to topic ID
const topicNameToId = {
  // Basic
  'Màu sắc': 'colors',
  'Số đếm': 'numbers',
  'Gia đình': 'family',
  'Động vật': 'animals',
  'Con vật': 'animals',
  // Intermediate
  'Công việc': 'intermediate-jobs',
  'Thời tiết': 'intermediate-weather',
  'Ẩm thực': 'intermediate-food',
  'Thức ăn': 'intermediate-food',
  'Du lịch': 'intermediate-travel',
  // Advanced
  'Kinh doanh': 'advanced-business',
  'Công nghệ': 'advanced-technology',
  'Khoa học': 'advanced-science',
  'Văn học': 'advanced-literature',
  // Communication
  'Hàng ngày': 'daily',
  'Công sở': 'workplace',
  'Nơi làm việc': 'workplace',
  'Xã hội': 'social',
  'Điện thoại': 'phone',
  // Specialized IT
  'CNTT - Phần mềm': 'specialized-it-software',
  'CNTT - Phần cứng': 'specialized-it-hardware',
  'CNTT - Mạng': 'specialized-it-network',
  'CNTT - Bảo mật': 'specialized-it-security',
  // Specialized Economics
  'Kinh tế - Vĩ mô': 'specialized-econ-macro',
  'Kinh tế - Vi mô': 'specialized-econ-micro',
  'Kinh tế - Thương mại': 'specialized-econ-trade',
  'Kinh tế - Tài chính': 'specialized-econ-finance',
  // Specialized Medical
  'Y tế - Giải phẫu': 'specialized-med-anatomy',
  'Y tế - Dược': 'specialized-med-pharma',
  'Y tế - Phẫu thuật': 'specialized-med-surgery',
  'Y tế - Điều dưỡng': 'specialized-med-nursing',
  // Specialized Education
  'Giáo dục - Sư phạm': 'specialized-edu-pedagogy',
  'Giáo dục - Tâm lý': 'specialized-edu-psychology',
  // Specialized Engineering
  'Kỹ thuật - Xây dựng': 'specialized-eng-civil',
  'Kỹ thuật - Cơ khí': 'specialized-eng-mechanical',
  'Kỹ thuật - Điện': 'specialized-eng-electrical'
};

// Map level name (Vietnamese) to level ID
const levelNameToId = {
  'Cơ bản': 'basic',
  'Trung cấp': 'intermediate',
  'Nâng cao': 'advanced',
  'Giao tiếp': 'communication',
  'Chuyên ngành': 'specialized',
  'basic': 'basic',
  'intermediate': 'intermediate',
  'advanced': 'advanced',
  'communication': 'communication',
  'specialized': 'specialized'
};

const updateCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Kết nối MongoDB thành công');

    const flashcards = await Flashcard.find({});
    console.log(`📊 Tìm thấy ${flashcards.length} flashcards`);

    let updated = 0;
    for (const card of flashcards) {
      const levelId = levelNameToId[card.level] || card.level?.toLowerCase() || 'basic';
      
      // Tìm topic ID từ topic name
      let topicId = topicNameToId[card.topic];
      
      // Nếu không tìm thấy trong map, giữ nguyên topic nếu đã là ID
      if (!topicId) {
        if (card.topic && card.topic.includes('-')) {
          topicId = card.topic;
        } else if (card.topic) {
          // Topic chưa được map, tạo ID từ topic name
          topicId = card.topic.toLowerCase().replace(/\s+/g, '-');
        } else {
          topicId = 'general';
        }
      }
      
      // Tạo category
      const newCategory = topicId.includes('-') ? topicId : `${levelId}-${topicId}`;
      
      // Cập nhật cả topic và category
      const updates = {};
      if (card.topic !== topicId) {
        updates.topic = topicId;
      }
      if (card.category !== newCategory) {
        updates.category = newCategory;
      }
      if (card.level !== levelId) {
        updates.level = levelId;
      }

      if (Object.keys(updates).length > 0) {
        await Flashcard.findByIdAndUpdate(card._id, updates);
        console.log(`  ✅ "${card.word}" -> level: ${levelId}, topic: ${topicId}, category: ${newCategory}`);
        updated++;
      }
    }

    console.log(`\n🎉 Hoàn tất! Đã cập nhật ${updated}/${flashcards.length} flashcards`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
};

updateCategories();
