const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SpeakingTopic = require('./models/SpeakingTopic');
const SpeakingItem = require('./models/SpeakingItem');
const SpeakingLevel = require('./models/SpeakingLevel');

dotenv.config();

const speakingLevels = [
  { id: 'basic', name: 'Cơ bản', icon: '🌱', description: 'Từ vựng đơn giản', order: 0 },
  { id: 'conversation', name: 'Giao tiếp', icon: '💬', description: 'Hội thoại hàng ngày', order: 1 },
  { id: 'paragraph', name: 'Đoạn văn', icon: '📝', description: 'Đoạn văn mẫu', order: 2 }
];

const speakingTopics = [
  // Basic level
  { id: 'animals', name: 'Động vật', icon: '🐾', levelId: 'basic', order: 0 },
  { id: 'fruits', name: 'Trái cây', icon: '🍎', levelId: 'basic', order: 1 },
  { id: 'colors', name: 'Màu sắc', icon: '🎨', levelId: 'basic', order: 2 },
  { id: 'family', name: 'Gia đình', icon: '👨‍👩‍👧‍👦', levelId: 'basic', order: 3 },
  // Conversation level
  { id: 'daily', name: 'Hàng ngày', icon: '☀️', levelId: 'conversation', order: 0 },
  { id: 'shopping', name: 'Mua sắm', icon: '🛒', levelId: 'conversation', order: 1 },
  { id: 'restaurant', name: 'Nhà hàng', icon: '🍽️', levelId: 'conversation', order: 2 },
  { id: 'travel', name: 'Du lịch', icon: '✈️', levelId: 'conversation', order: 3 },
  // Paragraph level
  { id: 'phone', name: 'Điện thoại', icon: '📞', levelId: 'paragraph', order: 0 },
  { id: 'business', name: 'Kinh doanh', icon: '💼', levelId: 'paragraph', order: 1 },
  { id: 'technology', name: 'Công nghệ', icon: '💻', levelId: 'paragraph', order: 2 }
];

const speakingItems = [
  // Basic - Animals
  { text: 'Cat', meaning: 'Con mèo', level: 'basic', topic: 'animals', order: 0 },
  { text: 'Dog', meaning: 'Con chó', level: 'basic', topic: 'animals', order: 1 },
  { text: 'Bird', meaning: 'Con chim', level: 'basic', topic: 'animals', order: 2 },
  { text: 'Fish', meaning: 'Con cá', level: 'basic', topic: 'animals', order: 3 },
  { text: 'Rabbit', meaning: 'Con thỏ', level: 'basic', topic: 'animals', order: 4 },
  { text: 'Horse', meaning: 'Con ngựa', level: 'basic', topic: 'animals', order: 5 },
  { text: 'Elephant', meaning: 'Con voi', level: 'basic', topic: 'animals', order: 6 },
  { text: 'Lion', meaning: 'Sư tử', level: 'basic', topic: 'animals', order: 7 },
  // Basic - Fruits
  { text: 'Apple', meaning: 'Quả táo', level: 'basic', topic: 'fruits', order: 0 },
  { text: 'Banana', meaning: 'Quả chuối', level: 'basic', topic: 'fruits', order: 1 },
  { text: 'Orange', meaning: 'Quả cam', level: 'basic', topic: 'fruits', order: 2 },
  { text: 'Strawberry', meaning: 'Quả dâu', level: 'basic', topic: 'fruits', order: 3 },
  { text: 'Grape', meaning: 'Quả nho', level: 'basic', topic: 'fruits', order: 4 },
  { text: 'Watermelon', meaning: 'Quả dưa hấu', level: 'basic', topic: 'fruits', order: 5 },
  { text: 'Mango', meaning: 'Quả xoài', level: 'basic', topic: 'fruits', order: 6 },
  { text: 'Pineapple', meaning: 'Quả dứa', level: 'basic', topic: 'fruits', order: 7 },
  // Basic - Colors
  { text: 'Red', meaning: 'Màu đỏ', level: 'basic', topic: 'colors', order: 0 },
  { text: 'Blue', meaning: 'Màu xanh dương', level: 'basic', topic: 'colors', order: 1 },
  { text: 'Green', meaning: 'Màu xanh lá', level: 'basic', topic: 'colors', order: 2 },
  { text: 'Yellow', meaning: 'Màu vàng', level: 'basic', topic: 'colors', order: 3 },
  { text: 'Black', meaning: 'Màu đen', level: 'basic', topic: 'colors', order: 4 },
  { text: 'White', meaning: 'Màu trắng', level: 'basic', topic: 'colors', order: 5 },
  { text: 'Purple', meaning: 'Màu tím', level: 'basic', topic: 'colors', order: 6 },
  { text: 'Pink', meaning: 'Màu hồng', level: 'basic', topic: 'colors', order: 7 },
  // Basic - Family
  { text: 'Mother', meaning: 'Mẹ', level: 'basic', topic: 'family', order: 0 },
  { text: 'Father', meaning: 'Bố', level: 'basic', topic: 'family', order: 1 },
  { text: 'Sister', meaning: 'Chị/Em gái', level: 'basic', topic: 'family', order: 2 },
  { text: 'Brother', meaning: 'Anh/Em trai', level: 'basic', topic: 'family', order: 3 },
  { text: 'Grandmother', meaning: 'Bà', level: 'basic', topic: 'family', order: 4 },
  { text: 'Grandfather', meaning: 'Ông', level: 'basic', topic: 'family', order: 5 },
  { text: 'Aunt', meaning: 'Cô/Dì', level: 'basic', topic: 'family', order: 6 },
  { text: 'Uncle', meaning: 'Chú/Bác', level: 'basic', topic: 'family', order: 7 },

  // Conversation - Daily
  { text: 'Good morning. How are you today?', meaning: 'Chào buổi sáng. Hôm nay bạn khỏe không?', level: 'conversation', topic: 'daily', order: 0 },
  { text: 'What time is it?', meaning: 'Mấy giờ rồi?', level: 'conversation', topic: 'daily', order: 1 },
  { text: 'Have a nice day!', meaning: 'Chúc bạn một ngày tốt lành!', level: 'conversation', topic: 'daily', order: 2 },
  { text: 'See you later.', meaning: 'Hẹn gặp lại.', level: 'conversation', topic: 'daily', order: 3 },
  { text: 'How was your weekend?', meaning: 'Cuối tuần của bạn thế nào?', level: 'conversation', topic: 'daily', order: 4 },
  { text: 'What are you doing?', meaning: 'Bạn đang làm gì?', level: 'conversation', topic: 'daily', order: 5 },
  { text: 'Nice to meet you.', meaning: 'Rất vui được gặp bạn.', level: 'conversation', topic: 'daily', order: 6 },
  { text: 'Thank you very much.', meaning: 'Cảm ơn bạn rất nhiều.', level: 'conversation', topic: 'daily', order: 7 },
  // Conversation - Shopping
  { text: 'How much is this?', meaning: 'Cái này giá bao nhiêu?', level: 'conversation', topic: 'shopping', order: 0 },
  { text: 'Do you have this in another size?', meaning: 'Bạn có size khác không?', level: 'conversation', topic: 'shopping', order: 1 },
  { text: 'Can I try this on?', meaning: 'Tôi có thể thử không?', level: 'conversation', topic: 'shopping', order: 2 },
  { text: 'Where is the fitting room?', meaning: 'Phòng thử đồ ở đâu?', level: 'conversation', topic: 'shopping', order: 3 },
  { text: 'I would like to pay.', meaning: 'Tôi muốn thanh toán.', level: 'conversation', topic: 'shopping', order: 4 },
  { text: 'Do you accept credit cards?', meaning: 'Bạn có chấp nhận thẻ tín dụng không?', level: 'conversation', topic: 'shopping', order: 5 },
  { text: 'Can I get a receipt?', meaning: 'Tôi có thể lấy hóa đơn không?', level: 'conversation', topic: 'shopping', order: 6 },
  { text: 'Thank you for your help.', meaning: 'Cảm ơn bạn đã giúp đỡ.', level: 'conversation', topic: 'shopping', order: 7 },
  // Conversation - Restaurant
  { text: 'A table for two, please.', meaning: 'Một bàn cho hai người.', level: 'conversation', topic: 'restaurant', order: 0 },
  { text: 'What do you recommend?', meaning: 'Bạn khuyên gì?', level: 'conversation', topic: 'restaurant', order: 1 },
  { text: 'I would like to order.', meaning: 'Tôi muốn gọi món.', level: 'conversation', topic: 'restaurant', order: 2 },
  { text: 'Can I have the menu?', meaning: 'Tôi có thể lấy thực đơn không?', level: 'conversation', topic: 'restaurant', order: 3 },
  { text: 'Is this spicy?', meaning: 'Cái này có cay không?', level: 'conversation', topic: 'restaurant', order: 4 },
  { text: 'Can I have the bill?', meaning: 'Tôi có thể lấy hóa đơn không?', level: 'conversation', topic: 'restaurant', order: 5 },
  { text: 'The food is delicious!', meaning: 'Món ăn ngon quá!', level: 'conversation', topic: 'restaurant', order: 6 },
  { text: 'Thank you for the meal.', meaning: 'Cảm ơn bữa ăn ngon lành.', level: 'conversation', topic: 'restaurant', order: 7 },
  // Conversation - Travel
  { text: 'Where is the train station?', meaning: 'Ga tàu ở đâu?', level: 'conversation', topic: 'travel', order: 0 },
  { text: 'How do I get to the airport?', meaning: 'Làm thế nào để đến sân bay?', level: 'conversation', topic: 'travel', order: 1 },
  { text: 'Can you help me with directions?', meaning: 'Bạn có thể giúp tôi chỉ đường không?', level: 'conversation', topic: 'travel', order: 2 },
  { text: 'How much is a ticket?', meaning: 'Vé giá bao nhiêu?', level: 'conversation', topic: 'travel', order: 3 },
  { text: 'What time does the bus leave?', meaning: 'Xe buýt khởi hành lúc mấy giờ?', level: 'conversation', topic: 'travel', order: 4 },
  { text: 'Is this the right way?', meaning: 'Đây có phải là đường đúng không?', level: 'conversation', topic: 'travel', order: 5 },
  { text: 'Can you recommend a hotel?', meaning: 'Bạn có thể giới thiệu khách sạn không?', level: 'conversation', topic: 'travel', order: 6 },
  { text: 'Thank you for your help.', meaning: 'Cảm ơn bạn đã giúp đỡ.', level: 'conversation', topic: 'travel', order: 7 },
  // Paragraph - Phone
  { text: 'The telephone has revolutionized communication across the world.', meaning: 'Điện thoại đã cách mạng hóa giao tiếp trên toàn thế giới.', level: 'paragraph', topic: 'phone', order: 0 },
  { text: 'Mobile phones have become an essential part of modern life.', meaning: 'Điện thoại di động đã trở thành một phần thiết yếu của cuộc sống hiện đại.', level: 'paragraph', topic: 'phone', order: 1 },
  { text: 'Video calling technology has changed how families stay connected.', meaning: 'Công nghệ gọi video đã thay đổi cách các gia đình kết nối với nhau.', level: 'paragraph', topic: 'phone', order: 2 },
  { text: 'The history of telecommunications spans over a century.', meaning: 'Lịch sử viễn thông kéo dài hơn một thế kỷ.', level: 'paragraph', topic: 'phone', order: 3 },
  // Paragraph - Business
  { text: 'Business communication is the foundation of successful organizations.', meaning: 'Giao tiếp kinh doanh là nền tảng của các tổ chức thành công.', level: 'paragraph', topic: 'business', order: 0 },
  { text: 'Corporate meetings are essential for decision making and strategic planning.', meaning: 'Các cuộc họp công ty là thiết yếu để ra quyết định và lập kế hoạch chiến lược.', level: 'paragraph', topic: 'business', order: 1 },
  { text: 'Professional presentations require careful preparation and clear communication.', meaning: 'Các bài thuyết trình chuyên nghiệp đòi hỏi chuẩn bị cẩn thận và giao tiếp rõ ràng.', level: 'paragraph', topic: 'business', order: 2 },
  { text: 'Leadership in business requires strong communication skills.', meaning: 'Lãnh đạo trong kinh doanh đòi hỏi kỹ năng giao tiếp mạnh mẽ.', level: 'paragraph', topic: 'business', order: 3 },
  // Paragraph - Technology
  { text: 'Artificial intelligence is transforming industries and changing how we work.', meaning: 'Trí tuệ nhân tạo đang chuyển đổi các ngành công nghiệp và thay đổi cách chúng ta làm việc.', level: 'paragraph', topic: 'technology', order: 0 },
  { text: 'Cloud computing has revolutionized data storage and accessibility.', meaning: 'Điện toán đám mây đã cách mạng hóa lưu trữ và khả năng truy cập dữ liệu.', level: 'paragraph', topic: 'technology', order: 1 },
  { text: 'Cybersecurity is increasingly important as digital threats continue to evolve.', meaning: 'An ninh mạng ngày càng trở nên quan trọng khi các mối đe dọa kỹ thuật số tiếp tục phát triển.', level: 'paragraph', topic: 'technology', order: 2 },
  { text: 'The Internet of Things connects billions of devices worldwide.', meaning: 'Internet of Things kết nối hàng tỷ thiết bị trên toàn thế giới.', level: 'paragraph', topic: 'technology', order: 3 }
];

async function seedSpeakingData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/english_flashcard_db');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await SpeakingLevel.deleteMany({});
    await SpeakingTopic.deleteMany({});
    await SpeakingItem.deleteMany({});
    console.log('🗑️ Cleared existing speaking data');

    // Insert levels
    await SpeakingLevel.insertMany(speakingLevels);
    console.log(`✅ Inserted ${speakingLevels.length} speaking levels`);

    // Insert topics
    await SpeakingTopic.insertMany(speakingTopics);
    console.log(`✅ Inserted ${speakingTopics.length} speaking topics`);

    // Insert items
    await SpeakingItem.insertMany(speakingItems);
    console.log(`✅ Inserted ${speakingItems.length} speaking items`);

    console.log('🎉 Speaking data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding speaking data:', error);
    process.exit(1);
  }
}

seedSpeakingData();
