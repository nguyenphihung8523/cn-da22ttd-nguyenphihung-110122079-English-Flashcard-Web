const mongoose = require('mongoose');
const QuizQuestion = require('./models/QuizQuestion');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/english_flashcard_db';

const quizQuestionsData = [
  // Câu 1: Màu sắc
  {
    question: "The sky is ___",
    questionVi: "Bầu trời màu ___",
    options: [
      { text: "Red", textVi: "Đỏ", isCorrect: false },
      { text: "Blue", textVi: "Xanh dương", isCorrect: true },
      { text: "Green", textVi: "Xanh lá", isCorrect: false },
      { text: "Yellow", textVi: "Vàng", isCorrect: false }
    ],
    level: "basic",
    category: "colors",
    explanation: "Bầu trời có màu xanh dương (blue)."
  },

  // Câu 2: Số đếm
  {
    question: "How many days are there in a week?",
    questionVi: "Một tuần có bao nhiêu ngày?",
    options: [
      { text: "Five", textVi: "Năm", isCorrect: false },
      { text: "Six", textVi: "Sáu", isCorrect: false },
      { text: "Seven", textVi: "Bảy", isCorrect: true },
      { text: "Eight", textVi: "Tám", isCorrect: false }
    ],
    level: "basic",
    category: "numbers",
    explanation: "Một tuần có bảy ngày (seven days)."
  },

  // Câu 3: Gia đình
  {
    question: "My ___ is a teacher",
    questionVi: "___ tôi là một giáo viên",
    options: [
      { text: "Mother", textVi: "Mẹ", isCorrect: false },
      { text: "Father", textVi: "Bố", isCorrect: true },
      { text: "Sister", textVi: "Chị/em gái", isCorrect: false },
      { text: "Brother", textVi: "Anh/em trai", isCorrect: false }
    ],
    level: "basic",
    category: "family",
    explanation: "Trong câu này, 'father' (bố) là đáp án đúng."
  },

  // Câu 4: Con vật
  {
    question: "Which animal is called 'the king of animals'?",
    questionVi: "Động vật nào được gọi là 'vua của các loài động vật'?",
    options: [
      { text: "Tiger", textVi: "Hổ", isCorrect: false },
      { text: "Elephant", textVi: "Voi", isCorrect: false },
      { text: "Lion", textVi: "Sư tử", isCorrect: true },
      { text: "Bear", textVi: "Gấu", isCorrect: false }
    ],
    level: "basic",
    category: "animals",
    explanation: "Sư tử (lion) được gọi là vua của các loài động vật."
  },

  // Câu 5: Màu sắc
  {
    question: "Snow is ___",
    questionVi: "Tuyết màu ___",
    options: [
      { text: "Black", textVi: "Đen", isCorrect: false },
      { text: "White", textVi: "Trắng", isCorrect: true },
      { text: "Gray", textVi: "Xám", isCorrect: false },
      { text: "Brown", textVi: "Nâu", isCorrect: false }
    ],
    level: "basic",
    category: "colors",
    explanation: "Tuyết có màu trắng (white)."
  },

  // Câu 6: Số đếm
  {
    question: "I have ___ fingers",
    questionVi: "Tôi có ___ ngón tay",
    options: [
      { text: "Eight", textVi: "Tám", isCorrect: false },
      { text: "Nine", textVi: "Chín", isCorrect: false },
      { text: "Ten", textVi: "Mười", isCorrect: true },
      { text: "Seven", textVi: "Bảy", isCorrect: false }
    ],
    level: "basic",
    category: "numbers",
    explanation: "Con người có mười ngón tay (ten fingers)."
  },

  // Câu 7: Con vật
  {
    question: "Which animal likes bananas?",
    questionVi: "Động vật nào thích ăn chuối?",
    options: [
      { text: "Dog", textVi: "Chó", isCorrect: false },
      { text: "Cat", textVi: "Mèo", isCorrect: false },
      { text: "Monkey", textVi: "Khỉ", isCorrect: true },
      { text: "Fish", textVi: "Cá", isCorrect: false }
    ],
    level: "basic",
    category: "animals",
    explanation: "Khỉ (monkey) thích ăn chuối."
  },

  // Câu 8: Gia đình
  {
    question: "My ___ tells great stories",
    questionVi: "___ tôi kể những câu chuyện hay",
    options: [
      { text: "Grandfather", textVi: "Ông", isCorrect: false },
      { text: "Grandmother", textVi: "Bà", isCorrect: true },
      { text: "Father", textVi: "Bố", isCorrect: false },
      { text: "Mother", textVi: "Mẹ", isCorrect: false }
    ],
    level: "basic",
    category: "family",
    explanation: "Trong câu này, 'grandmother' (bà) là đáp án đúng."
  },

  // Câu 9: Màu sắc
  {
    question: "The grass is ___",
    questionVi: "Cỏ màu ___",
    options: [
      { text: "Red", textVi: "Đỏ", isCorrect: false },
      { text: "Blue", textVi: "Xanh dương", isCorrect: false },
      { text: "Green", textVi: "Xanh lá", isCorrect: true },
      { text: "Purple", textVi: "Tím", isCorrect: false }
    ],
    level: "basic",
    category: "colors",
    explanation: "Cỏ có màu xanh lá (green)."
  },

  // Câu 10: Con vật
  {
    question: "Which animal lives in water?",
    questionVi: "Động vật nào sống trong nước?",
    options: [
      { text: "Bird", textVi: "Chim", isCorrect: false },
      { text: "Rabbit", textVi: "Thỏ", isCorrect: false },
      { text: "Fish", textVi: "Cá", isCorrect: true },
      { text: "Monkey", textVi: "Khỉ", isCorrect: false }
    ],
    level: "basic",
    category: "animals",
    explanation: "Cá (fish) sống trong nước."
  },

  // Câu 11: Thời gian
  {
    question: "What time do you usually wake up?",
    questionVi: "Bạn thường thức dậy lúc mấy giờ?",
    options: [
      { text: "In the morning", textVi: "Vào buổi sáng", isCorrect: true },
      { text: "In the afternoon", textVi: "Vào buổi chiều", isCorrect: false },
      { text: "In the evening", textVi: "Vào buổi tối", isCorrect: false },
      { text: "At night", textVi: "Vào ban đêm", isCorrect: false }
    ],
    level: "basic",
    category: "time",
    explanation: "Mọi người thường thức dậy vào buổi sáng (in the morning)."
  },

  // Câu 12: Đồ vật
  {
    question: "What do you use to write?",
    questionVi: "Bạn dùng gì để viết?",
    options: [
      { text: "Spoon", textVi: "Thìa", isCorrect: false },
      { text: "Pen", textVi: "Bút", isCorrect: true },
      { text: "Cup", textVi: "Cốc", isCorrect: false },
      { text: "Plate", textVi: "Đĩa", isCorrect: false }
    ],
    level: "basic",
    category: "objects",
    explanation: "Chúng ta dùng bút (pen) để viết."
  },

  // Câu 13: Thức ăn
  {
    question: "Which is a fruit?",
    questionVi: "Đâu là trái cây?",
    options: [
      { text: "Carrot", textVi: "Cà rốt", isCorrect: false },
      { text: "Apple", textVi: "Táo", isCorrect: true },
      { text: "Potato", textVi: "Khoai tây", isCorrect: false },
      { text: "Onion", textVi: "Hành tây", isCorrect: false }
    ],
    level: "basic",
    category: "food",
    explanation: "Táo (apple) là trái cây."
  },

  // Câu 14: Cơ thể
  {
    question: "How many eyes do you have?",
    questionVi: "Bạn có bao nhiêu mắt?",
    options: [
      { text: "One", textVi: "Một", isCorrect: false },
      { text: "Two", textVi: "Hai", isCorrect: true },
      { text: "Three", textVi: "Ba", isCorrect: false },
      { text: "Four", textVi: "Bốn", isCorrect: false }
    ],
    level: "basic",
    category: "body",
    explanation: "Con người có hai mắt (two eyes)."
  },

  // Câu 15: Thời tiết
  {
    question: "When it rains, you need an ___",
    questionVi: "Khi trời mưa, bạn cần một ___",
    options: [
      { text: "Umbrella", textVi: "Ô", isCorrect: true },
      { text: "Sunglasses", textVi: "Kính râm", isCorrect: false },
      { text: "Hat", textVi: "Mũ", isCorrect: false },
      { text: "Scarf", textVi: "Khăn quàng", isCorrect: false }
    ],
    level: "basic",
    category: "weather",
    explanation: "Khi trời mưa, chúng ta cần ô (umbrella)."
  },

  // Câu 16: Phương tiện
  {
    question: "What do you use to travel on roads?",
    questionVi: "Bạn dùng gì để di chuyển trên đường?",
    options: [
      { text: "Boat", textVi: "Thuyền", isCorrect: false },
      { text: "Plane", textVi: "Máy bay", isCorrect: false },
      { text: "Car", textVi: "Ô tô", isCorrect: true },
      { text: "Fish", textVi: "Cá", isCorrect: false }
    ],
    level: "basic",
    category: "transport",
    explanation: "Chúng ta dùng ô tô (car) để di chuyển trên đường."
  },

  // Câu 17: Học tập
  {
    question: "Where do children go to learn?",
    questionVi: "Trẻ em đi đâu để học?",
    options: [
      { text: "Hospital", textVi: "Bệnh viện", isCorrect: false },
      { text: "School", textVi: "Trường học", isCorrect: true },
      { text: "Market", textVi: "Chợ", isCorrect: false },
      { text: "Park", textVi: "Công viên", isCorrect: false }
    ],
    level: "basic",
    category: "places",
    explanation: "Trẻ em đi trường học (school) để học."
  },

  // Câu 18: Cảm xúc
  {
    question: "When you are happy, you ___",
    questionVi: "Khi bạn vui, bạn ___",
    options: [
      { text: "Cry", textVi: "Khóc", isCorrect: false },
      { text: "Smile", textVi: "Cười", isCorrect: true },
      { text: "Sleep", textVi: "Ngủ", isCorrect: false },
      { text: "Run", textVi: "Chạy", isCorrect: false }
    ],
    level: "basic",
    category: "emotions",
    explanation: "Khi vui, chúng ta cười (smile)."
  },

  // Câu 19: Số đếm nâng cao
  {
    question: "What comes after nineteen?",
    questionVi: "Số nào đến sau nineteen (19)?",
    options: [
      { text: "Eighteen", textVi: "Mười tám", isCorrect: false },
      { text: "Twenty", textVi: "Hai mười", isCorrect: true },
      { text: "Seventeen", textVi: "Mười bảy", isCorrect: false },
      { text: "Sixteen", textVi: "Mười sáu", isCorrect: false }
    ],
    level: "basic",
    category: "numbers",
    explanation: "Sau nineteen (19) là twenty (20)."
  },

  // Câu 20: Hoạt động hàng ngày
  {
    question: "What do you do when you are hungry?",
    questionVi: "Bạn làm gì khi đói?",
    options: [
      { text: "Sleep", textVi: "Ngủ", isCorrect: false },
      { text: "Eat", textVi: "Ăn", isCorrect: true },
      { text: "Read", textVi: "Đọc", isCorrect: false },
      { text: "Sing", textVi: "Hát", isCorrect: false }
    ],
    level: "basic",
    category: "activities",
    explanation: "Khi đói, chúng ta ăn (eat)."
  },

  // ===== TRUNG CẤP (INTERMEDIATE) =====

  // Câu 1: Công việc
  {
    question: "A ___ helps sick people",
    questionVi: "___ giúp đỡ những người bệnh",
    options: [
      { text: "Teacher", textVi: "Giáo viên", isCorrect: false },
      { text: "Doctor", textVi: "Bác sĩ", isCorrect: true },
      { text: "Chef", textVi: "Đầu bếp", isCorrect: false },
      { text: "Pilot", textVi: "Phi công", isCorrect: false }
    ],
    level: "intermediate",
    category: "jobs",
    explanation: "Bác sĩ (doctor) giúp đỡ những người bệnh."
  },

  // Câu 2: Thời tiết
  {
    question: "When the weather is ___, you need an umbrella",
    questionVi: "Khi thời tiết ___,  bạn cần ô",
    options: [
      { text: "Sunny", textVi: "Nắng", isCorrect: false },
      { text: "Rainy", textVi: "Mưa", isCorrect: true },
      { text: "Cloudy", textVi: "Nhiều mây", isCorrect: false },
      { text: "Windy", textVi: "Có gió", isCorrect: false }
    ],
    level: "intermediate",
    category: "weather",
    explanation: "Khi thời tiết mưa (rainy), bạn cần ô."
  },

  // Câu 3: Thức ăn
  {
    question: "What meal do you eat in the morning?",
    questionVi: "Bạn ăn bữa nào vào buổi sáng?",
    options: [
      { text: "Lunch", textVi: "Bữa trưa", isCorrect: false },
      { text: "Dinner", textVi: "Bữa tối", isCorrect: false },
      { text: "Breakfast", textVi: "Bữa sáng", isCorrect: true },
      { text: "Snack", textVi: "Đồ ăn nhẹ", isCorrect: false }
    ],
    level: "intermediate",
    category: "food",
    explanation: "Bữa sáng (breakfast) là bữa ăn vào buổi sáng."
  },

  // Câu 4: Du lịch
  {
    question: "You need a ___ to travel to another country",
    questionVi: "Bạn cần ___ để du lịch sang nước khác",
    options: [
      { text: "Ticket", textVi: "Vé", isCorrect: false },
      { text: "Passport", textVi: "Hộ chiếu", isCorrect: true },
      { text: "Luggage", textVi: "Hành lý", isCorrect: false },
      { text: "Hotel", textVi: "Khách sạn", isCorrect: false }
    ],
    level: "intermediate",
    category: "travel",
    explanation: "Hộ chiếu (passport) là cần thiết để du lịch sang nước khác."
  },

  // Câu 5: Công việc
  {
    question: "A ___ teaches students in a classroom",
    questionVi: "___ dạy học sinh trong lớp học",
    options: [
      { text: "Doctor", textVi: "Bác sĩ", isCorrect: false },
      { text: "Teacher", textVi: "Giáo viên", isCorrect: true },
      { text: "Nurse", textVi: "Y tá", isCorrect: false },
      { text: "Chef", textVi: "Đầu bếp", isCorrect: false }
    ],
    level: "intermediate",
    category: "jobs",
    explanation: "Giáo viên (teacher) dạy học sinh trong lớp học."
  },

  // Câu 6: Thời tiết
  {
    question: "The weather is ___ when there are many clouds",
    questionVi: "Thời tiết ___ khi có nhiều mây",
    options: [
      { text: "Sunny", textVi: "Nắng", isCorrect: false },
      { text: "Rainy", textVi: "Mưa", isCorrect: false },
      { text: "Cloudy", textVi: "Nhiều mây", isCorrect: true },
      { text: "Snowy", textVi: "Có tuyết", isCorrect: false }
    ],
    level: "intermediate",
    category: "weather",
    explanation: "Thời tiết nhiều mây (cloudy) khi có nhiều mây."
  },

  // Câu 7: Thức ăn
  {
    question: "Which is a popular Italian food?",
    questionVi: "Đâu là một món ăn Ý nổi tiếng?",
    options: [
      { text: "Sushi", textVi: "Sushi", isCorrect: false },
      { text: "Pizza", textVi: "Pizza", isCorrect: true },
      { text: "Tacos", textVi: "Tacos", isCorrect: false },
      { text: "Curry", textVi: "Cà ri", isCorrect: false }
    ],
    level: "intermediate",
    category: "food",
    explanation: "Pizza là một món ăn Ý nổi tiếng."
  },

  // Câu 8: Du lịch
  {
    question: "Where do tourists usually stay when traveling?",
    questionVi: "Du khách thường ở đâu khi du lịch?",
    options: [
      { text: "Airport", textVi: "Sân bay", isCorrect: false },
      { text: "Museum", textVi: "Bảo tàng", isCorrect: false },
      { text: "Hotel", textVi: "Khách sạn", isCorrect: true },
      { text: "Beach", textVi: "Bãi biển", isCorrect: false }
    ],
    level: "intermediate",
    category: "travel",
    explanation: "Du khách thường ở khách sạn (hotel) khi du lịch."
  },

  // Câu 9: Công việc
  {
    question: "A ___ cooks food in a restaurant",
    questionVi: "___ nấu ăn trong nhà hàng",
    options: [
      { text: "Farmer", textVi: "Nông dân", isCorrect: false },
      { text: "Chef", textVi: "Đầu bếp", isCorrect: true },
      { text: "Pilot", textVi: "Phi công", isCorrect: false },
      { text: "Engineer", textVi: "Kỹ sư", isCorrect: false }
    ],
    level: "intermediate",
    category: "jobs",
    explanation: "Đầu bếp (chef) nấu ăn trong nhà hàng."
  },

  // Câu 10: Du lịch
  {
    question: "What is a popular beach destination?",
    questionVi: "Bãi biển nào là điểm đến nổi tiếng?",
    options: [
      { text: "Mountain", textVi: "Núi", isCorrect: false },
      { text: "Beach", textVi: "Bãi biển", isCorrect: true },
      { text: "City", textVi: "Thành phố", isCorrect: false },
      { text: "Forest", textVi: "Rừng", isCorrect: false }
    ],
    level: "intermediate",
    category: "travel",
    explanation: "Bãi biển (beach) là điểm đến nổi tiếng cho du lịch."
  },

  // ===== NÂNG CAO (ADVANCED) =====

  // Câu 1: Kinh doanh
  {
    question: "A ___ is a formal agreement between parties",
    questionVi: "___ là một thỏa thuận chính thức giữa các bên",
    options: [
      { text: "Contract", textVi: "Hợp đồng", isCorrect: true },
      { text: "Strategy", textVi: "Chiến lược", isCorrect: false },
      { text: "Investment", textVi: "Đầu tư", isCorrect: false },
      { text: "Profit", textVi: "Lợi nhuận", isCorrect: false }
    ],
    level: "advanced",
    category: "business",
    explanation: "Hợp đồng (contract) là một thỏa thuận chính thức giữa các bên."
  },

  // Câu 2: Công nghệ
  {
    question: "What protects your data from unauthorized access?",
    questionVi: "Cái gì bảo vệ dữ liệu của bạn khỏi truy cập trái phép?",
    options: [
      { text: "Encryption", textVi: "Mã hóa", isCorrect: true },
      { text: "Algorithm", textVi: "Thuật toán", isCorrect: false },
      { text: "Database", textVi: "Cơ sở dữ liệu", isCorrect: false },
      { text: "Interface", textVi: "Giao diện", isCorrect: false }
    ],
    level: "advanced",
    category: "technology",
    explanation: "Mã hóa (encryption) bảo vệ dữ liệu khỏi truy cập trái phép."
  },

  // Câu 3: Khoa học
  {
    question: "What is the process by which plants make their own food?",
    questionVi: "Quá trình nào giúp thực vật tạo ra thức ăn của chúng?",
    options: [
      { text: "Photosynthesis", textVi: "Quang hợp", isCorrect: true },
      { text: "Evolution", textVi: "Tiến hóa", isCorrect: false },
      { text: "Mutation", textVi: "Đột biến", isCorrect: false },
      { text: "Ecosystem", textVi: "Hệ sinh thái", isCorrect: false }
    ],
    level: "advanced",
    category: "science",
    explanation: "Quang hợp (photosynthesis) là quá trình thực vật tạo ra thức ăn."
  },

  // Câu 4: Văn học
  {
    question: "The main character in a story is called the ___",
    questionVi: "Nhân vật chính trong câu chuyện được gọi là ___",
    options: [
      { text: "Protagonist", textVi: "Nhân vật chính", isCorrect: true },
      { text: "Narrator", textVi: "Người kể chuyện", isCorrect: false },
      { text: "Antagonist", textVi: "Nhân vật phản diện", isCorrect: false },
      { text: "Author", textVi: "Tác giả", isCorrect: false }
    ],
    level: "advanced",
    category: "literature",
    explanation: "Nhân vật chính (protagonist) là nhân vật chính trong câu chuyện."
  },

  // Câu 5: Kinh doanh
  {
    question: "What is the money a company earns after expenses?",
    questionVi: "Tiền mà công ty kiếm được sau khi trừ chi phí là gì?",
    options: [
      { text: "Profit", textVi: "Lợi nhuận", isCorrect: true },
      { text: "Investment", textVi: "Đầu tư", isCorrect: false },
      { text: "Revenue", textVi: "Doanh thu", isCorrect: false },
      { text: "Dividend", textVi: "Cổ tức", isCorrect: false }
    ],
    level: "advanced",
    category: "business",
    explanation: "Lợi nhuận (profit) là tiền công ty kiếm được sau khi trừ chi phí."
  },

  // Câu 6: Công nghệ
  {
    question: "A ___ is a step-by-step procedure for solving a problem",
    questionVi: "___ là một quy trình từng bước để giải quyết vấn đề",
    options: [
      { text: "Algorithm", textVi: "Thuật toán", isCorrect: true },
      { text: "Server", textVi: "Máy chủ", isCorrect: false },
      { text: "Cloud", textVi: "Đám mây", isCorrect: false },
      { text: "Firewall", textVi: "Tường lửa", isCorrect: false }
    ],
    level: "advanced",
    category: "technology",
    explanation: "Thuật toán (algorithm) là quy trình từng bước để giải quyết vấn đề."
  },

  // Câu 7: Khoa học
  {
    question: "What is the center of an atom called?",
    questionVi: "Tâm của một nguyên tử được gọi là gì?",
    options: [
      { text: "Nucleus", textVi: "Hạt nhân", isCorrect: true },
      { text: "Molecule", textVi: "Phân tử", isCorrect: false },
      { text: "Electron", textVi: "Electron", isCorrect: false },
      { text: "Catalyst", textVi: "Chất xúc tác", isCorrect: false }
    ],
    level: "advanced",
    category: "science",
    explanation: "Hạt nhân (nucleus) là tâm của một nguyên tử."
  },

  // Câu 8: Văn học
  {
    question: "What literary device compares two things using 'like' or 'as'?",
    questionVi: "Kỹ thuật văn học nào so sánh hai điều bằng cách sử dụng 'like' hoặc 'as'?",
    options: [
      { text: "Simile", textVi: "So sánh", isCorrect: true },
      { text: "Metaphor", textVi: "Ẩn dụ", isCorrect: false },
      { text: "Irony", textVi: "Mỉa mai", isCorrect: false },
      { text: "Symbolism", textVi: "Biểu tượng", isCorrect: false }
    ],
    level: "advanced",
    category: "literature",
    explanation: "So sánh (simile) so sánh hai điều bằng 'like' hoặc 'as'."
  },

  // Câu 9: Kinh doanh
  {
    question: "What is it called when two companies combine into one?",
    questionVi: "Khi hai công ty kết hợp thành một được gọi là gì?",
    options: [
      { text: "Merger", textVi: "Sáp nhập", isCorrect: true },
      { text: "Negotiation", textVi: "Đàm phán", isCorrect: false },
      { text: "Strategy", textVi: "Chiến lược", isCorrect: false },
      { text: "Enterprise", textVi: "Doanh nghiệp", isCorrect: false }
    ],
    level: "advanced",
    category: "business",
    explanation: "Sáp nhập (merger) là khi hai công ty kết hợp thành một."
  },

  // Câu 10: Khoa học
  {
    question: "What is the gradual change of species over time called?",
    questionVi: "Sự thay đổi dần dần của các loài theo thời gian được gọi là gì?",
    options: [
      { text: "Evolution", textVi: "Tiến hóa", isCorrect: true },
      { text: "Mutation", textVi: "Đột biến", isCorrect: false },
      { text: "Ecosystem", textVi: "Hệ sinh thái", isCorrect: false },
      { text: "Hypothesis", textVi: "Giả thuyết", isCorrect: false }
    ],
    level: "advanced",
    category: "science",
    explanation: "Tiến hóa (evolution) là sự thay đổi dần dần của các loài theo thời gian."
  },

  // ===== GIAO TIẾP (COMMUNICATION) =====

  // Câu 1: Hàng ngày
  {
    question: "Good morning! How are you?",
    questionVi: "Chào buổi sáng! Bạn khỏe không?",
    options: [
      { text: "I'm fine, thank you. And you?", textVi: "Tôi khỏe, cảm ơn. Còn bạn?", isCorrect: true },
      { text: "I'm sleeping", textVi: "Tôi đang ngủ", isCorrect: false },
      { text: "Go away", textVi: "Đi xa", isCorrect: false },
      { text: "I don't know", textVi: "Tôi không biết", isCorrect: false }
    ],
    level: "communication",
    category: "daily",
    explanation: "Khi ai đó chào hỏi, bạn trả lời 'I'm fine, thank you. And you?'"
  },

  // Câu 2: Nơi làm việc
  {
    question: "We have a meeting at 2 PM.",
    questionVi: "Chúng ta có một cuộc họp lúc 2 giờ chiều.",
    options: [
      { text: "Okay, I'll be there.", textVi: "Được, tôi sẽ có mặt.", isCorrect: true },
      { text: "I don't care", textVi: "Tôi không quan tâm", isCorrect: false },
      { text: "That's not my job", textVi: "Đó không phải công việc của tôi", isCorrect: false },
      { text: "I'm too busy", textVi: "Tôi quá bận", isCorrect: false }
    ],
    level: "communication",
    category: "workplace",
    explanation: "Khi được thông báo về cuộc họp, bạn trả lời 'Okay, I'll be there.'"
  },

  // Câu 3: Xã hội
  {
    question: "Nice to meet you! What's your name?",
    questionVi: "Rất vui được gặp bạn! Tên bạn là gì?",
    options: [
      { text: "My name is John. Nice to meet you too.", textVi: "Tên tôi là John. Tôi cũng rất vui được gặp bạn.", isCorrect: true },
      { text: "I don't know", textVi: "Tôi không biết", isCorrect: false },
      { text: "Who are you?", textVi: "Bạn là ai?", isCorrect: false },
      { text: "Leave me alone", textVi: "Để tôi yên", isCorrect: false }
    ],
    level: "communication",
    category: "social",
    explanation: "Khi được giới thiệu, bạn trả lời với tên của mình."
  },

  // Câu 4: Điện thoại
  {
    question: "Hello, this is Sarah speaking. May I speak to Tom?",
    questionVi: "Xin chào, đây là Sarah. Tôi có thể nói chuyện với Tom không?",
    options: [
      { text: "One moment, please. I'll get him for you.", textVi: "Chờ một chút. Tôi sẽ gọi anh ấy cho bạn.", isCorrect: true },
      { text: "Tom is not here", textVi: "Tom không ở đây", isCorrect: false },
      { text: "Who is this?", textVi: "Đây là ai?", isCorrect: false },
      { text: "Call back later", textVi: "Gọi lại sau", isCorrect: false }
    ],
    level: "communication",
    category: "phone",
    explanation: "Khi ai đó gọi điện thoại xin nói chuyện, bạn trả lời lịch sự."
  },

  // Câu 5: Hàng ngày
  {
    question: "I'm sorry, I made a mistake.",
    questionVi: "Tôi xin lỗi, tôi đã mắc lỗi.",
    options: [
      { text: "That's okay. Don't worry about it.", textVi: "Không sao. Đừng lo lắng.", isCorrect: true },
      { text: "You're stupid", textVi: "Bạn ngu", isCorrect: false },
      { text: "I don't care", textVi: "Tôi không quan tâm", isCorrect: false },
      { text: "Go away", textVi: "Đi xa", isCorrect: false }
    ],
    level: "communication",
    category: "daily",
    explanation: "Khi ai đó xin lỗi, bạn trả lời một cách tử tế."
  },

  // Câu 6: Nơi làm việc
  {
    question: "Could you help me with this project?",
    questionVi: "Bạn có thể giúp tôi với dự án này không?",
    options: [
      { text: "Of course! I'd be happy to help.", textVi: "Tất nhiên! Tôi rất vui được giúp.", isCorrect: true },
      { text: "No, I'm busy", textVi: "Không, tôi bận", isCorrect: false },
      { text: "That's not my job", textVi: "Đó không phải công việc của tôi", isCorrect: false },
      { text: "Ask someone else", textVi: "Hỏi người khác", isCorrect: false }
    ],
    level: "communication",
    category: "workplace",
    explanation: "Khi được yêu cầu giúp đỡ, bạn trả lời tích cực."
  },

  // Câu 7: Xã hội
  {
    question: "Are you coming to the party tonight?",
    questionVi: "Bạn có đến bữa tiệc tối nay không?",
    options: [
      { text: "Yes, I'll be there. What time should I come?", textVi: "Có, tôi sẽ có mặt. Tôi nên đến lúc mấy giờ?", isCorrect: true },
      { text: "I don't know", textVi: "Tôi không biết", isCorrect: false },
      { text: "I'm not interested", textVi: "Tôi không quan tâm", isCorrect: false },
      { text: "Leave me alone", textVi: "Để tôi yên", isCorrect: false }
    ],
    level: "communication",
    category: "social",
    explanation: "Khi được mời đến bữa tiệc, bạn trả lời và hỏi thêm chi tiết."
  },

  // Câu 8: Điện thoại
  {
    question: "I'll call you later. Goodbye!",
    questionVi: "Tôi sẽ gọi bạn sau. Tạm biệt!",
    options: [
      { text: "Okay, talk to you soon. Bye!", textVi: "Được, nói chuyện với bạn sớm. Tạm biệt!", isCorrect: true },
      { text: "Don't call me", textVi: "Đừng gọi tôi", isCorrect: false },
      { text: "I'm busy", textVi: "Tôi bận", isCorrect: false },
      { text: "Who are you?", textVi: "Bạn là ai?", isCorrect: false }
    ],
    level: "communication",
    category: "phone",
    explanation: "Khi kết thúc cuộc gọi, bạn nói tạm biệt một cách lịch sự."
  },

  // Câu 9: Hàng ngày
  {
    question: "Thank you so much for your help!",
    questionVi: "Cảm ơn bạn rất nhiều vì sự giúp đỡ!",
    options: [
      { text: "You're welcome! Happy to help.", textVi: "Không có gì! Vui được giúp.", isCorrect: true },
      { text: "Don't thank me", textVi: "Đừng cảm ơn tôi", isCorrect: false },
      { text: "I don't care", textVi: "Tôi không quan tâm", isCorrect: false },
      { text: "Go away", textVi: "Đi xa", isCorrect: false }
    ],
    level: "communication",
    category: "daily",
    explanation: "Khi được cảm ơn, bạn trả lời một cách tử tế."
  },

  // Câu 10: Nơi làm việc
  {
    question: "The deadline is next Friday.",
    questionVi: "Hạn chót là thứ Sáu tuần tới.",
    options: [
      { text: "Understood. I'll have it done by then.", textVi: "Hiểu rồi. Tôi sẽ hoàn thành trước đó.", isCorrect: true },
      { text: "That's too soon", textVi: "Quá sớm", isCorrect: false },
      { text: "I don't care", textVi: "Tôi không quan tâm", isCorrect: false },
      { text: "I can't do it", textVi: "Tôi không thể làm", isCorrect: false }
    ],
    level: "communication",
    category: "workplace",
    explanation: "Khi được thông báo hạn chót, bạn xác nhận sẽ hoàn thành."
  },

  // ===== CHUYÊN NGÀNH - CÔNG NGHỆ THÔNG TIN (SPECIALIZED - IT) =====

  // Câu 1: Phần mềm
  {
    question: "What is a set of instructions that tells a computer what to do?",
    questionVi: "Tập hợp các hướng dẫn cho máy tính biết phải làm gì được gọi là gì?",
    options: [
      { text: "Software", textVi: "Phần mềm", isCorrect: true },
      { text: "Hardware", textVi: "Phần cứng", isCorrect: false },
      { text: "Network", textVi: "Mạng", isCorrect: false },
      { text: "Database", textVi: "Cơ sở dữ liệu", isCorrect: false }
    ],
    level: "specialized",
    category: "it-software",
    explanation: "Phần mềm (software) là tập hợp các hướng dẫn cho máy tính."
  },

  // Câu 2: Phần cứng
  {
    question: "Which component processes all the data in a computer?",
    questionVi: "Thành phần nào xử lý tất cả dữ liệu trong máy tính?",
    options: [
      { text: "Processor", textVi: "Bộ xử lý", isCorrect: true },
      { text: "Memory", textVi: "Bộ nhớ", isCorrect: false },
      { text: "Storage", textVi: "Lưu trữ", isCorrect: false },
      { text: "Monitor", textVi: "Màn hình", isCorrect: false }
    ],
    level: "specialized",
    category: "it-hardware",
    explanation: "Bộ xử lý (processor) xử lý tất cả dữ liệu trong máy tính."
  },

  // Câu 3: Mạng
  {
    question: "What is a unique identifier for a device on a network?",
    questionVi: "Định danh duy nhất cho một thiết bị trên mạng được gọi là gì?",
    options: [
      { text: "IP Address", textVi: "Địa chỉ IP", isCorrect: true },
      { text: "Router", textVi: "Bộ định tuyến", isCorrect: false },
      { text: "WiFi", textVi: "WiFi", isCorrect: false },
      { text: "Protocol", textVi: "Giao thức", isCorrect: false }
    ],
    level: "specialized",
    category: "it-network",
    explanation: "Địa chỉ IP (IP Address) là định danh duy nhất cho một thiết bị trên mạng."
  },

  // Câu 4: Bảo mật
  {
    question: "What protects your data from being read by unauthorized people?",
    questionVi: "Cái gì bảo vệ dữ liệu của bạn khỏi bị đọc bởi những người không được phép?",
    options: [
      { text: "Encryption", textVi: "Mã hóa", isCorrect: true },
      { text: "Firewall", textVi: "Tường lửa", isCorrect: false },
      { text: "Password", textVi: "Mật khẩu", isCorrect: false },
      { text: "Backup", textVi: "Sao lưu", isCorrect: false }
    ],
    level: "specialized",
    category: "it-security",
    explanation: "Mã hóa (encryption) bảo vệ dữ liệu khỏi bị đọc bởi những người không được phép."
  },

  // Câu 5: Phần mềm
  {
    question: "What is a framework used for building web applications?",
    questionVi: "Khung công tác được sử dụng để xây dựng ứng dụng web là gì?",
    options: [
      { text: "React", textVi: "React", isCorrect: true },
      { text: "Processor", textVi: "Bộ xử lý", isCorrect: false },
      { text: "Router", textVi: "Bộ định tuyến", isCorrect: false },
      { text: "Monitor", textVi: "Màn hình", isCorrect: false }
    ],
    level: "specialized",
    category: "it-software",
    explanation: "React là một khung công tác phổ biến để xây dựng ứng dụng web."
  },

  // Câu 6: Phần cứng
  {
    question: "What is used to store data permanently in a computer?",
    questionVi: "Cái gì được sử dụng để lưu trữ dữ liệu vĩnh viễn trong máy tính?",
    options: [
      { text: "Storage", textVi: "Lưu trữ", isCorrect: true },
      { text: "Memory", textVi: "Bộ nhớ", isCorrect: false },
      { text: "Processor", textVi: "Bộ xử lý", isCorrect: false },
      { text: "Keyboard", textVi: "Bàn phím", isCorrect: false }
    ],
    level: "specialized",
    category: "it-hardware",
    explanation: "Lưu trữ (storage) được sử dụng để lưu trữ dữ liệu vĩnh viễn."
  },

  // Câu 7: Mạng
  {
    question: "What is a device that connects multiple networks together?",
    questionVi: "Thiết bị kết nối nhiều mạng lại với nhau được gọi là gì?",
    options: [
      { text: "Router", textVi: "Bộ định tuyến", isCorrect: true },
      { text: "Monitor", textVi: "Màn hình", isCorrect: false },
      { text: "Keyboard", textVi: "Bàn phím", isCorrect: false },
      { text: "Mouse", textVi: "Chuột", isCorrect: false }
    ],
    level: "specialized",
    category: "it-network",
    explanation: "Bộ định tuyến (router) kết nối nhiều mạng lại với nhau."
  },

  // Câu 8: Bảo mật
  {
    question: "What is a strong combination of characters used to protect an account?",
    questionVi: "Sự kết hợp mạnh mẽ của các ký tự được sử dụng để bảo vệ tài khoản được gọi là gì?",
    options: [
      { text: "Password", textVi: "Mật khẩu", isCorrect: true },
      { text: "Username", textVi: "Tên người dùng", isCorrect: false },
      { text: "Email", textVi: "Email", isCorrect: false },
      { text: "Token", textVi: "Token", isCorrect: false }
    ],
    level: "specialized",
    category: "it-security",
    explanation: "Mật khẩu (password) là sự kết hợp mạnh mẽ của các ký tự để bảo vệ tài khoản."
  },

  // Câu 9: Phần mềm
  {
    question: "What is the process of finding and fixing errors in code?",
    questionVi: "Quá trình tìm kiếm và sửa lỗi trong mã được gọi là gì?",
    options: [
      { text: "Debugging", textVi: "Gỡ lỗi", isCorrect: true },
      { text: "Testing", textVi: "Kiểm thử", isCorrect: false },
      { text: "Deployment", textVi: "Triển khai", isCorrect: false },
      { text: "Programming", textVi: "Lập trình", isCorrect: false }
    ],
    level: "specialized",
    category: "it-software",
    explanation: "Gỡ lỗi (debugging) là quá trình tìm kiếm và sửa lỗi trong mã."
  },

  // Câu 10: Bảo mật
  {
    question: "What is a system that blocks unauthorized access to a network?",
    questionVi: "Hệ thống chặn truy cập trái phép vào mạng được gọi là gì?",
    options: [
      { text: "Firewall", textVi: "Tường lửa", isCorrect: true },
      { text: "Router", textVi: "Bộ định tuyến", isCorrect: false },
      { text: "Encryption", textVi: "Mã hóa", isCorrect: false },
      { text: "Backup", textVi: "Sao lưu", isCorrect: false }
    ],
    level: "specialized",
    category: "it-security",
    explanation: "Tường lửa (firewall) là hệ thống chặn truy cập trái phép vào mạng."
  },

  // ===== CHUYÊN NGÀNH - KINH TẾ (SPECIALIZED - ECONOMICS) =====

  // Câu 1: Kinh tế vĩ mô
  {
    question: "What does GDP stand for?",
    questionVi: "GDP là viết tắt của cái gì?",
    options: [
      { text: "Gross Domestic Product", textVi: "Tổng sản phẩm quốc nội", isCorrect: true },
      { text: "Gross Domestic Price", textVi: "Giá quốc nội tổng", isCorrect: false },
      { text: "General Development Plan", textVi: "Kế hoạch phát triển chung", isCorrect: false },
      { text: "Global Distribution Program", textVi: "Chương trình phân phối toàn cầu", isCorrect: false }
    ],
    level: "specialized",
    category: "econ-macro",
    explanation: "GDP là viết tắt của Gross Domestic Product (Tổng sản phẩm quốc nội)."
  },

  // Câu 2: Kinh tế vi mô
  {
    question: "What economic principle states that price is determined by supply and demand?",
    questionVi: "Nguyên lý kinh tế nào nói rằng giá được xác định bởi cung và cầu?",
    options: [
      { text: "Law of Supply and Demand", textVi: "Luật cung và cầu", isCorrect: true },
      { text: "Law of Diminishing Returns", textVi: "Luật lợi suất giảm dần", isCorrect: false },
      { text: "Law of Comparative Advantage", textVi: "Luật lợi thế so sánh", isCorrect: false },
      { text: "Law of Marginal Utility", textVi: "Luật lợi ích biên tế", isCorrect: false }
    ],
    level: "specialized",
    category: "econ-micro",
    explanation: "Luật cung và cầu (Law of Supply and Demand) xác định giá cả."
  },

  // Câu 3: Thương mại
  {
    question: "What is a tax on imported goods called?",
    questionVi: "Thuế trên hàng nhập khẩu được gọi là gì?",
    options: [
      { text: "Tariff", textVi: "Thuế quan", isCorrect: true },
      { text: "Quota", textVi: "Hạn ngạch", isCorrect: false },
      { text: "Subsidy", textVi: "Trợ cấp", isCorrect: false },
      { text: "Embargo", textVi: "Lệnh cấm vận", isCorrect: false }
    ],
    level: "specialized",
    category: "econ-trade",
    explanation: "Thuế quan (tariff) là thuế trên hàng nhập khẩu."
  },

  // Câu 4: Tài chính
  {
    question: "What is a share of ownership in a company called?",
    questionVi: "Một phần sở hữu trong công ty được gọi là gì?",
    options: [
      { text: "Stock", textVi: "Cổ phiếu", isCorrect: true },
      { text: "Bond", textVi: "Trái phiếu", isCorrect: false },
      { text: "Dividend", textVi: "Cổ tức", isCorrect: false },
      { text: "Asset", textVi: "Tài sản", isCorrect: false }
    ],
    level: "specialized",
    category: "econ-finance",
    explanation: "Cổ phiếu (stock) là một phần sở hữu trong công ty."
  },

  // Câu 5: Kinh tế vĩ mô
  {
    question: "What is a sustained increase in the general price level of goods and services?",
    questionVi: "Sự tăng lên bền vững của mức giá chung của hàng hóa và dịch vụ được gọi là gì?",
    options: [
      { text: "Inflation", textVi: "Lạm phát", isCorrect: true },
      { text: "Deflation", textVi: "Giảm phát", isCorrect: false },
      { text: "Recession", textVi: "Suy thoái", isCorrect: false },
      { text: "Stagnation", textVi: "Trì trệ", isCorrect: false }
    ],
    level: "specialized",
    category: "econ-macro",
    explanation: "Lạm phát (inflation) là sự tăng lên bền vững của mức giá chung."
  },

  // Câu 6: Kinh tế vi mô
  {
    question: "What is a market structure with only one seller?",
    questionVi: "Cấu trúc thị trường chỉ có một người bán được gọi là gì?",
    options: [
      { text: "Monopoly", textVi: "Độc quyền", isCorrect: true },
      { text: "Oligopoly", textVi: "Cộng đồng độc quyền", isCorrect: false },
      { text: "Perfect Competition", textVi: "Cạnh tranh hoàn hảo", isCorrect: false },
      { text: "Monopsony", textVi: "Độc quyền mua", isCorrect: false }
    ],
    level: "specialized",
    category: "econ-micro",
    explanation: "Độc quyền (monopoly) là cấu trúc thị trường chỉ có một người bán."
  },

  // Câu 7: Thương mại
  {
    question: "What is the difference between the value of exports and imports?",
    questionVi: "Sự khác biệt giữa giá trị xuất khẩu và nhập khẩu được gọi là gì?",
    options: [
      { text: "Balance of Trade", textVi: "Cân đối thương mại", isCorrect: true },
      { text: "Trade Deficit", textVi: "Thâm hụt thương mại", isCorrect: false },
      { text: "Trade Surplus", textVi: "Thặng dư thương mại", isCorrect: false },
      { text: "Trade Agreement", textVi: "Hiệp định thương mại", isCorrect: false }
    ],
    level: "specialized",
    category: "econ-trade",
    explanation: "Cân đối thương mại (balance of trade) là sự khác biệt giữa xuất khẩu và nhập khẩu."
  },

  // Câu 8: Tài chính
  {
    question: "What is a debt instrument that pays fixed interest?",
    questionVi: "Công cụ nợ trả lãi cố định được gọi là gì?",
    options: [
      { text: "Bond", textVi: "Trái phiếu", isCorrect: true },
      { text: "Stock", textVi: "Cổ phiếu", isCorrect: false },
      { text: "Derivative", textVi: "Công cụ phái sinh", isCorrect: false },
      { text: "Option", textVi: "Quyền chọn", isCorrect: false }
    ],
    level: "specialized",
    category: "econ-finance",
    explanation: "Trái phiếu (bond) là công cụ nợ trả lãi cố định."
  },

  // Câu 9: Kinh tế vĩ mô
  {
    question: "What is the rate at which the central bank lends money to commercial banks?",
    questionVi: "Lãi suất mà ngân hàng trung ương cho vay cho các ngân hàng thương mại được gọi là gì?",
    options: [
      { text: "Discount Rate", textVi: "Lãi suất chiết khấu", isCorrect: true },
      { text: "Prime Rate", textVi: "Lãi suất chính", isCorrect: false },
      { text: "Mortgage Rate", textVi: "Lãi suất thế chấp", isCorrect: false },
      { text: "Savings Rate", textVi: "Lãi suất tiết kiệm", isCorrect: false }
    ],
    level: "specialized",
    category: "econ-macro",
    explanation: "Lãi suất chiết khấu (discount rate) là lãi suất ngân hàng trung ương cho vay."
  },

  // Câu 10: Tài chính
  {
    question: "What is the practice of spreading investments across different assets?",
    questionVi: "Thực hành phân tán đầu tư trên các tài sản khác nhau được gọi là gì?",
    options: [
      { text: "Diversification", textVi: "Đa dạng hóa", isCorrect: true },
      { text: "Hedging", textVi: "Phòng hộ", isCorrect: false },
      { text: "Arbitrage", textVi: "Chênh lệch giá", isCorrect: false },
      { text: "Speculation", textVi: "Đầu cơ", isCorrect: false }
    ],
    level: "specialized",
    category: "econ-finance",
    explanation: "Đa dạng hóa (diversification) là phân tán đầu tư trên các tài sản khác nhau."
  },

  // ===== CHUYÊN NGÀNH - Y TẾ (SPECIALIZED - MEDICAL) =====

  // Câu 1: Giải phẫu
  {
    question: "What is the study of body structure called?",
    questionVi: "Nghiên cứu cấu trúc cơ thể được gọi là gì?",
    options: [
      { text: "Anatomy", textVi: "Giải phẫu học", isCorrect: true },
      { text: "Physiology", textVi: "Sinh lý học", isCorrect: false },
      { text: "Pathology", textVi: "Bệnh lý học", isCorrect: false },
      { text: "Pharmacology", textVi: "Dược lý học", isCorrect: false }
    ],
    level: "specialized",
    category: "med-anatomy",
    explanation: "Giải phẫu học (anatomy) là nghiên cứu cấu trúc cơ thể."
  },

  // Câu 2: Dược học
  {
    question: "What is a prescribed medicine called?",
    questionVi: "Thuốc được kê đơn được gọi là gì?",
    options: [
      { text: "Medication", textVi: "Thuốc", isCorrect: true },
      { text: "Supplement", textVi: "Thực phẩm bổ sung", isCorrect: false },
      { text: "Vitamin", textVi: "Vitamin", isCorrect: false },
      { text: "Mineral", textVi: "Khoáng chất", isCorrect: false }
    ],
    level: "specialized",
    category: "med-pharma",
    explanation: "Thuốc (medication) là thuốc được kê đơn."
  },

  // Câu 3: Phẫu thuật
  {
    question: "What is a medical procedure to remove or repair body parts?",
    questionVi: "Thủ tục y tế để loại bỏ hoặc sửa chữa các bộ phận cơ thể được gọi là gì?",
    options: [
      { text: "Surgery", textVi: "Phẫu thuật", isCorrect: true },
      { text: "Therapy", textVi: "Liệu pháp", isCorrect: false },
      { text: "Diagnosis", textVi: "Chẩn đoán", isCorrect: false },
      { text: "Treatment", textVi: "Điều trị", isCorrect: false }
    ],
    level: "specialized",
    category: "med-surgery",
    explanation: "Phẫu thuật (surgery) là thủ tục y tế để loại bỏ hoặc sửa chữa các bộ phận cơ thể."
  },

  // Câu 4: Điều dưỡng
  {
    question: "What is the role of a nurse?",
    questionVi: "Vai trò của y tá là gì?",
    options: [
      { text: "To care for patients", textVi: "Chăm sóc bệnh nhân", isCorrect: true },
      { text: "To perform surgery", textVi: "Thực hiện phẫu thuật", isCorrect: false },
      { text: "To prescribe medicine", textVi: "Kê đơn thuốc", isCorrect: false },
      { text: "To diagnose diseases", textVi: "Chẩn đoán bệnh", isCorrect: false }
    ],
    level: "specialized",
    category: "med-nursing",
    explanation: "Vai trò của y tá là chăm sóc bệnh nhân."
  },

  // Câu 5: Giải phẫu
  {
    question: "What pumps blood throughout the body?",
    questionVi: "Cơ quan nào bơm máu khắp cơ thể?",
    options: [
      { text: "Heart", textVi: "Tim", isCorrect: true },
      { text: "Lung", textVi: "Phổi", isCorrect: false },
      { text: "Brain", textVi: "Não", isCorrect: false },
      { text: "Liver", textVi: "Gan", isCorrect: false }
    ],
    level: "specialized",
    category: "med-anatomy",
    explanation: "Tim (heart) bơm máu khắp cơ thể."
  },

  // Câu 6: Dược học
  {
    question: "What is used to prevent diseases?",
    questionVi: "Cái gì được sử dụng để ngăn ngừa bệnh tật?",
    options: [
      { text: "Vaccine", textVi: "Vắc xin", isCorrect: true },
      { text: "Antibiotic", textVi: "Kháng sinh", isCorrect: false },
      { text: "Painkiller", textVi: "Thuốc giảm đau", isCorrect: false },
      { text: "Antacid", textVi: "Thuốc trung hòa axit", isCorrect: false }
    ],
    level: "specialized",
    category: "med-pharma",
    explanation: "Vắc xin (vaccine) được sử dụng để ngăn ngừa bệnh tật."
  },

  // Câu 7: Phẫu thuật
  {
    question: "What is used to put patients to sleep during surgery?",
    questionVi: "Cái gì được sử dụng để làm cho bệnh nhân ngủ trong phẫu thuật?",
    options: [
      { text: "Anesthesia", textVi: "Gây mê", isCorrect: true },
      { text: "Sedative", textVi: "Thuốc an thần", isCorrect: false },
      { text: "Painkiller", textVi: "Thuốc giảm đau", isCorrect: false },
      { text: "Antibiotic", textVi: "Kháng sinh", isCorrect: false }
    ],
    level: "specialized",
    category: "med-surgery",
    explanation: "Gây mê (anesthesia) được sử dụng để làm cho bệnh nhân ngủ trong phẫu thuật."
  },

  // Câu 8: Điều dưỡng
  {
    question: "What vital sign measures how fast the heart beats?",
    questionVi: "Dấu hiệu sinh tồn nào đo tốc độ tim đập?",
    options: [
      { text: "Pulse", textVi: "Mạch", isCorrect: true },
      { text: "Temperature", textVi: "Nhiệt độ", isCorrect: false },
      { text: "Respiration", textVi: "Hô hấp", isCorrect: false },
      { text: "Blood Pressure", textVi: "Huyết áp", isCorrect: false }
    ],
    level: "specialized",
    category: "med-nursing",
    explanation: "Mạch (pulse) đo tốc độ tim đập."
  },

  // Câu 9: Giải phẫu
  {
    question: "What connects bones together?",
    questionVi: "Cái gì kết nối các xương lại với nhau?",
    options: [
      { text: "Ligament", textVi: "Dây chằng", isCorrect: true },
      { text: "Tendon", textVi: "Gân", isCorrect: false },
      { text: "Cartilage", textVi: "Sụn", isCorrect: false },
      { text: "Muscle", textVi: "Cơ bắp", isCorrect: false }
    ],
    level: "specialized",
    category: "med-anatomy",
    explanation: "Dây chằng (ligament) kết nối các xương lại với nhau."
  },

  // Câu 10: Dược học
  {
    question: "What is an unwanted effect of a medicine?",
    questionVi: "Tác dụng không mong muốn của thuốc được gọi là gì?",
    options: [
      { text: "Side Effect", textVi: "Tác dụng phụ", isCorrect: true },
      { text: "Benefit", textVi: "Lợi ích", isCorrect: false },
      { text: "Reaction", textVi: "Phản ứng", isCorrect: false },
      { text: "Interaction", textVi: "Tương tác", isCorrect: false }
    ],
    level: "specialized",
    category: "med-pharma",
    explanation: "Tác dụng phụ (side effect) là tác dụng không mong muốn của thuốc."
  },

  // ===== CHUYÊN NGÀNH - GIÁO DỤC (SPECIALIZED - EDUCATION) =====

  // Câu 1: Sư phạm
  {
    question: "What is the art and science of teaching?",
    questionVi: "Nghệ thuật và khoa học giảng dạy được gọi là gì?",
    options: [
      { text: "Pedagogy", textVi: "Sư phạm", isCorrect: true },
      { text: "Psychology", textVi: "Tâm lý học", isCorrect: false },
      { text: "Sociology", textVi: "Xã hội học", isCorrect: false },
      { text: "Anthropology", textVi: "Nhân chủng học", isCorrect: false }
    ],
    level: "specialized",
    category: "edu-pedagogy",
    explanation: "Sư phạm (pedagogy) là nghệ thuật và khoa học giảng dạy."
  },

  // Câu 2: Tâm lý học
  {
    question: "What is the study of human behavior and mind?",
    questionVi: "Nghiên cứu hành vi và tâm trí con người được gọi là gì?",
    options: [
      { text: "Psychology", textVi: "Tâm lý học", isCorrect: true },
      { text: "Psychiatry", textVi: "Tâm thần học", isCorrect: false },
      { text: "Neurology", textVi: "Thần kinh học", isCorrect: false },
      { text: "Sociology", textVi: "Xã hội học", isCorrect: false }
    ],
    level: "specialized",
    category: "edu-psychology",
    explanation: "Tâm lý học (psychology) là nghiên cứu hành vi và tâm trí con người."
  },

  // Câu 3: Sư phạm
  {
    question: "What is a plan of subjects to be taught?",
    questionVi: "Kế hoạch các môn học được dạy được gọi là gì?",
    options: [
      { text: "Curriculum", textVi: "Chương trình học", isCorrect: true },
      { text: "Syllabus", textVi: "Đề cương", isCorrect: false },
      { text: "Schedule", textVi: "Lịch trình", isCorrect: false },
      { text: "Timetable", textVi: "Thời khóa biểu", isCorrect: false }
    ],
    level: "specialized",
    category: "edu-pedagogy",
    explanation: "Chương trình học (curriculum) là kế hoạch các môn học được dạy."
  },

  // Câu 4: Tâm lý học
  {
    question: "What drives people to take action?",
    questionVi: "Cái gì thúc đẩy mọi người hành động?",
    options: [
      { text: "Motivation", textVi: "Động lực", isCorrect: true },
      { text: "Emotion", textVi: "Cảm xúc", isCorrect: false },
      { text: "Perception", textVi: "Nhận thức", isCorrect: false },
      { text: "Cognition", textVi: "Nhận thức", isCorrect: false }
    ],
    level: "specialized",
    category: "edu-psychology",
    explanation: "Động lực (motivation) thúc đẩy mọi người hành động."
  },

  // Câu 5: Sư phạm
  {
    question: "What is a formal presentation of information?",
    questionVi: "Trình bày chính thức thông tin được gọi là gì?",
    options: [
      { text: "Lecture", textVi: "Bài giảng", isCorrect: true },
      { text: "Discussion", textVi: "Thảo luận", isCorrect: false },
      { text: "Seminar", textVi: "Hội thảo", isCorrect: false },
      { text: "Workshop", textVi: "Hội thảo thực hành", isCorrect: false }
    ],
    level: "specialized",
    category: "edu-pedagogy",
    explanation: "Bài giảng (lecture) là trình bày chính thức thông tin."
  },

  // Câu 6: Tâm lý học
  {
    question: "What is the ability to retain information?",
    questionVi: "Khả năng giữ lại thông tin được gọi là gì?",
    options: [
      { text: "Memory", textVi: "Trí nhớ", isCorrect: true },
      { text: "Attention", textVi: "Chú ý", isCorrect: false },
      { text: "Perception", textVi: "Nhận thức", isCorrect: false },
      { text: "Cognition", textVi: "Nhận thức", isCorrect: false }
    ],
    level: "specialized",
    category: "edu-psychology",
    explanation: "Trí nhớ (memory) là khả năng giữ lại thông tin."
  },

  // Câu 7: Sư phạm
  {
    question: "What is a task given to students to complete?",
    questionVi: "Nhiệm vụ được giao cho học sinh để hoàn thành được gọi là gì?",
    options: [
      { text: "Assignment", textVi: "Bài tập", isCorrect: true },
      { text: "Exam", textVi: "Kỳ thi", isCorrect: false },
      { text: "Quiz", textVi: "Bài kiểm tra", isCorrect: false },
      { text: "Test", textVi: "Bài kiểm tra", isCorrect: false }
    ],
    level: "specialized",
    category: "edu-pedagogy",
    explanation: "Bài tập (assignment) là nhiệm vụ được giao cho học sinh để hoàn thành."
  },

  // Câu 8: Tâm lý học
  {
    question: "What is the process of growth and change?",
    questionVi: "Quá trình phát triển và thay đổi được gọi là gì?",
    options: [
      { text: "Development", textVi: "Phát triển", isCorrect: true },
      { text: "Evolution", textVi: "Tiến hóa", isCorrect: false },
      { text: "Progress", textVi: "Tiến bộ", isCorrect: false },
      { text: "Growth", textVi: "Tăng trưởng", isCorrect: false }
    ],
    level: "specialized",
    category: "edu-psychology",
    explanation: "Phát triển (development) là quá trình phát triển và thay đổi."
  },

  // Câu 9: Sư phạm
  {
    question: "What is a book used for teaching?",
    questionVi: "Sách được sử dụng để giảng dạy được gọi là gì?",
    options: [
      { text: "Textbook", textVi: "Sách giáo khoa", isCorrect: true },
      { text: "Novel", textVi: "Tiểu thuyết", isCorrect: false },
      { text: "Reference", textVi: "Tài liệu tham khảo", isCorrect: false },
      { text: "Magazine", textVi: "Tạp chí", isCorrect: false }
    ],
    level: "specialized",
    category: "edu-pedagogy",
    explanation: "Sách giáo khoa (textbook) là sách được sử dụng để giảng dạy."
  },

  // Câu 10: Tâm lý học
  {
    question: "What is the ability to focus on something?",
    questionVi: "Khả năng tập trung vào cái gì đó được gọi là gì?",
    options: [
      { text: "Attention", textVi: "Chú ý", isCorrect: true },
      { text: "Concentration", textVi: "Tập trung", isCorrect: false },
      { text: "Focus", textVi: "Tập trung", isCorrect: false },
      { text: "Awareness", textVi: "Nhận thức", isCorrect: false }
    ],
    level: "specialized",
    category: "edu-psychology",
    explanation: "Chú ý (attention) là khả năng tập trung vào cái gì đó."
  },

  // ===== CHUYÊN NGÀNH - KỸ THUẬT (SPECIALIZED - ENGINEERING) =====

  // Câu 1: Xây dựng
  {
    question: "What is the process of building structures?",
    questionVi: "Quá trình xây dựng các cấu trúc được gọi là gì?",
    options: [
      { text: "Construction", textVi: "Xây dựng", isCorrect: true },
      { text: "Design", textVi: "Thiết kế", isCorrect: false },
      { text: "Planning", textVi: "Lập kế hoạch", isCorrect: false },
      { text: "Engineering", textVi: "Kỹ thuật", isCorrect: false }
    ],
    level: "specialized",
    category: "eng-civil",
    explanation: "Xây dựng (construction) là quá trình xây dựng các cấu trúc."
  },

  // Câu 2: Cơ khí
  {
    question: "What converts fuel into motion?",
    questionVi: "Cái gì chuyển đổi nhiên liệu thành chuyển động?",
    options: [
      { text: "Engine", textVi: "Động cơ", isCorrect: true },
      { text: "Motor", textVi: "Động cơ điện", isCorrect: false },
      { text: "Turbine", textVi: "Tuabin", isCorrect: false },
      { text: "Pump", textVi: "Bơm", isCorrect: false }
    ],
    level: "specialized",
    category: "eng-mechanical",
    explanation: "Động cơ (engine) chuyển đổi nhiên liệu thành chuyển động."
  },

  // Câu 3: Điện
  {
    question: "What is the flow of electric charge?",
    questionVi: "Dòng chảy của điện tích được gọi là gì?",
    options: [
      { text: "Current", textVi: "Dòng điện", isCorrect: true },
      { text: "Voltage", textVi: "Điện áp", isCorrect: false },
      { text: "Resistance", textVi: "Điện trở", isCorrect: false },
      { text: "Power", textVi: "Công suất", isCorrect: false }
    ],
    level: "specialized",
    category: "eng-electrical",
    explanation: "Dòng điện (current) là dòng chảy của điện tích."
  },

  // Câu 4: Xây dựng
  {
    question: "What is a detailed drawing of a building?",
    questionVi: "Bản vẽ chi tiết của một tòa nhà được gọi là gì?",
    options: [
      { text: "Blueprint", textVi: "Bản vẽ", isCorrect: true },
      { text: "Sketch", textVi: "Phác thảo", isCorrect: false },
      { text: "Plan", textVi: "Kế hoạch", isCorrect: false },
      { text: "Design", textVi: "Thiết kế", isCorrect: false }
    ],
    level: "specialized",
    category: "eng-civil",
    explanation: "Bản vẽ (blueprint) là bản vẽ chi tiết của một tòa nhà."
  },

  // Câu 5: Cơ khí
  {
    question: "What reduces friction between moving parts?",
    questionVi: "Cái gì giảm ma sát giữa các bộ phận chuyển động?",
    options: [
      { text: "Lubrication", textVi: "Bôi trơn", isCorrect: true },
      { text: "Cooling", textVi: "Làm mát", isCorrect: false },
      { text: "Heating", textVi: "Làm nóng", isCorrect: false },
      { text: "Pressure", textVi: "Áp suất", isCorrect: false }
    ],
    level: "specialized",
    category: "eng-mechanical",
    explanation: "Bôi trơn (lubrication) giảm ma sát giữa các bộ phận chuyển động."
  },

  // Câu 6: Điện
  {
    question: "What is the potential difference in an electrical circuit?",
    questionVi: "Sự khác biệt tiềm năng trong mạch điện được gọi là gì?",
    options: [
      { text: "Voltage", textVi: "Điện áp", isCorrect: true },
      { text: "Current", textVi: "Dòng điện", isCorrect: false },
      { text: "Resistance", textVi: "Điện trở", isCorrect: false },
      { text: "Power", textVi: "Công suất", isCorrect: false }
    ],
    level: "specialized",
    category: "eng-electrical",
    explanation: "Điện áp (voltage) là sự khác biệt tiềm năng trong mạch điện."
  },

  // Câu 7: Xây dựng
  {
    question: "What is a strong building material?",
    questionVi: "Vật liệu xây dựng mạnh được gọi là gì?",
    options: [
      { text: "Concrete", textVi: "Bê tông", isCorrect: true },
      { text: "Wood", textVi: "Gỗ", isCorrect: false },
      { text: "Plastic", textVi: "Nhựa", isCorrect: false },
      { text: "Glass", textVi: "Kính", isCorrect: false }
    ],
    level: "specialized",
    category: "eng-civil",
    explanation: "Bê tông (concrete) là vật liệu xây dựng mạnh."
  },

  // Câu 8: Cơ khí
  {
    question: "What converts electricity into motion?",
    questionVi: "Cái gì chuyển đổi điện thành chuyển động?",
    options: [
      { text: "Motor", textVi: "Động cơ điện", isCorrect: true },
      { text: "Generator", textVi: "Máy phát điện", isCorrect: false },
      { text: "Transformer", textVi: "Máy biến áp", isCorrect: false },
      { text: "Turbine", textVi: "Tuabin", isCorrect: false }
    ],
    level: "specialized",
    category: "eng-mechanical",
    explanation: "Động cơ điện (motor) chuyển đổi điện thành chuyển động."
  },

  // Câu 9: Điện
  {
    question: "What opposes the flow of electric current?",
    questionVi: "Cái gì chống lại dòng chảy của dòng điện?",
    options: [
      { text: "Resistance", textVi: "Điện trở", isCorrect: true },
      { text: "Capacitance", textVi: "Điện dung", isCorrect: false },
      { text: "Inductance", textVi: "Độ tự cảm", isCorrect: false },
      { text: "Impedance", textVi: "Trở kháng", isCorrect: false }
    ],
    level: "specialized",
    category: "eng-electrical",
    explanation: "Điện trở (resistance) chống lại dòng chảy của dòng điện."
  },

  // Câu 10: Xây dựng
  {
    question: "What connects two pieces of land across water?",
    questionVi: "Cái gì kết nối hai mảnh đất qua nước?",
    options: [
      { text: "Bridge", textVi: "Cầu", isCorrect: true },
      { text: "Tunnel", textVi: "Đường hầm", isCorrect: false },
      { text: "Road", textVi: "Đường", isCorrect: false },
      { text: "Path", textVi: "Đường mòn", isCorrect: false }
    ],
    level: "specialized",
    category: "eng-civil",
    explanation: "Cầu (bridge) kết nối hai mảnh đất qua nước."
  }
];

async function seedQuizQuestions() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Xóa dữ liệu câu hỏi quiz cũ (tùy chọn)
    await QuizQuestion.deleteMany({});
    console.log('🗑️  Cleared old quiz questions');

    // Thêm câu hỏi quiz mới
    await QuizQuestion.insertMany(quizQuestionsData);
    console.log(`✅ Added ${quizQuestionsData.length} quiz questions successfully!`);

    console.log('\n📊 Summary:');
    console.log('🔵 Cấp độ Cơ bản (Basic): 20 câu');
    console.log('  - Màu sắc (Colors): 3 câu');
    console.log('  - Số đếm (Numbers): 3 câu');
    console.log('  - Gia đình (Family): 2 câu');
    console.log('  - Con vật (Animals): 3 câu');
    console.log('  - Thời gian (Time): 1 câu');
    console.log('  - Đồ vật (Objects): 1 câu');
    console.log('  - Thức ăn (Food): 1 câu');
    console.log('  - Cơ thể (Body): 1 câu');
    console.log('  - Thời tiết (Weather): 1 câu');
    console.log('  - Phương tiện (Transport): 1 câu');
    console.log('  - Địa điểm (Places): 1 câu');
    console.log('  - Cảm xúc (Emotions): 1 câu');
    console.log('  - Hoạt động (Activities): 1 câu');
    console.log('🟢 Cấp độ Trung cấp (Intermediate): 10 câu');
    console.log('  - Công việc (Jobs): 3 câu');
    console.log('  - Thời tiết (Weather): 2 câu');
    console.log('  - Thức ăn (Food): 2 câu');
    console.log('  - Du lịch (Travel): 3 câu');
    console.log('🟣 Cấp độ Nâng cao (Advanced): 10 câu');
    console.log('  - Kinh doanh (Business): 3 câu');
    console.log('  - Công nghệ (Technology): 2 câu');
    console.log('  - Khoa học (Science): 3 câu');
    console.log('  - Văn học (Literature): 2 câu');
    console.log('🟠 Cấp độ Giao tiếp (Communication): 10 câu');
    console.log('  - Hàng ngày (Daily): 3 câu');
    console.log('  - Nơi làm việc (Workplace): 3 câu');
    console.log('  - Xã hội (Social): 2 câu');
    console.log('  - Điện thoại (Phone): 2 câu');
    console.log('🔴 Cấp độ Chuyên ngành - Công nghệ thông tin (Specialized - IT): 10 câu');
    console.log('  - Phần mềm (Software): 3 câu');
    console.log('  - Phần cứng (Hardware): 2 câu');
    console.log('  - Mạng (Network): 2 câu');
    console.log('  - Bảo mật (Security): 3 câu');
    console.log('🟠 Cấp độ Chuyên ngành - Kinh tế (Specialized - Economics): 10 câu');
    console.log('  - Kinh tế vĩ mô (Macroeconomics): 3 câu');
    console.log('  - Kinh tế vi mô (Microeconomics): 2 câu');
    console.log('  - Thương mại (Trade): 2 câu');
    console.log('  - Tài chính (Finance): 3 câu');
    console.log('🔵 Cấp độ Chuyên ngành - Y tế (Specialized - Medical): 10 câu');
    console.log('  - Giải phẫu (Anatomy): 3 câu');
    console.log('  - Dược học (Pharmacy): 2 câu');
    console.log('  - Phẫu thuật (Surgery): 2 câu');
    console.log('  - Điều dưỡng (Nursing): 3 câu');
    console.log('🟣 Cấp độ Chuyên ngành - Giáo dục (Specialized - Education): 10 câu');
    console.log('  - Sư phạm (Pedagogy): 5 câu');
    console.log('  - Tâm lý học (Psychology): 5 câu');
    console.log('🟢 Cấp độ Chuyên ngành - Kỹ thuật (Specialized - Engineering): 10 câu');
    console.log('  - Xây dựng (Civil): 3 câu');
    console.log('  - Cơ khí (Mechanical): 3 câu');
    console.log('  - Điện (Electrical): 4 câu');
    console.log('Total: 100 quiz questions\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedQuizQuestions();