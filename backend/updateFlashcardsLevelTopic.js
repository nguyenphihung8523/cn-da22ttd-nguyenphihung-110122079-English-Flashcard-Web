const mongoose = require('mongoose');
const Flashcard = require('./models/Flashcard');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/english_flashcard_db';

// Mapping từ category sang level và topic
const categoryMapping = {
  // Cơ bản
  'basic-colors': { level: 'Cơ bản', topic: 'Màu sắc' },
  'basic-numbers': { level: 'Cơ bản', topic: 'Số đếm' },
  'basic-family': { level: 'Cơ bản', topic: 'Gia đình' },
  'basic-animals': { level: 'Cơ bản', topic: 'Động vật' },
  
  // Trung cấp
  'intermediate-jobs': { level: 'Trung cấp', topic: 'Công việc' },
  'intermediate-weather': { level: 'Trung cấp', topic: 'Thời tiết' },
  'intermediate-food': { level: 'Trung cấp', topic: 'Ẩm thực' },
  'intermediate-travel': { level: 'Trung cấp', topic: 'Du lịch' },
  
  // Nâng cao
  'advanced-business': { level: 'Nâng cao', topic: 'Kinh doanh' },
  'advanced-technology': { level: 'Nâng cao', topic: 'Công nghệ' },
  'advanced-science': { level: 'Nâng cao', topic: 'Khoa học' },
  'advanced-literature': { level: 'Nâng cao', topic: 'Văn học' },
  
  // Giao tiếp
  'communication-daily': { level: 'Giao tiếp', topic: 'Hàng ngày' },
  'communication-phone': { level: 'Giao tiếp', topic: 'Điện thoại' },
  'communication-social': { level: 'Giao tiếp', topic: 'Xã hội' },
  'communication-workplace': { level: 'Giao tiếp', topic: 'Công sở' },
  
  // Chuyên ngành - CNTT
  'specialized-it-software': { level: 'Chuyên ngành', topic: 'CNTT - Phần mềm' },
  'specialized-it-hardware': { level: 'Chuyên ngành', topic: 'CNTT - Phần cứng' },
  'specialized-it-network': { level: 'Chuyên ngành', topic: 'CNTT - Mạng' },
  'specialized-it-security': { level: 'Chuyên ngành', topic: 'CNTT - Bảo mật' },
  
  // Chuyên ngành - Kinh tế
  'specialized-econ-finance': { level: 'Chuyên ngành', topic: 'Kinh tế - Tài chính' },
  'specialized-econ-macro': { level: 'Chuyên ngành', topic: 'Kinh tế - Vĩ mô' },
  'specialized-econ-micro': { level: 'Chuyên ngành', topic: 'Kinh tế - Vi mô' },
  'specialized-econ-trade': { level: 'Chuyên ngành', topic: 'Kinh tế - Thương mại' },
  
  // Chuyên ngành - Y tế
  'specialized-med-anatomy': { level: 'Chuyên ngành', topic: 'Y tế - Giải phẫu' },
  'specialized-med-nursing': { level: 'Chuyên ngành', topic: 'Y tế - Điều dưỡng' },
  'specialized-med-pharma': { level: 'Chuyên ngành', topic: 'Y tế - Dược' },
  'specialized-med-surgery': { level: 'Chuyên ngành', topic: 'Y tế - Phẫu thuật' },
  
  // Chuyên ngành - Kỹ thuật
  'specialized-eng-civil': { level: 'Chuyên ngành', topic: 'Kỹ thuật - Xây dựng' },
  'specialized-eng-electrical': { level: 'Chuyên ngành', topic: 'Kỹ thuật - Điện' },
  'specialized-eng-mechanical': { level: 'Chuyên ngành', topic: 'Kỹ thuật - Cơ khí' },
  
  // Chuyên ngành - Giáo dục
  'specialized-edu-pedagogy': { level: 'Chuyên ngành', topic: 'Giáo dục - Sư phạm' },
  'specialized-edu-psychology': { level: 'Chuyên ngành', topic: 'Giáo dục - Tâm lý' }
};

async function updateFlashcards() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Kết nối MongoDB thành công');

    const flashcards = await Flashcard.find({});
    console.log(`📊 Tìm thấy ${flashcards.length} flashcards`);

    let updated = 0;
    for (const card of flashcards) {
      const mapping = categoryMapping[card.category];
      if (mapping) {
        await Flashcard.updateOne(
          { _id: card._id },
          { $set: { level: mapping.level, topic: mapping.topic } }
        );
        updated++;
      }
    }

    console.log(`✅ Đã cập nhật ${updated} flashcards với level và topic`);
    
    // Hiển thị thống kê
    const stats = await Flashcard.aggregate([
      { $group: { _id: { level: '$level', topic: '$topic' }, count: { $sum: 1 } } },
      { $sort: { '_id.level': 1, '_id.topic': 1 } }
    ]);
    
    console.log('\n📈 Thống kê:');
    stats.forEach(s => {
      console.log(`  ${s._id.level} - ${s._id.topic}: ${s.count} flashcards`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Hoàn tất!');
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

updateFlashcards();
