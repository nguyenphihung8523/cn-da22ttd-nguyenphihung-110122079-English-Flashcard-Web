const mongoose = require('mongoose');
const Flashcard = require('./models/Flashcard');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/english_flashcard_db';

const flashcardsData = [
  // Cơ bản - Màu sắc
  {
    word: 'Red',
    meaning: 'Màu đỏ',
    pronunciation: 'red',
    example: 'The apple is red.',
    exampleTranslation: 'Quả táo màu đỏ.',
    category: 'basic-colors',
    image: '🔴'
  },
  {
    word: 'Blue',
    meaning: 'Màu xanh dương',
    pronunciation: 'bluː',
    example: 'The sky is blue.',
    exampleTranslation: 'Bầu trời màu xanh dương.',
    category: 'basic-colors',
    image: '🔵'
  },
  {
    word: 'Green',
    meaning: 'Màu xanh lá',
    pronunciation: 'griːn',
    example: 'The grass is green.',
    exampleTranslation: 'Cỏ màu xanh lá.',
    category: 'basic-colors',
    image: '🟢'
  },
  {
    word: 'Yellow',
    meaning: 'Màu vàng',
    pronunciation: 'ˈjeləʊ',
    example: 'The sun is yellow.',
    exampleTranslation: 'Mặt trời màu vàng.',
    category: 'basic-colors',
    image: '🟡'
  },
  {
    word: 'Orange',
    meaning: 'Màu cam',
    pronunciation: 'ˈɒrɪndʒ',
    example: 'The orange is orange.',
    exampleTranslation: 'Quả cam màu cam.',
    category: 'basic-colors',
    image: '🟠'
  },
  {
    word: 'Purple',
    meaning: 'Màu tím',
    pronunciation: 'ˈpɜːpl',
    example: 'The flower is purple.',
    exampleTranslation: 'Bông hoa màu tím.',
    category: 'basic-colors',
    image: '🟣'
  },
  {
    word: 'Pink',
    meaning: 'Màu hồng',
    pronunciation: 'pɪŋk',
    example: 'She likes pink dresses.',
    exampleTranslation: 'Cô ấy thích váy màu hồng.',
    category: 'basic-colors',
    image: '🌸'
  },
  {
    word: 'Black',
    meaning: 'Màu đen',
    pronunciation: 'blæk',
    example: 'The cat is black.',
    exampleTranslation: 'Con mèo màu đen.',
    category: 'basic-colors',
    image: '⚫'
  },
  {
    word: 'White',
    meaning: 'Màu trắng',
    pronunciation: 'waɪt',
    example: 'Snow is white.',
    exampleTranslation: 'Tuyết màu trắng.',
    category: 'basic-colors',
    image: '⚪'
  },
  {
    word: 'Gray',
    meaning: 'Màu xám',
    pronunciation: 'ɡreɪ',
    example: 'The clouds are gray.',
    exampleTranslation: 'Những đám mây màu xám.',
    category: 'basic-colors',
    image: '🩶'
  },
  {
    word: 'Brown',
    meaning: 'Màu nâu',
    pronunciation: 'braʊn',
    example: 'The bear is brown.',
    exampleTranslation: 'Con gấu màu nâu.',
    category: 'basic-colors',
    image: '🟤'
  },
  {
    word: 'Gold',
    meaning: 'Màu vàng kim',
    pronunciation: 'ɡəʊld',
    example: 'The ring is gold.',
    exampleTranslation: 'Chiếc nhẫn màu vàng kim.',
    category: 'basic-colors',
    image: '🥇'
  },
  {
    word: 'Silver',
    meaning: 'Màu bạc',
    pronunciation: 'ˈsɪlvə',
    example: 'The car is silver.',
    exampleTranslation: 'Chiếc xe màu bạc.',
    category: 'basic-colors',
    image: '🥈'
  },
  
  // Cơ bản - Số đếm
  {
    word: 'One',
    meaning: 'Số một',
    pronunciation: 'wʌn',
    example: 'I have one apple.',
    exampleTranslation: 'Tôi có một quả táo.',
    category: 'basic-numbers',
    image: '1️⃣'
  },
  {
    word: 'Two',
    meaning: 'Số hai',
    pronunciation: 'tuː',
    example: 'There are two cats.',
    exampleTranslation: 'Có hai con mèo.',
    category: 'basic-numbers',
    image: '2️⃣'
  },
  {
    word: 'Three',
    meaning: 'Số ba',
    pronunciation: 'θriː',
    example: 'I see three birds.',
    exampleTranslation: 'Tôi thấy ba con chim.',
    category: 'basic-numbers',
    image: '3️⃣'
  },
  {
    word: 'Four',
    meaning: 'Số bốn',
    pronunciation: 'fɔː',
    example: 'She has four books.',
    exampleTranslation: 'Cô ấy có bốn quyển sách.',
    category: 'basic-numbers',
    image: '4️⃣'
  },
  {
    word: 'Five',
    meaning: 'Số năm',
    pronunciation: 'faɪv',
    example: 'Give me five minutes.',
    exampleTranslation: 'Cho tôi năm phút.',
    category: 'basic-numbers',
    image: '5️⃣'
  },
  {
    word: 'Six',
    meaning: 'Số sáu',
    pronunciation: 'sɪks',
    example: 'The clock shows six.',
    exampleTranslation: 'Đồng hồ chỉ sáu giờ.',
    category: 'basic-numbers',
    image: '6️⃣'
  },
  {
    word: 'Seven',
    meaning: 'Số bảy',
    pronunciation: 'ˈsevn',
    example: 'There are seven days in a week.',
    exampleTranslation: 'Có bảy ngày trong một tuần.',
    category: 'basic-numbers',
    image: '7️⃣'
  },
  {
    word: 'Eight',
    meaning: 'Số tám',
    pronunciation: 'eɪt',
    example: 'I wake up at eight.',
    exampleTranslation: 'Tôi thức dậy lúc tám giờ.',
    category: 'basic-numbers',
    image: '8️⃣'
  },
  {
    word: 'Nine',
    meaning: 'Số chín',
    pronunciation: 'naɪn',
    example: 'The class starts at nine.',
    exampleTranslation: 'Lớp học bắt đầu lúc chín giờ.',
    category: 'basic-numbers',
    image: '9️⃣'
  },
  {
    word: 'Ten',
    meaning: 'Số mười',
    pronunciation: 'ten',
    example: 'I have ten fingers.',
    exampleTranslation: 'Tôi có mười ngón tay.',
    category: 'basic-numbers',
    image: '🔟'
  },

  // Cơ bản - Gia đình
  {
    word: 'Father',
    meaning: 'Bố, cha',
    pronunciation: 'ˈfɑːðə',
    example: 'My father is a teacher.',
    exampleTranslation: 'Bố tôi là một giáo viên.',
    category: 'basic-family',
    image: '👨'
  },
  {
    word: 'Mother',
    meaning: 'Mẹ',
    pronunciation: 'ˈmʌðə',
    example: 'My mother cooks well.',
    exampleTranslation: 'Mẹ tôi nấu ăn ngon.',
    category: 'basic-family',
    image: '👩'
  },
  {
    word: 'Brother',
    meaning: 'Anh/em trai',
    pronunciation: 'ˈbrʌðə',
    example: 'I have one brother.',
    exampleTranslation: 'Tôi có một người anh trai.',
    category: 'basic-family',
    image: '👦'
  },
  {
    word: 'Sister',
    meaning: 'Chị/em gái',
    pronunciation: 'ˈsɪstə',
    example: 'My sister is younger than me.',
    exampleTranslation: 'Em gái tôi nhỏ tuổi hơn tôi.',
    category: 'basic-family',
    image: '👧'
  },
  {
    word: 'Grandfather',
    meaning: 'Ông',
    pronunciation: 'ˈɡrænfɑːðə',
    example: 'My grandfather is very kind.',
    exampleTranslation: 'Ông tôi rất tốt bụng.',
    category: 'basic-family',
    image: '👴'
  },
  {
    word: 'Grandmother',
    meaning: 'Bà',
    pronunciation: 'ˈɡrænmʌðə',
    example: 'Grandmother tells great stories.',
    exampleTranslation: 'Bà kể những câu chuyện hay.',
    category: 'basic-family',
    image: '👵'
  },
  {
    word: 'Son',
    meaning: 'Con trai',
    pronunciation: 'sʌn',
    example: 'He has two sons.',
    exampleTranslation: 'Ông ấy có hai con trai.',
    category: 'basic-family',
    image: '👶'
  },
  {
    word: 'Daughter',
    meaning: 'Con gái',
    pronunciation: 'ˈdɔːtə',
    example: 'She is my daughter.',
    exampleTranslation: 'Cô ấy là con gái tôi.',
    category: 'basic-family',
    image: '👧'
  },

  // Cơ bản - Con vật
  {
    word: 'Dog',
    meaning: 'Con chó',
    pronunciation: 'dɒɡ',
    example: 'The dog is barking.',
    exampleTranslation: 'Con chó đang sủa.',
    category: 'basic-animals',
    image: '🐕'
  },
  {
    word: 'Cat',
    meaning: 'Con mèo',
    pronunciation: 'kæt',
    example: 'The cat is sleeping.',
    exampleTranslation: 'Con mèo đang ngủ.',
    category: 'basic-animals',
    image: '🐈'
  },
  {
    word: 'Bird',
    meaning: 'Con chim',
    pronunciation: 'bɜːd',
    example: 'The bird is singing.',
    exampleTranslation: 'Con chim đang hót.',
    category: 'basic-animals',
    image: '🐦'
  },
  {
    word: 'Fish',
    meaning: 'Con cá',
    pronunciation: 'fɪʃ',
    example: 'Fish live in water.',
    exampleTranslation: 'Cá sống trong nước.',
    category: 'basic-animals',
    image: '🐟'
  },
  {
    word: 'Elephant',
    meaning: 'Con voi',
    pronunciation: 'ˈelɪfənt',
    example: 'The elephant is big.',
    exampleTranslation: 'Con voi to lớn.',
    category: 'basic-animals',
    image: '🐘'
  },
  {
    word: 'Lion',
    meaning: 'Con sư tử',
    pronunciation: 'ˈlaɪən',
    example: 'The lion is the king of animals.',
    exampleTranslation: 'Sư tử là vua của các loài động vật.',
    category: 'basic-animals',
    image: '🦁'
  },
  {
    word: 'Tiger',
    meaning: 'Con hổ',
    pronunciation: 'ˈtaɪɡə',
    example: 'Tigers are strong.',
    exampleTranslation: 'Hổ rất mạnh mẽ.',
    category: 'basic-animals',
    image: '🐯'
  },
  {
    word: 'Monkey',
    meaning: 'Con khỉ',
    pronunciation: 'ˈmʌŋki',
    example: 'Monkeys like bananas.',
    exampleTranslation: 'Khỉ thích ăn chuối.',
    category: 'basic-animals',
    image: '🐵'
  },
  {
    word: 'Rabbit',
    meaning: 'Con thỏ',
    pronunciation: 'ˈræbɪt',
    example: 'The rabbit is hopping.',
    exampleTranslation: 'Con thỏ đang nhảy lò cò.',
    category: 'basic-animals',
    image: '🐰'
  },
  {
    word: 'Bear',
    meaning: 'Con gấu',
    pronunciation: 'beə',
    example: 'Bears sleep in winter.',
    exampleTranslation: 'Gấu ngủ vào mùa đông.',
    category: 'basic-animals',
    image: '🐻'
  },

  // Trung cấp - Công việc
  {
    word: 'Doctor',
    meaning: 'Bác sĩ',
    pronunciation: 'ˈdɒktə',
    example: 'The doctor examines patients.',
    exampleTranslation: 'Bác sĩ khám bệnh cho bệnh nhân.',
    category: 'intermediate-jobs',
    image: '👨‍⚕️'
  },
  {
    word: 'Teacher',
    meaning: 'Giáo viên',
    pronunciation: 'ˈtiːtʃə',
    example: 'My teacher is very helpful.',
    exampleTranslation: 'Giáo viên của tôi rất nhiệt tình.',
    category: 'intermediate-jobs',
    image: '👨‍🏫'
  },
  {
    word: 'Engineer',
    meaning: 'Kỹ sư',
    pronunciation: 'ˌendʒɪˈnɪə',
    example: 'He works as an engineer.',
    exampleTranslation: 'Anh ấy làm việc như một kỹ sư.',
    category: 'intermediate-jobs',
    image: '👨‍💻'
  },
  {
    word: 'Nurse',
    meaning: 'Y tá',
    pronunciation: 'nɜːs',
    example: 'The nurse takes care of patients.',
    exampleTranslation: 'Y tá chăm sóc bệnh nhân.',
    category: 'intermediate-jobs',
    image: '👩‍⚕️'
  },
  {
    word: 'Police',
    meaning: 'Cảnh sát',
    pronunciation: 'pəˈliːs',
    example: 'The police officer helps people.',
    exampleTranslation: 'Cảnh sát giúp đỡ mọi người.',
    category: 'intermediate-jobs',
    image: '👮'
  },
  {
    word: 'Chef',
    meaning: 'Đầu bếp',
    pronunciation: 'ʃef',
    example: 'The chef cooks delicious food.',
    exampleTranslation: 'Đầu bếp nấu những món ăn ngon.',
    category: 'intermediate-jobs',
    image: '👨‍🍳'
  },
  {
    word: 'Pilot',
    meaning: 'Phi công',
    pronunciation: 'ˈpaɪlət',
    example: 'The pilot flies the airplane.',
    exampleTranslation: 'Phi công lái máy bay.',
    category: 'intermediate-jobs',
    image: '👨‍✈️'
  },
  {
    word: 'Lawyer',
    meaning: 'Luật sư',
    pronunciation: 'ˈlɔɪə',
    example: 'The lawyer defends his client.',
    exampleTranslation: 'Luật sư bào chữa cho thân chủ.',
    category: 'intermediate-jobs',
    image: '👨‍💼'
  },
  {
    word: 'Farmer',
    meaning: 'Nông dân',
    pronunciation: 'ˈfɑːmə',
    example: 'The farmer grows vegetables.',
    exampleTranslation: 'Nông dân trồng rau.',
    category: 'intermediate-jobs',
    image: '👨‍🌾'
  },
  {
    word: 'Artist',
    meaning: 'Nghệ sĩ',
    pronunciation: 'ˈɑːtɪst',
    example: 'The artist paints beautiful pictures.',
    exampleTranslation: 'Nghệ sĩ vẽ những bức tranh đẹp.',
    category: 'intermediate-jobs',
    image: '👨‍🎨'
  },

  // Trung cấp - Thời tiết
  {
    word: 'Sunny',
    meaning: 'Nắng',
    pronunciation: 'ˈsʌni',
    example: 'It is sunny today.',
    exampleTranslation: 'Hôm nay trời nắng.',
    category: 'intermediate-weather',
    image: '☀️'
  },
  {
    word: 'Rainy',
    meaning: 'Mưa',
    pronunciation: 'ˈreɪni',
    example: 'The weather is rainy.',
    exampleTranslation: 'Thời tiết đang mưa.',
    category: 'intermediate-weather',
    image: '🌧️'
  },
  {
    word: 'Cloudy',
    meaning: 'Nhiều mây',
    pronunciation: 'ˈklaʊdi',
    example: 'The sky is cloudy.',
    exampleTranslation: 'Bầu trời nhiều mây.',
    category: 'intermediate-weather',
    image: '☁️'
  },
  {
    word: 'Windy',
    meaning: 'Có gió',
    pronunciation: 'ˈwɪndi',
    example: 'It is very windy outside.',
    exampleTranslation: 'Bên ngoài rất có gió.',
    category: 'intermediate-weather',
    image: '💨'
  },
  {
    word: 'Snowy',
    meaning: 'Có tuyết',
    pronunciation: 'ˈsnəʊi',
    example: 'The mountain is snowy.',
    exampleTranslation: 'Núi có tuyết.',
    category: 'intermediate-weather',
    image: '❄️'
  },
  {
    word: 'Foggy',
    meaning: 'Có sương mù',
    pronunciation: 'ˈfɒɡi',
    example: 'The morning is foggy.',
    exampleTranslation: 'Buổi sáng có sương mù.',
    category: 'intermediate-weather',
    image: '🌫️'
  },
  {
    word: 'Storm',
    meaning: 'Bão',
    pronunciation: 'stɔːm',
    example: 'The storm is coming.',
    exampleTranslation: 'Cơn bão đang đến.',
    category: 'intermediate-weather',
    image: '⛈️'
  },
  {
    word: 'Thunder',
    meaning: 'Sấm sét',
    pronunciation: 'ˈθʌndə',
    example: 'I can hear thunder.',
    exampleTranslation: 'Tôi có thể nghe thấy tiếng sấm.',
    category: 'intermediate-weather',
    image: '⚡'
  },
  {
    word: 'Rainbow',
    meaning: 'Cầu vồng',
    pronunciation: 'ˈreɪnbəʊ',
    example: 'There is a rainbow after rain.',
    exampleTranslation: 'Có cầu vồng sau cơn mưa.',
    category: 'intermediate-weather',
    image: '🌈'
  },
  {
    word: 'Temperature',
    meaning: 'Nhiệt độ',
    pronunciation: 'ˈtemprətʃə',
    example: 'The temperature is 25 degrees.',
    exampleTranslation: 'Nhiệt độ là 25 độ.',
    category: 'intermediate-weather',
    image: '🌡️'
  },

  // Trung cấp - Thức ăn
  {
    word: 'Breakfast',
    meaning: 'Bữa sáng',
    pronunciation: 'ˈbrekfəst',
    example: 'I eat breakfast at 7 AM.',
    exampleTranslation: 'Tôi ăn sáng lúc 7 giờ.',
    category: 'intermediate-food',
    image: '🍳'
  },
  {
    word: 'Lunch',
    meaning: 'Bữa trưa',
    pronunciation: 'lʌntʃ',
    example: 'We have lunch together.',
    exampleTranslation: 'Chúng tôi ăn trưa cùng nhau.',
    category: 'intermediate-food',
    image: '🍽️'
  },
  {
    word: 'Dinner',
    meaning: 'Bữa tối',
    pronunciation: 'ˈdɪnə',
    example: 'Dinner is ready.',
    exampleTranslation: 'Bữa tối đã sẵn sàng.',
    category: 'intermediate-food',
    image: '🍽️'
  },
  {
    word: 'Sandwich',
    meaning: 'Bánh mì kẹp',
    pronunciation: 'ˈsænwɪdʒ',
    example: 'I made a sandwich for lunch.',
    exampleTranslation: 'Tôi làm bánh mì kẹp cho bữa trưa.',
    category: 'intermediate-food',
    image: '🥪'
  },
  {
    word: 'Pizza',
    meaning: 'Bánh pizza',
    pronunciation: 'ˈpiːtsə',
    example: 'We ordered pizza for dinner.',
    exampleTranslation: 'Chúng tôi gọi pizza cho bữa tối.',
    category: 'intermediate-food',
    image: '🍕'
  },
  {
    word: 'Salad',
    meaning: 'Salad',
    pronunciation: 'ˈsæləd',
    example: 'She eats salad every day.',
    exampleTranslation: 'Cô ấy ăn salad mỗi ngày.',
    category: 'intermediate-food',
    image: '🥗'
  },
  {
    word: 'Soup',
    meaning: 'Súp',
    pronunciation: 'suːp',
    example: 'The soup is hot.',
    exampleTranslation: 'Súp nóng.',
    category: 'intermediate-food',
    image: '🍲'
  },
  {
    word: 'Dessert',
    meaning: 'Tráng miệng',
    pronunciation: 'dɪˈzɜːt',
    example: 'What dessert would you like?',
    exampleTranslation: 'Bạn muốn tráng miệng gì?',
    category: 'intermediate-food',
    image: '🍰'
  },
  {
    word: 'Beverage',
    meaning: 'Đồ uống',
    pronunciation: 'ˈbevərɪdʒ',
    example: 'What beverage do you prefer?',
    exampleTranslation: 'Bạn thích đồ uống gì?',
    category: 'intermediate-food',
    image: '🥤'
  },
  {
    word: 'Recipe',
    meaning: 'Công thức nấu ăn',
    pronunciation: 'ˈresəpi',
    example: 'This is my grandmother\'s recipe.',
    exampleTranslation: 'Đây là công thức của bà tôi.',
    category: 'intermediate-food',
    image: '📝'
  },

  // Trung cấp - Du lịch
  {
    word: 'Airport',
    meaning: 'Sân bay',
    pronunciation: 'ˈeəpɔːt',
    example: 'We arrived at the airport early.',
    exampleTranslation: 'Chúng tôi đến sân bay sớm.',
    category: 'intermediate-travel',
    image: '✈️'
  },
  {
    word: 'Hotel',
    meaning: 'Khách sạn',
    pronunciation: 'həʊˈtel',
    example: 'The hotel is very comfortable.',
    exampleTranslation: 'Khách sạn rất thoải mái.',
    category: 'intermediate-travel',
    image: '🏨'
  },
  {
    word: 'Passport',
    meaning: 'Hộ chiếu',
    pronunciation: 'ˈpɑːspɔːt',
    example: 'Don\'t forget your passport.',
    exampleTranslation: 'Đừng quên hộ chiếu của bạn.',
    category: 'intermediate-travel',
    image: '📘'
  },
  {
    word: 'Luggage',
    meaning: 'Hành lý',
    pronunciation: 'ˈlʌɡɪdʒ',
    example: 'My luggage is heavy.',
    exampleTranslation: 'Hành lý của tôi nặng.',
    category: 'intermediate-travel',
    image: '🧳'
  },
  {
    word: 'Ticket',
    meaning: 'Vé',
    pronunciation: 'ˈtɪkɪt',
    example: 'I bought a plane ticket.',
    exampleTranslation: 'Tôi đã mua vé máy bay.',
    category: 'intermediate-travel',
    image: '🎫'
  },
  {
    word: 'Vacation',
    meaning: 'Kỳ nghỉ',
    pronunciation: 'vəˈkeɪʃn',
    example: 'We are going on vacation.',
    exampleTranslation: 'Chúng tôi sẽ đi nghỉ.',
    category: 'intermediate-travel',
    image: '🏖️'
  },
  {
    word: 'Tourist',
    meaning: 'Du khách',
    pronunciation: 'ˈtʊərɪst',
    example: 'Many tourists visit this city.',
    exampleTranslation: 'Nhiều du khách thăm thành phố này.',
    category: 'intermediate-travel',
    image: '🧳'
  },
  {
    word: 'Museum',
    meaning: 'Bảo tàng',
    pronunciation: 'mjuˈziːəm',
    example: 'The museum has ancient artifacts.',
    exampleTranslation: 'Bảo tàng có những hiện vật cổ.',
    category: 'intermediate-travel',
    image: '🏛️'
  },
  {
    word: 'Beach',
    meaning: 'Bãi biển',
    pronunciation: 'biːtʃ',
    example: 'The beach is beautiful.',
    exampleTranslation: 'Bãi biển rất đẹp.',
    category: 'intermediate-travel',
    image: '🏖️'
  },
  {
    word: 'Mountain',
    meaning: 'Núi',
    pronunciation: 'ˈmaʊntɪn',
    example: 'We climbed the mountain.',
    exampleTranslation: 'Chúng tôi leo núi.',
    category: 'intermediate-travel',
    image: '⛰️'
  },

  // Nâng cao - Kinh doanh
  {
    word: 'Enterprise',
    meaning: 'Doanh nghiệp',
    pronunciation: 'ˈentərpraɪz',
    example: 'The enterprise is growing rapidly.',
    exampleTranslation: 'Doanh nghiệp đang phát triển nhanh chóng.',
    category: 'advanced-business',
    image: '🏢'
  },
  {
    word: 'Contract',
    meaning: 'Hợp đồng',
    pronunciation: 'ˈkɒntrækt',
    example: 'We signed a new contract.',
    exampleTranslation: 'Chúng tôi ký một hợp đồng mới.',
    category: 'advanced-business',
    image: '📋'
  },
  {
    word: 'Investment',
    meaning: 'Đầu tư',
    pronunciation: 'ɪnˈvestmənt',
    example: 'This is a good investment.',
    exampleTranslation: 'Đây là một khoản đầu tư tốt.',
    category: 'advanced-business',
    image: '💰'
  },
  {
    word: 'Profit',
    meaning: 'Lợi nhuận',
    pronunciation: 'ˈprɒfɪt',
    example: 'The company made a huge profit.',
    exampleTranslation: 'Công ty đã kiếm được lợi nhuận khổng lồ.',
    category: 'advanced-business',
    image: '📈'
  },
  {
    word: 'Strategy',
    meaning: 'Chiến lược',
    pronunciation: 'ˈstrætədʒi',
    example: 'Our strategy is to expand globally.',
    exampleTranslation: 'Chiến lược của chúng tôi là mở rộng toàn cầu.',
    category: 'advanced-business',
    image: '🎯'
  },
  {
    word: 'Negotiation',
    meaning: 'Đàm phán',
    pronunciation: 'nɪˌɡoʊʃiˈeɪʃn',
    example: 'The negotiation took three hours.',
    exampleTranslation: 'Cuộc đàm phán kéo dài ba giờ.',
    category: 'advanced-business',
    image: '🤝'
  },
  {
    word: 'Merger',
    meaning: 'Sáp nhập',
    pronunciation: 'ˈmɜːrdʒər',
    example: 'The merger was successful.',
    exampleTranslation: 'Sáp nhập đã thành công.',
    category: 'advanced-business',
    image: '🔗'
  },
  {
    word: 'Dividend',
    meaning: 'Cổ tức',
    pronunciation: 'ˈdɪvɪdend',
    example: 'Shareholders received a dividend.',
    exampleTranslation: 'Cổ đông nhận được cổ tức.',
    category: 'advanced-business',
    image: '💵'
  },
  {
    word: 'Portfolio',
    meaning: 'Danh mục đầu tư',
    pronunciation: 'pɔːrˈfoʊlioʊ',
    example: 'He has a diverse portfolio.',
    exampleTranslation: 'Anh ấy có danh mục đầu tư đa dạng.',
    category: 'advanced-business',
    image: '📊'
  },
  {
    word: 'Franchise',
    meaning: 'Nhượng quyền',
    pronunciation: 'ˈfræntʃaɪz',
    example: 'They opened a franchise in Vietnam.',
    exampleTranslation: 'Họ mở một nhượng quyền ở Việt Nam.',
    category: 'advanced-business',
    image: '🏪'
  },

  // Nâng cao - Công nghệ
  {
    word: 'Algorithm',
    meaning: 'Thuật toán',
    pronunciation: 'ˈælɡərɪðəm',
    example: 'The algorithm is very efficient.',
    exampleTranslation: 'Thuật toán rất hiệu quả.',
    category: 'advanced-technology',
    image: '⚙️'
  },
  {
    word: 'Database',
    meaning: 'Cơ sở dữ liệu',
    pronunciation: 'ˈdeɪtəbeɪs',
    example: 'The database contains millions of records.',
    exampleTranslation: 'Cơ sở dữ liệu chứa hàng triệu bản ghi.',
    category: 'advanced-technology',
    image: '🗄️'
  },
  {
    word: 'Encryption',
    meaning: 'Mã hóa',
    pronunciation: 'ɪnˈkrɪpʃn',
    example: 'Encryption protects your data.',
    exampleTranslation: 'Mã hóa bảo vệ dữ liệu của bạn.',
    category: 'advanced-technology',
    image: '🔐'
  },
  {
    word: 'Interface',
    meaning: 'Giao diện',
    pronunciation: 'ˈɪntərfeɪs',
    example: 'The user interface is intuitive.',
    exampleTranslation: 'Giao diện người dùng rất trực quan.',
    category: 'advanced-technology',
    image: '💻'
  },
  {
    word: 'Server',
    meaning: 'Máy chủ',
    pronunciation: 'ˈsɜːrvər',
    example: 'The server is down for maintenance.',
    exampleTranslation: 'Máy chủ đang bảo trì.',
    category: 'advanced-technology',
    image: '🖥️'
  },
  {
    word: 'Cloud',
    meaning: 'Đám mây',
    pronunciation: 'klaʊd',
    example: 'We store files in the cloud.',
    exampleTranslation: 'Chúng tôi lưu trữ tệp trên đám mây.',
    category: 'advanced-technology',
    image: '☁️'
  },
  {
    word: 'Bandwidth',
    meaning: 'Băng thông',
    pronunciation: 'ˈbændwɪdθ',
    example: 'We need more bandwidth for streaming.',
    exampleTranslation: 'Chúng tôi cần băng thông lớn hơn để phát trực tuyến.',
    category: 'advanced-technology',
    image: '📡'
  },
  {
    word: 'Malware',
    meaning: 'Phần mềm độc hại',
    pronunciation: 'ˈmælweər',
    example: 'The antivirus detected malware.',
    exampleTranslation: 'Phần mềm diệt virus phát hiện phần mềm độc hại.',
    category: 'advanced-technology',
    image: '🦠'
  },
  {
    word: 'Firewall',
    meaning: 'Tường lửa',
    pronunciation: 'ˈfaɪərwɔːl',
    example: 'The firewall blocks unauthorized access.',
    exampleTranslation: 'Tường lửa chặn truy cập trái phép.',
    category: 'advanced-technology',
    image: '🔥'
  },
  {
    word: 'Debugging',
    meaning: 'Gỡ lỗi',
    pronunciation: 'dɪˈbʌɡɪŋ',
    example: 'Debugging is part of programming.',
    exampleTranslation: 'Gỡ lỗi là một phần của lập trình.',
    category: 'advanced-technology',
    image: '🐛'
  },

  // Nâng cao - Khoa học
  {
    word: 'Molecule',
    meaning: 'Phân tử',
    pronunciation: 'ˈmɒlɪkjuːl',
    example: 'Water molecules contain hydrogen and oxygen.',
    exampleTranslation: 'Phân tử nước chứa hydro và oxy.',
    category: 'advanced-science',
    image: '⚛️'
  },
  {
    word: 'Photosynthesis',
    meaning: 'Quang hợp',
    pronunciation: 'ˌfoʊtəʊˈsɪnθəsɪs',
    example: 'Photosynthesis is essential for plants.',
    exampleTranslation: 'Quang hợp rất cần thiết cho thực vật.',
    category: 'advanced-science',
    image: '🌱'
  },
  {
    word: 'Gravity',
    meaning: 'Trọng lực',
    pronunciation: 'ˈɡrævɪti',
    example: 'Gravity pulls objects toward Earth.',
    exampleTranslation: 'Trọng lực kéo các vật về phía Trái Đất.',
    category: 'advanced-science',
    image: '🌍'
  },
  {
    word: 'Nucleus',
    meaning: 'Hạt nhân',
    pronunciation: 'ˈnjuːkliəs',
    example: 'The nucleus is the center of an atom.',
    exampleTranslation: 'Hạt nhân là tâm của một nguyên tử.',
    category: 'advanced-science',
    image: '🔬'
  },
  {
    word: 'Catalyst',
    meaning: 'Chất xúc tác',
    pronunciation: 'ˈkætəlɪst',
    example: 'A catalyst speeds up the reaction.',
    exampleTranslation: 'Chất xúc tác tăng tốc độ phản ứng.',
    category: 'advanced-science',
    image: '⚗️'
  },
  {
    word: 'Ecosystem',
    meaning: 'Hệ sinh thái',
    pronunciation: 'ˈiːkoʊsɪstəm',
    example: 'The ecosystem is in balance.',
    exampleTranslation: 'Hệ sinh thái đang cân bằng.',
    category: 'advanced-science',
    image: '🌿'
  },
  {
    word: 'Evolution',
    meaning: 'Tiến hóa',
    pronunciation: 'ˌevəˈluːʃn',
    example: 'Evolution explains the diversity of life.',
    exampleTranslation: 'Tiến hóa giải thích sự đa dạng của sự sống.',
    category: 'advanced-science',
    image: '🦴'
  },
  {
    word: 'Mutation',
    meaning: 'Đột biến',
    pronunciation: 'mjuːˈteɪʃn',
    example: 'A mutation can change DNA.',
    exampleTranslation: 'Đột biến có thể thay đổi DNA.',
    category: 'advanced-science',
    image: '🧬'
  },
  {
    word: 'Hypothesis',
    meaning: 'Giả thuyết',
    pronunciation: 'haɪˈpɒθəsɪs',
    example: 'The hypothesis needs to be tested.',
    exampleTranslation: 'Giả thuyết cần được kiểm tra.',
    category: 'advanced-science',
    image: '🤔'
  },
  {
    word: 'Experiment',
    meaning: 'Thí nghiệm',
    pronunciation: 'ɪkˈsperɪmənt',
    example: 'The experiment produced unexpected results.',
    exampleTranslation: 'Thí nghiệm cho kết quả bất ngờ.',
    category: 'advanced-science',
    image: '🧪'
  },

  // Nâng cao - Văn học
  {
    word: 'Novel',
    meaning: 'Tiểu thuyết',
    pronunciation: 'ˈnɒvl',
    example: 'She wrote a bestselling novel.',
    exampleTranslation: 'Cô ấy viết một tiểu thuyết bán chạy nhất.',
    category: 'advanced-literature',
    image: '📖'
  },
  {
    word: 'Metaphor',
    meaning: 'Ẩn dụ',
    pronunciation: 'ˈmetəfər',
    example: 'The poem uses metaphor effectively.',
    exampleTranslation: 'Bài thơ sử dụng ẩn dụ một cách hiệu quả.',
    category: 'advanced-literature',
    image: '✨'
  },
  {
    word: 'Protagonist',
    meaning: 'Nhân vật chính',
    pronunciation: 'prəˈtæɡənɪst',
    example: 'The protagonist faces many challenges.',
    exampleTranslation: 'Nhân vật chính phải đối mặt với nhiều thách thức.',
    category: 'advanced-literature',
    image: '🎭'
  },
  {
    word: 'Narrative',
    meaning: 'Tường thuật',
    pronunciation: 'ˈnærətɪv',
    example: 'The narrative is told from multiple perspectives.',
    exampleTranslation: 'Tường thuật được kể từ nhiều góc độ.',
    category: 'advanced-literature',
    image: '📚'
  },
  {
    word: 'Symbolism',
    meaning: 'Biểu tượng',
    pronunciation: 'ˈsɪmbəlɪzəm',
    example: 'Symbolism is important in literature.',
    exampleTranslation: 'Biểu tượng rất quan trọng trong văn học.',
    category: 'advanced-literature',
    image: '🎨'
  },
  {
    word: 'Irony',
    meaning: 'Mỉa mai',
    pronunciation: 'ˈaɪrəni',
    example: 'The story is full of irony.',
    exampleTranslation: 'Câu chuyện đầy mỉa mai.',
    category: 'advanced-literature',
    image: '😏'
  },
  {
    word: 'Climax',
    meaning: 'Cao trào',
    pronunciation: 'ˈklaɪmæks',
    example: 'The climax of the story is thrilling.',
    exampleTranslation: 'Cao trào của câu chuyện rất hồi hộp.',
    category: 'advanced-literature',
    image: '🎬'
  },
  {
    word: 'Dialogue',
    meaning: 'Đối thoại',
    pronunciation: 'ˈdaɪəlɒɡ',
    example: 'The dialogue between characters is witty.',
    exampleTranslation: 'Đối thoại giữa các nhân vật rất hóm hỉnh.',
    category: 'advanced-literature',
    image: '💬'
  },
  {
    word: 'Foreshadowing',
    meaning: 'Báo trước',
    pronunciation: 'ˌfɔːrˈʃædoʊɪŋ',
    example: 'Foreshadowing hints at future events.',
    exampleTranslation: 'Báo trước gợi ý các sự kiện trong tương lai.',
    category: 'advanced-literature',
    image: '🔮'
  },
  {
    word: 'Anthology',
    meaning: 'Tuyển tập',
    pronunciation: 'ænˈθɒlədʒi',
    example: 'The anthology contains works by many authors.',
    exampleTranslation: 'Tuyển tập chứa các tác phẩm của nhiều tác giả.',
    category: 'advanced-literature',
    image: '📕'
  },

  // Giao tiếp - Hàng ngày
  {
    word: 'Good morning! How are you?',
    meaning: 'Chào buổi sáng! Bạn khỏe không?',
    pronunciation: 'ɡʊd ˈmɔːrnɪŋ haʊ ɑːr juː',
    example: 'Good morning! How are you today?',
    exampleTranslation: 'Chào buổi sáng! Hôm nay bạn khỏe không?',
    category: 'communication-daily',
    image: '☀️'
  },
  {
    word: 'I\'m fine, thank you. And you?',
    meaning: 'Tôi khỏe, cảm ơn. Còn bạn?',
    pronunciation: 'aɪm faɪn θæŋk juː ænd juː',
    example: 'I\'m fine, thank you. And you?',
    exampleTranslation: 'Tôi khỏe, cảm ơn. Còn bạn?',
    category: 'communication-daily',
    image: '😊'
  },
  {
    word: 'Nice to meet you! I\'m John.',
    meaning: 'Rất vui được gặp bạn! Tôi là John.',
    pronunciation: 'naɪs tə miːt juː aɪm dʒɒn',
    example: 'Nice to meet you! I\'m John. What\'s your name?',
    exampleTranslation: 'Rất vui được gặp bạn! Tôi là John. Tên bạn là gì?',
    category: 'communication-daily',
    image: '🤝'
  },
  {
    word: 'Thank you very much for your help!',
    meaning: 'Cảm ơn bạn rất nhiều vì đã giúp đỡ!',
    pronunciation: 'θæŋk juː ˈveri mʌtʃ fɔːr jɔːr help',
    example: 'Thank you very much for your help!',
    exampleTranslation: 'Cảm ơn bạn rất nhiều vì đã giúp đỡ!',
    category: 'communication-daily',
    image: '🙏'
  },
  {
    word: 'You\'re welcome! Happy to help.',
    meaning: 'Không có gì! Vui lòng giúp đỡ.',
    pronunciation: 'jɔːr ˈwelkəm ˈhæpi tə help',
    example: 'You\'re welcome! Happy to help anytime.',
    exampleTranslation: 'Không có gì! Vui lòng giúp đỡ bất cứ lúc nào.',
    category: 'communication-daily',
    image: '😄'
  },
  {
    word: 'Excuse me, where is the bathroom?',
    meaning: 'Xin lỗi, nhà vệ sinh ở đâu?',
    pronunciation: 'ɪkˈskjuːz miː weər ɪz ðə ˈbæθruːm',
    example: 'Excuse me, where is the bathroom?',
    exampleTranslation: 'Xin lỗi, nhà vệ sinh ở đâu?',
    category: 'communication-daily',
    image: '🙋'
  },
  {
    word: 'I\'m sorry for being late.',
    meaning: 'Tôi xin lỗi vì đến muộn.',
    pronunciation: 'aɪm ˈsɒri fɔːr ˈbiːɪŋ leɪt',
    example: 'I\'m sorry for being late. Traffic was terrible.',
    exampleTranslation: 'Tôi xin lỗi vì đến muộn. Giao thông rất tắc.',
    category: 'communication-daily',
    image: '😔'
  },
  {
    word: 'See you later! Have a good day.',
    meaning: 'Tạm biệt! Có một ngày tốt lành.',
    pronunciation: 'siː juː ˈleɪtər hæv ə ɡʊd deɪ',
    example: 'See you later! Have a good day!',
    exampleTranslation: 'Tạm biệt! Có một ngày tốt lành!',
    category: 'communication-daily',
    image: '👋'
  },
  {
    word: 'What\'s your name? I\'m Sarah.',
    meaning: 'Tên bạn là gì? Tôi là Sarah.',
    pronunciation: 'wɒts jɔːr neɪm aɪm ˈseərə',
    example: 'What\'s your name? I\'m Sarah.',
    exampleTranslation: 'Tên bạn là gì? Tôi là Sarah.',
    category: 'communication-daily',
    image: '📝'
  },
  {
    word: 'Where are you from? I\'m from Vietnam.',
    meaning: 'Bạn đến từ đâu? Tôi đến từ Việt Nam.',
    pronunciation: 'weər ɑːr juː frɒm aɪm frɒm viːetˈnɑːm',
    example: 'Where are you from? I\'m from Vietnam.',
    exampleTranslation: 'Bạn đến từ đâu? Tôi đến từ Việt Nam.',
    category: 'communication-daily',
    image: '🌍'
  },

  // Giao tiếp - Nơi làm việc
  {
    word: 'We have a meeting at 2 PM.',
    meaning: 'Chúng tôi có cuộc họp lúc 2 giờ chiều.',
    pronunciation: 'wiː hæv ə ˈmiːtɪŋ æt tuː piːem',
    example: 'We have a meeting at 2 PM today.',
    exampleTranslation: 'Chúng tôi có cuộc họp lúc 2 giờ chiều hôm nay.',
    category: 'communication-workplace',
    image: '📊'
  },
  {
    word: 'The deadline is next Friday.',
    meaning: 'Hạn chót là thứ Sáu tuần tới.',
    pronunciation: 'ðə ˈdedlaɪn ɪz nekst ˈfraɪdeɪ',
    example: 'The deadline is next Friday at 5 PM.',
    exampleTranslation: 'Hạn chót là thứ Sáu tuần tới lúc 5 giờ chiều.',
    category: 'communication-workplace',
    image: '⏰'
  },
  {
    word: 'I\'m working on a new project.',
    meaning: 'Tôi đang làm việc trên một dự án mới.',
    pronunciation: 'aɪm ˈwɜːrkɪŋ ɒn ə njuː ˈprɒdʒekt',
    example: 'I\'m working on a new project with the team.',
    exampleTranslation: 'Tôi đang làm việc trên một dự án mới với nhóm.',
    category: 'communication-workplace',
    image: '📋'
  },
  {
    word: 'My colleague is very helpful.',
    meaning: 'Đồng nghiệp của tôi rất hữu ích.',
    pronunciation: 'maɪ ˈkɒliːɡ ɪz ˈveri ˈhelpfl',
    example: 'My colleague is very helpful and friendly.',
    exampleTranslation: 'Đồng nghiệp của tôi rất hữu ích và thân thiện.',
    category: 'communication-workplace',
    image: '👔'
  },
  {
    word: 'I have a presentation tomorrow.',
    meaning: 'Tôi có một bài thuyết trình vào ngày mai.',
    pronunciation: 'aɪ hæv ə ˌprezənˈteɪʃn təˈmɒroʊ',
    example: 'I have a presentation tomorrow morning.',
    exampleTranslation: 'Tôi có một bài thuyết trình vào sáng mai.',
    category: 'communication-workplace',
    image: '🎤'
  },
  {
    word: 'Please submit your report by Friday.',
    meaning: 'Vui lòng nộp báo cáo của bạn vào thứ Sáu.',
    pronunciation: 'pliːz səbˈmɪt jɔːr rɪˈpɔːrt baɪ ˈfraɪdeɪ',
    example: 'Please submit your report by Friday at noon.',
    exampleTranslation: 'Vui lòng nộp báo cáo của bạn vào thứ Sáu lúc trưa.',
    category: 'communication-workplace',
    image: '📄'
  },
  {
    word: 'Can you give me feedback on my work?',
    meaning: 'Bạn có thể cho tôi phản hồi về công việc của tôi không?',
    pronunciation: 'kæn juː ɡɪv miː ˈfiːdbæk ɒn maɪ wɜːrk',
    example: 'Can you give me feedback on my work?',
    exampleTranslation: 'Bạn có thể cho tôi phản hồi về công việc của tôi không?',
    category: 'communication-workplace',
    image: '💬'
  },
  {
    word: 'She got a promotion last month.',
    meaning: 'Cô ấy được thăng chức tháng trước.',
    pronunciation: 'ʃi ɡɒt ə prəˈmoʊʃn læst mʌnθ',
    example: 'She got a promotion last month. Congratulations!',
    exampleTranslation: 'Cô ấy được thăng chức tháng trước. Chúc mừng!',
    category: 'communication-workplace',
    image: '📈'
  },
  {
    word: 'The salary is very competitive.',
    meaning: 'Lương rất cạnh tranh.',
    pronunciation: 'ðə ˈsæləri ɪz ˈveri kəmˈpetɪtɪv',
    example: 'The salary is very competitive for this position.',
    exampleTranslation: 'Lương rất cạnh tranh cho vị trí này.',
    category: 'communication-workplace',
    image: '💰'
  },
  {
    word: 'Let\'s take a break time.',
    meaning: 'Hãy nghỉ một lát.',
    pronunciation: 'lets teɪk ə breɪk taɪm',
    example: 'Let\'s take a break time. I need some coffee.',
    exampleTranslation: 'Hãy nghỉ một lát. Tôi cần một tách cà phê.',
    category: 'communication-workplace',
    image: '☕'
  },

  // Giao tiếp - Xã hội
  {
    word: 'Are you coming to the party?',
    meaning: 'Bạn có đến bữa tiệc không?',
    pronunciation: 'ɑːr juː ˈkʌmɪŋ tə ðə ˈpɑːrti',
    example: 'Are you coming to the party tonight?',
    exampleTranslation: 'Bạn có đến bữa tiệc tối nay không?',
    category: 'communication-social',
    image: '🎉'
  },
  {
    word: 'She is my best friend.',
    meaning: 'Cô ấy là bạn thân của tôi.',
    pronunciation: 'ʃi ɪz maɪ best frend',
    example: 'She is my best friend. We\'ve known each other for years.',
    exampleTranslation: 'Cô ấy là bạn thân của tôi. Chúng tôi quen nhau nhiều năm rồi.',
    category: 'communication-social',
    image: '👫'
  },
  {
    word: 'I received an invitation to the wedding.',
    meaning: 'Tôi nhận được lời mời đến đám cưới.',
    pronunciation: 'aɪ rɪˈsiːvd ən ɪnvɪˈteɪʃn tə ðə ˈwedɪŋ',
    example: 'I received an invitation to the wedding next month.',
    exampleTranslation: 'Tôi nhận được lời mời đến đám cưới tháng tới.',
    category: 'communication-social',
    image: '💌'
  },
  {
    word: 'Let\'s celebrate your birthday!',
    meaning: 'Hãy ăn mừng sinh nhật của bạn!',
    pronunciation: 'lets ˈselɪbreɪt jɔːr ˈbɜːrθdeɪ',
    example: 'Let\'s celebrate your birthday! I have a surprise for you.',
    exampleTranslation: 'Hãy ăn mừng sinh nhật của bạn! Tôi có một bất ngờ cho bạn.',
    category: 'communication-social',
    image: '🎂'
  },
  {
    word: 'We had a nice conversation.',
    meaning: 'Chúng tôi có một cuộc trò chuyện tuyệt vời.',
    pronunciation: 'wiː hæd ə naɪs ˌkɒnvərˈseɪʃn',
    example: 'We had a nice conversation about life and dreams.',
    exampleTranslation: 'Chúng tôi có một cuộc trò chuyện tuyệt vời về cuộc sống và giấc mơ.',
    category: 'communication-social',
    image: '💭'
  },
  {
    word: 'Don\'t gossip about others.',
    meaning: 'Đừng nói xấu người khác.',
    pronunciation: 'doʊnt ˈɡɒsɪp əˈbaʊt ˈʌðərz',
    example: 'Don\'t gossip about others. It\'s not nice.',
    exampleTranslation: 'Đừng nói xấu người khác. Điều đó không tốt.',
    category: 'communication-social',
    image: '🤐'
  },
  {
    word: 'She gave me a compliment.',
    meaning: 'Cô ấy khen ngợi tôi.',
    pronunciation: 'ʃi ɡeɪv miː ə ˈkɒmplɪmənt',
    example: 'She gave me a compliment about my work.',
    exampleTranslation: 'Cô ấy khen ngợi tôi về công việc của tôi.',
    category: 'communication-social',
    image: '😊'
  },
  {
    word: 'We had an argument yesterday.',
    meaning: 'Chúng tôi tranh cãi hôm qua.',
    pronunciation: 'wiː hæd ən ˈɑːrɡjumənt ˈjestərdeɪ',
    example: 'We had an argument yesterday, but we\'re friends again now.',
    exampleTranslation: 'Chúng tôi tranh cãi hôm qua, nhưng bây giờ chúng tôi lại là bạn.',
    category: 'communication-social',
    image: '😠'
  },
  {
    word: 'I apologize for my mistake.',
    meaning: 'Tôi xin lỗi vì lỗi của tôi.',
    pronunciation: 'aɪ əˈpɒlədʒaɪz fɔːr maɪ mɪˈsteɪk',
    example: 'I apologize for my mistake. I didn\'t mean to hurt you.',
    exampleTranslation: 'Tôi xin lỗi vì lỗi của tôi. Tôi không có ý làm tổn thương bạn.',
    category: 'communication-social',
    image: '🙏'
  },
  {
    word: 'Can you forgive me?',
    meaning: 'Bạn có thể tha thứ cho tôi không?',
    pronunciation: 'kæn juː fərˈɡɪv miː',
    example: 'Can you forgive me? I promise it won\'t happen again.',
    exampleTranslation: 'Bạn có thể tha thứ cho tôi không? Tôi hứa điều đó sẽ không xảy ra nữa.',
    category: 'communication-social',
    image: '💚'
  },

  // Giao tiếp - Điện thoại
  {
    word: 'I will call you later.',
    meaning: 'Tôi sẽ gọi cho bạn sau.',
    pronunciation: 'aɪ wɪl kɔːl juː ˈleɪtər',
    example: 'I will call you later this evening.',
    exampleTranslation: 'Tôi sẽ gọi cho bạn tối nay.',
    category: 'communication-phone',
    image: '☎️'
  },
  {
    word: 'Did you get my message?',
    meaning: 'Bạn có nhận được tin nhắn của tôi không?',
    pronunciation: 'dɪd juː ɡet maɪ ˈmesɪdʒ',
    example: 'Did you get my message? I sent it an hour ago.',
    exampleTranslation: 'Bạn có nhận được tin nhắn của tôi không? Tôi gửi nó một giờ trước.',
    category: 'communication-phone',
    image: '💬'
  },
  {
    word: 'Text me when you arrive.',
    meaning: 'Nhắn tin cho tôi khi bạn đến.',
    pronunciation: 'tekst miː wen juː əˈraɪv',
    example: 'Text me when you arrive at the station.',
    exampleTranslation: 'Nhắn tin cho tôi khi bạn đến ga.',
    category: 'communication-phone',
    image: '📱'
  },
  {
    word: 'Send me an email with the details.',
    meaning: 'Gửi cho tôi một email với chi tiết.',
    pronunciation: 'send miː ən ˈiːmeɪl wɪð ðə ˈdiːteɪlz',
    example: 'Send me an email with the details by tomorrow.',
    exampleTranslation: 'Gửi cho tôi một email với chi tiết vào ngày mai.',
    category: 'communication-phone',
    image: '📧'
  },
  {
    word: 'What\'s your phone number?',
    meaning: 'Số điện thoại của bạn là gì?',
    pronunciation: 'wɒts jɔːr foʊn ˈnʌmbər',
    example: 'What\'s your phone number? I\'ll save it.',
    exampleTranslation: 'Số điện thoại của bạn là gì? Tôi sẽ lưu nó.',
    category: 'communication-phone',
    image: '📞'
  },
  {
    word: 'I left you a voicemail.',
    meaning: 'Tôi để lại cho bạn một tin nhắn thoại.',
    pronunciation: 'aɪ left juː ə ˈvɔɪsmeɪl',
    example: 'I left you a voicemail. Please check it.',
    exampleTranslation: 'Tôi để lại cho bạn một tin nhắn thoại. Vui lòng kiểm tra nó.',
    category: 'communication-phone',
    image: '🎙️'
  },
  {
    word: 'Don\'t hang up! I\'m still talking.',
    meaning: 'Đừng cúp máy! Tôi vẫn đang nói.',
    pronunciation: 'doʊnt hæŋ ʌp aɪm stɪl ˈtɔːkɪŋ',
    example: 'Don\'t hang up! I\'m still talking to you.',
    exampleTranslation: 'Đừng cúp máy! Tôi vẫn đang nói chuyện với bạn.',
    category: 'communication-phone',
    image: '📴'
  },
  {
    word: 'Hold on, I\'ll be right back.',
    meaning: 'Chờ một chút, tôi sẽ quay lại ngay.',
    pronunciation: 'hoʊld ɑːn aɪl biː raɪt bæk',
    example: 'Hold on, I\'ll be right back. Don\'t go away.',
    exampleTranslation: 'Chờ một chút, tôi sẽ quay lại ngay. Đừng đi đâu.',
    category: 'communication-phone',
    image: '⏳'
  },
  {
    word: 'The connection is bad.',
    meaning: 'Kết nối không tốt.',
    pronunciation: 'ðə kəˈnekʃn ɪz bæd',
    example: 'The connection is bad. Can you hear me?',
    exampleTranslation: 'Kết nối không tốt. Bạn có nghe tôi không?',
    category: 'communication-phone',
    image: '📶'
  },
  {
    word: 'My phone needs to charge.',
    meaning: 'Điện thoại của tôi cần sạc pin.',
    pronunciation: 'maɪ foʊn niːdz tə tʃɑːrdʒ',
    example: 'My phone needs to charge. It\'s almost dead.',
    exampleTranslation: 'Điện thoại của tôi cần sạc pin. Pin sắp hết.',
    category: 'communication-phone',
    image: '🔋'
  },

  // Chuyên ngành - Công nghệ thông tin - Phần mềm
  {
    word: 'Software',
    meaning: 'Phần mềm',
    pronunciation: 'ˈsɒftweər',
    example: 'This software is very user-friendly.',
    exampleTranslation: 'Phần mềm này rất thân thiện với người dùng.',
    category: 'specialized-it-software',
    image: '💾'
  },
  {
    word: 'Application',
    meaning: 'Ứng dụng',
    pronunciation: 'ˌæplɪˈkeɪʃn',
    example: 'The application crashed unexpectedly.',
    exampleTranslation: 'Ứng dụng bị sập một cách bất ngờ.',
    category: 'specialized-it-software',
    image: '📱'
  },
  {
    word: 'Programming',
    meaning: 'Lập trình',
    pronunciation: 'ˈproʊɡræmɪŋ',
    example: 'Programming requires logical thinking.',
    exampleTranslation: 'Lập trình đòi hỏi tư duy logic.',
    category: 'specialized-it-software',
    image: '💻'
  },
  {
    word: 'Code',
    meaning: 'Mã lệnh',
    pronunciation: 'koʊd',
    example: 'The code is well-documented.',
    exampleTranslation: 'Mã lệnh được ghi chép rõ ràng.',
    category: 'specialized-it-software',
    image: '📝'
  },
  {
    word: 'Framework',
    meaning: 'Khung công tác',
    pronunciation: 'ˈfreɪmwɜːrk',
    example: 'We use React framework for development.',
    exampleTranslation: 'Chúng tôi sử dụng khung công tác React để phát triển.',
    category: 'specialized-it-software',
    image: '🏗️'
  },
  {
    word: 'Library',
    meaning: 'Thư viện',
    pronunciation: 'ˈlaɪbreri',
    example: 'This library provides useful functions.',
    exampleTranslation: 'Thư viện này cung cấp các hàm hữu ích.',
    category: 'specialized-it-software',
    image: '📚'
  },
  {
    word: 'Version Control',
    meaning: 'Kiểm soát phiên bản',
    pronunciation: 'ˈvɜːrʒn kənˈtroʊl',
    example: 'Git is a popular version control system.',
    exampleTranslation: 'Git là một hệ thống kiểm soát phiên bản phổ biến.',
    category: 'specialized-it-software',
    image: '🔄'
  },
  {
    word: 'API',
    meaning: 'Giao diện lập trình ứng dụng',
    pronunciation: 'ˌeɪ piː ˈaɪ',
    example: 'The API documentation is comprehensive.',
    exampleTranslation: 'Tài liệu API rất toàn diện.',
    category: 'specialized-it-software',
    image: '🔌'
  },
  {
    word: 'Testing',
    meaning: 'Kiểm thử',
    pronunciation: 'ˈtestɪŋ',
    example: 'Testing is crucial for software quality.',
    exampleTranslation: 'Kiểm thử rất quan trọng cho chất lượng phần mềm.',
    category: 'specialized-it-software',
    image: '✅'
  },
  {
    word: 'Deployment',
    meaning: 'Triển khai',
    pronunciation: 'dɪˈplɔɪmənt',
    example: 'The deployment was successful.',
    exampleTranslation: 'Triển khai đã thành công.',
    category: 'specialized-it-software',
    image: '🚀'
  },

  // Chuyên ngành - Công nghệ thông tin - Phần cứng
  {
    word: 'Processor',
    meaning: 'Bộ xử lý',
    pronunciation: 'ˈprɑːsesər',
    example: 'The processor speed is 3.5 GHz.',
    exampleTranslation: 'Tốc độ bộ xử lý là 3.5 GHz.',
    category: 'specialized-it-hardware',
    image: '⚙️'
  },
  {
    word: 'Memory',
    meaning: 'Bộ nhớ',
    pronunciation: 'ˈmeməri',
    example: 'The computer has 16GB of memory.',
    exampleTranslation: 'Máy tính có 16GB bộ nhớ.',
    category: 'specialized-it-hardware',
    image: '💾'
  },
  {
    word: 'Storage',
    meaning: 'Lưu trữ',
    pronunciation: 'ˈstɔːrɪdʒ',
    example: 'The storage capacity is 512GB.',
    exampleTranslation: 'Dung lượng lưu trữ là 512GB.',
    category: 'specialized-it-hardware',
    image: '🗄️'
  },
  {
    word: 'Graphics Card',
    meaning: 'Card đồ họa',
    pronunciation: 'ˈɡræfɪks kɑːrd',
    example: 'The graphics card supports 4K resolution.',
    exampleTranslation: 'Card đồ họa hỗ trợ độ phân giải 4K.',
    category: 'specialized-it-hardware',
    image: '🎮'
  },
  {
    word: 'Motherboard',
    meaning: 'Bo mạch chủ',
    pronunciation: 'ˈmʌðərboːrd',
    example: 'The motherboard is compatible with this CPU.',
    exampleTranslation: 'Bo mạch chủ tương thích với CPU này.',
    category: 'specialized-it-hardware',
    image: '🔌'
  },
  {
    word: 'Power Supply',
    meaning: 'Nguồn điện',
    pronunciation: 'ˈpaʊər səˈplaɪ',
    example: 'The power supply is 750W.',
    exampleTranslation: 'Nguồn điện là 750W.',
    category: 'specialized-it-hardware',
    image: '🔋'
  },
  {
    word: 'Cooling System',
    meaning: 'Hệ thống làm mát',
    pronunciation: 'ˈkuːlɪŋ ˈsɪstəm',
    example: 'The cooling system keeps the CPU cool.',
    exampleTranslation: 'Hệ thống làm mát giữ cho CPU mát.',
    category: 'specialized-it-hardware',
    image: '❄️'
  },
  {
    word: 'Monitor',
    meaning: 'Màn hình',
    pronunciation: 'ˈmɑːnɪtər',
    example: 'The monitor has a 144Hz refresh rate.',
    exampleTranslation: 'Màn hình có tần số làm mới 144Hz.',
    category: 'specialized-it-hardware',
    image: '🖥️'
  },
  {
    word: 'Keyboard',
    meaning: 'Bàn phím',
    pronunciation: 'ˈkiːbɔːrd',
    example: 'The keyboard has mechanical switches.',
    exampleTranslation: 'Bàn phím có các phím cơ học.',
    category: 'specialized-it-hardware',
    image: '⌨️'
  },
  {
    word: 'Mouse',
    meaning: 'Chuột',
    pronunciation: 'maʊs',
    example: 'The mouse has adjustable DPI.',
    exampleTranslation: 'Chuột có DPI có thể điều chỉnh.',
    category: 'specialized-it-hardware',
    image: '🖱️'
  },

  // Chuyên ngành - Công nghệ thông tin - Mạng
  {
    word: 'Network',
    meaning: 'Mạng',
    pronunciation: 'ˈnetwɜːrk',
    example: 'The network is secure and fast.',
    exampleTranslation: 'Mạng an toàn và nhanh.',
    category: 'specialized-it-network',
    image: '🌐'
  },
  {
    word: 'Router',
    meaning: 'Bộ định tuyến',
    pronunciation: 'ˈruːtər',
    example: 'The router broadcasts WiFi signal.',
    exampleTranslation: 'Bộ định tuyến phát tín hiệu WiFi.',
    category: 'specialized-it-network',
    image: '📡'
  },
  {
    word: 'IP Address',
    meaning: 'Địa chỉ IP',
    pronunciation: 'ˌaɪ ˈpiː əˈdres',
    example: 'The IP address is 192.168.1.1.',
    exampleTranslation: 'Địa chỉ IP là 192.168.1.1.',
    category: 'specialized-it-network',
    image: '🔢'
  },
  {
    word: 'WiFi',
    meaning: 'WiFi',
    pronunciation: 'ˈwaɪfaɪ',
    example: 'The WiFi connection is stable.',
    exampleTranslation: 'Kết nối WiFi ổn định.',
    category: 'specialized-it-network',
    image: '📶'
  },
  {
    word: 'Ethernet',
    meaning: 'Ethernet',
    pronunciation: 'ˈiːθərnɛt',
    example: 'Ethernet provides faster speeds than WiFi.',
    exampleTranslation: 'Ethernet cung cấp tốc độ nhanh hơn WiFi.',
    category: 'specialized-it-network',
    image: '🔗'
  },
  {
    word: 'Protocol',
    meaning: 'Giao thức',
    pronunciation: 'ˈproʊtəkɑːl',
    example: 'HTTP is a common protocol.',
    exampleTranslation: 'HTTP là một giao thức phổ biến.',
    category: 'specialized-it-network',
    image: '📋'
  },
  {
    word: 'Bandwidth',
    meaning: 'Băng thông',
    pronunciation: 'ˈbændwɪdθ',
    example: 'The bandwidth is 100 Mbps.',
    exampleTranslation: 'Băng thông là 100 Mbps.',
    category: 'specialized-it-network',
    image: '📊'
  },
  {
    word: 'Latency',
    meaning: 'Độ trễ',
    pronunciation: 'ˈleɪtənsi',
    example: 'Low latency is important for gaming.',
    exampleTranslation: 'Độ trễ thấp rất quan trọng cho chơi game.',
    category: 'specialized-it-network',
    image: '⏱️'
  },
  {
    word: 'VPN',
    meaning: 'Mạng riêng ảo',
    pronunciation: 'ˌviː ˈpiː ˈɛn',
    example: 'VPN encrypts your internet connection.',
    exampleTranslation: 'VPN mã hóa kết nối internet của bạn.',
    category: 'specialized-it-network',
    image: '🔒'
  },
  {
    word: 'DNS',
    meaning: 'Hệ thống tên miền',
    pronunciation: 'ˌdiː ˈɛn ˈɛs',
    example: 'DNS translates domain names to IP addresses.',
    exampleTranslation: 'DNS dịch tên miền thành địa chỉ IP.',
    category: 'specialized-it-network',
    image: '🌍'
  },

  // Chuyên ngành - Công nghệ thông tin - Bảo mật
  {
    word: 'Security',
    meaning: 'Bảo mật',
    pronunciation: 'sɪˈkjʊrɪti',
    example: 'Security is our top priority.',
    exampleTranslation: 'Bảo mật là ưu tiên hàng đầu của chúng tôi.',
    category: 'specialized-it-security',
    image: '🔐'
  },
  {
    word: 'Password',
    meaning: 'Mật khẩu',
    pronunciation: 'ˈpæswɜːrd',
    example: 'Use a strong password for your account.',
    exampleTranslation: 'Sử dụng mật khẩu mạnh cho tài khoản của bạn.',
    category: 'specialized-it-security',
    image: '🔑'
  },
  {
    word: 'Authentication',
    meaning: 'Xác thực',
    pronunciation: 'ˌɔːθenˈtɪkeɪʃn',
    example: 'Two-factor authentication adds extra security.',
    exampleTranslation: 'Xác thực hai yếu tố thêm bảo mật.',
    category: 'specialized-it-security',
    image: '✓'
  },
  {
    word: 'Encryption',
    meaning: 'Mã hóa',
    pronunciation: 'ɪnˈkrɪpʃn',
    example: 'Encryption protects sensitive data.',
    exampleTranslation: 'Mã hóa bảo vệ dữ liệu nhạy cảm.',
    category: 'specialized-it-security',
    image: '🔒'
  },
  {
    word: 'Firewall',
    meaning: 'Tường lửa',
    pronunciation: 'ˈfaɪərwɔːl',
    example: 'The firewall blocks unauthorized access.',
    exampleTranslation: 'Tường lửa chặn truy cập trái phép.',
    category: 'specialized-it-security',
    image: '🔥'
  },
  {
    word: 'Malware',
    meaning: 'Phần mềm độc hại',
    pronunciation: 'ˈmælweər',
    example: 'Antivirus software detects malware.',
    exampleTranslation: 'Phần mềm diệt virus phát hiện phần mềm độc hại.',
    category: 'specialized-it-security',
    image: '🦠'
  },
  {
    word: 'Phishing',
    meaning: 'Lừa đảo qua email',
    pronunciation: 'ˈfɪʃɪŋ',
    example: 'Be careful of phishing emails.',
    exampleTranslation: 'Hãy cẩn thận với email lừa đảo.',
    category: 'specialized-it-security',
    image: '🎣'
  },
  {
    word: 'Backup',
    meaning: 'Sao lưu',
    pronunciation: 'ˈbækʌp',
    example: 'Regular backups prevent data loss.',
    exampleTranslation: 'Sao lưu thường xuyên ngăn chặn mất dữ liệu.',
    category: 'specialized-it-security',
    image: '💾'
  },
  {
    word: 'Vulnerability',
    meaning: 'Lỗ hổng bảo mật',
    pronunciation: 'ˌvʌlnərəˈbɪləti',
    example: 'The security team found a vulnerability.',
    exampleTranslation: 'Đội bảo mật tìm thấy một lỗ hổng.',
    category: 'specialized-it-security',
    image: '⚠️'
  },
  {
    word: 'SSL Certificate',
    meaning: 'Chứng chỉ SSL',
    pronunciation: 'ˌɛs ɛs ˈɛl sərˈtɪfɪkət',
    example: 'The website has a valid SSL certificate.',
    exampleTranslation: 'Trang web có chứng chỉ SSL hợp lệ.',
    category: 'specialized-it-security',
    image: '🔐'
  },

  // Chuyên ngành - Kinh tế - Kinh tế vĩ mô
  {
    word: 'GDP',
    meaning: 'Tổng sản phẩm quốc nội',
    pronunciation: 'ˌdʒiː diː ˈpiː',
    example: 'The country\'s GDP increased by 5% this year.',
    exampleTranslation: 'GDP của đất nước tăng 5% năm nay.',
    category: 'specialized-econ-macro',
    image: '📊'
  },
  {
    word: 'Inflation',
    meaning: 'Lạm phát',
    pronunciation: 'ɪnˈfleɪʃn',
    example: 'High inflation reduces purchasing power.',
    exampleTranslation: 'Lạm phát cao làm giảm sức mua.',
    category: 'specialized-econ-macro',
    image: '📈'
  },
  {
    word: 'Recession',
    meaning: 'Suy thoái kinh tế',
    pronunciation: 'rɪˈseʃn',
    example: 'The country entered a recession last year.',
    exampleTranslation: 'Đất nước bước vào suy thoái kinh tế năm ngoái.',
    category: 'specialized-econ-macro',
    image: '📉'
  },
  {
    word: 'Unemployment',
    meaning: 'Thất nghiệp',
    pronunciation: 'ˌʌnɪmˈplɔɪmənt',
    example: 'Unemployment rate is at 5%.',
    exampleTranslation: 'Tỷ lệ thất nghiệp là 5%.',
    category: 'specialized-econ-macro',
    image: '😔'
  },
  {
    word: 'Interest Rate',
    meaning: 'Lãi suất',
    pronunciation: 'ˈɪntrəst reɪt',
    example: 'The central bank raised the interest rate.',
    exampleTranslation: 'Ngân hàng trung ương tăng lãi suất.',
    category: 'specialized-econ-macro',
    image: '💰'
  },
  {
    word: 'Fiscal Policy',
    meaning: 'Chính sách tài khóa',
    pronunciation: 'ˈfɪskl ˈpɒləsi',
    example: 'The government uses fiscal policy to stimulate growth.',
    exampleTranslation: 'Chính phủ sử dụng chính sách tài khóa để kích thích tăng trưởng.',
    category: 'specialized-econ-macro',
    image: '🏛️'
  },
  {
    word: 'Monetary Policy',
    meaning: 'Chính sách tiền tệ',
    pronunciation: 'ˈmʌnɪtəri ˈpɒləsi',
    example: 'Monetary policy controls the money supply.',
    exampleTranslation: 'Chính sách tiền tệ kiểm soát cung tiền.',
    category: 'specialized-econ-macro',
    image: '🏦'
  },
  {
    word: 'Trade Deficit',
    meaning: 'Thâm hụt thương mại',
    pronunciation: 'treɪd ˈdefɪsɪt',
    example: 'The country has a large trade deficit.',
    exampleTranslation: 'Đất nước có thâm hụt thương mại lớn.',
    category: 'specialized-econ-macro',
    image: '⚖️'
  },
  {
    word: 'Exchange Rate',
    meaning: 'Tỷ giá hối đoái',
    pronunciation: 'ɪksˈtʃeɪndʒ reɪt',
    example: 'The exchange rate fluctuates daily.',
    exampleTranslation: 'Tỷ giá hối đoái biến động hàng ngày.',
    category: 'specialized-econ-macro',
    image: '💱'
  },
  {
    word: 'National Debt',
    meaning: 'Nợ quốc gia',
    pronunciation: 'ˈnæʃənl det',
    example: 'The national debt is increasing.',
    exampleTranslation: 'Nợ quốc gia đang tăng.',
    category: 'specialized-econ-macro',
    image: '📋'
  },

  // Chuyên ngành - Kinh tế - Kinh tế vi mô
  {
    word: 'Supply and Demand',
    meaning: 'Cung và cầu',
    pronunciation: 'səˈplaɪ ənd dɪˈmɑːnd',
    example: 'Supply and demand determine the price.',
    exampleTranslation: 'Cung và cầu xác định giá cả.',
    category: 'specialized-econ-micro',
    image: '⚖️'
  },
  {
    word: 'Elasticity',
    meaning: 'Độ co giãn',
    pronunciation: 'ɪˌlæsˈtɪsɪti',
    example: 'Price elasticity measures demand sensitivity.',
    exampleTranslation: 'Độ co giãn giá đo lường độ nhạy cảm của cầu.',
    category: 'specialized-econ-micro',
    image: '📏'
  },
  {
    word: 'Marginal Cost',
    meaning: 'Chi phí biên tế',
    pronunciation: 'ˈmɑːrdʒɪnl kɒst',
    example: 'Marginal cost increases with production.',
    exampleTranslation: 'Chi phí biên tế tăng theo sản xuất.',
    category: 'specialized-econ-micro',
    image: '💹'
  },
  {
    word: 'Consumer Surplus',
    meaning: 'Thặng dư tiêu dùng',
    pronunciation: 'kənˈsuːmər ˈsɜːpləs',
    example: 'Consumer surplus benefits buyers.',
    exampleTranslation: 'Thặng dư tiêu dùng có lợi cho người mua.',
    category: 'specialized-econ-micro',
    image: '🎁'
  },
  {
    word: 'Perfect Competition',
    meaning: 'Cạnh tranh hoàn hảo',
    pronunciation: 'ˈpɜːfɪkt kəmˈpɪtɪʃn',
    example: 'Perfect competition has many sellers.',
    exampleTranslation: 'Cạnh tranh hoàn hảo có nhiều người bán.',
    category: 'specialized-econ-micro',
    image: '🏪'
  },
  {
    word: 'Monopoly',
    meaning: 'Độc quyền',
    pronunciation: 'məˈnɒpəli',
    example: 'A monopoly controls the entire market.',
    exampleTranslation: 'Độc quyền kiểm soát toàn bộ thị trường.',
    category: 'specialized-econ-micro',
    image: '👑'
  },
  {
    word: 'Oligopoly',
    meaning: 'Cộng đồng độc quyền',
    pronunciation: 'ɒˈlɪɡəpəli',
    example: 'An oligopoly has few large firms.',
    exampleTranslation: 'Cộng đồng độc quyền có ít công ty lớn.',
    category: 'specialized-econ-micro',
    image: '🏢'
  },
  {
    word: 'Utility',
    meaning: 'Lợi ích',
    pronunciation: 'juːˈtɪləti',
    example: 'Utility measures consumer satisfaction.',
    exampleTranslation: 'Lợi ích đo lường sự hài lòng của người tiêu dùng.',
    category: 'specialized-econ-micro',
    image: '😊'
  },
  {
    word: 'Equilibrium',
    meaning: 'Cân bằng',
    pronunciation: 'ɪˈkwɪlɪbriəm',
    example: 'Market equilibrium occurs when supply equals demand.',
    exampleTranslation: 'Cân bằng thị trường xảy ra khi cung bằng cầu.',
    category: 'specialized-econ-micro',
    image: '⚖️'
  },

  // Chuyên ngành - Kinh tế - Thương mại
  {
    word: 'Import',
    meaning: 'Nhập khẩu',
    pronunciation: 'ˈɪmpɔːrt',
    example: 'The country imports oil from abroad.',
    exampleTranslation: 'Đất nước nhập khẩu dầu từ nước ngoài.',
    category: 'specialized-econ-trade',
    image: '📦'
  },
  {
    word: 'Export',
    meaning: 'Xuất khẩu',
    pronunciation: 'ˈekspɔːrt',
    example: 'The company exports goods worldwide.',
    exampleTranslation: 'Công ty xuất khẩu hàng hóa trên toàn thế giới.',
    category: 'specialized-econ-trade',
    image: '🚢'
  },
  {
    word: 'Tariff',
    meaning: 'Thuế quan',
    pronunciation: 'ˈtærɪf',
    example: 'The government imposed a tariff on imports.',
    exampleTranslation: 'Chính phủ áp dụng thuế quan đối với nhập khẩu.',
    category: 'specialized-econ-trade',
    image: '📋'
  },
  {
    word: 'Quota',
    meaning: 'Hạn ngạch',
    pronunciation: 'ˈkwoʊtə',
    example: 'The quota limits the amount of imports.',
    exampleTranslation: 'Hạn ngạch giới hạn lượng nhập khẩu.',
    category: 'specialized-econ-trade',
    image: '📊'
  },
  {
    word: 'Comparative Advantage',
    meaning: 'Lợi thế so sánh',
    pronunciation: 'kəmˈpærətɪv ədˈvɑːntɪdʒ',
    example: 'Countries benefit from comparative advantage.',
    exampleTranslation: 'Các quốc gia hưởng lợi từ lợi thế so sánh.',
    category: 'specialized-econ-trade',
    image: '🏆'
  },
  {
    word: 'Free Trade',
    meaning: 'Tự do thương mại',
    pronunciation: 'friː treɪd',
    example: 'Free trade promotes economic growth.',
    exampleTranslation: 'Tự do thương mại thúc đẩy tăng trưởng kinh tế.',
    category: 'specialized-econ-trade',
    image: '🌍'
  },
  {
    word: 'Protectionism',
    meaning: 'Chủ nghĩa bảo hộ',
    pronunciation: 'prəˈtekʃənɪzəm',
    example: 'Protectionism shields domestic industries.',
    exampleTranslation: 'Chủ nghĩa bảo hộ bảo vệ các ngành công nghiệp trong nước.',
    category: 'specialized-econ-trade',
    image: '🛡️'
  },
  {
    word: 'Balance of Trade',
    meaning: 'Cân đối thương mại',
    pronunciation: 'ˈbæləns əv treɪd',
    example: 'The balance of trade affects the economy.',
    exampleTranslation: 'Cân đối thương mại ảnh hưởng đến nền kinh tế.',
    category: 'specialized-econ-trade',
    image: '⚖️'
  },
  {
    word: 'Customs',
    meaning: 'Hải quan',
    pronunciation: 'ˈkʌstəmz',
    example: 'Customs inspects goods at the border.',
    exampleTranslation: 'Hải quan kiểm tra hàng hóa ở biên giới.',
    category: 'specialized-econ-trade',
    image: '🚪'
  },
  {
    word: 'Logistics',
    meaning: 'Hậu cần',
    pronunciation: 'ləˈdʒɪstɪks',
    example: 'Logistics manages the supply chain.',
    exampleTranslation: 'Hậu cần quản lý chuỗi cung ứng.',
    category: 'specialized-econ-trade',
    image: '📦'
  },

  // Chuyên ngành - Kinh tế - Tài chính
  {
    word: 'Stock Market',
    meaning: 'Thị trường chứng khoán',
    pronunciation: 'stɒk ˈmɑːrkɪt',
    example: 'The stock market rose today.',
    exampleTranslation: 'Thị trường chứng khoán tăng hôm nay.',
    category: 'specialized-econ-finance',
    image: '📈'
  },
  {
    word: 'Bond',
    meaning: 'Trái phiếu',
    pronunciation: 'bɒnd',
    example: 'Bonds provide fixed income.',
    exampleTranslation: 'Trái phiếu cung cấp thu nhập cố định.',
    category: 'specialized-econ-finance',
    image: '📄'
  },
  {
    word: 'Dividend',
    meaning: 'Cổ tức',
    pronunciation: 'ˈdɪvɪdend',
    example: 'Shareholders receive dividends.',
    exampleTranslation: 'Cổ đông nhận cổ tức.',
    category: 'specialized-econ-finance',
    image: '💵'
  },
  {
    word: 'Portfolio',
    meaning: 'Danh mục đầu tư',
    pronunciation: 'pɔːrˈfoʊlioʊ',
    example: 'A diversified portfolio reduces risk.',
    exampleTranslation: 'Danh mục đầu tư đa dạng giảm rủi ro.',
    category: 'specialized-econ-finance',
    image: '📊'
  },
  {
    word: 'Hedge Fund',
    meaning: 'Quỹ phòng hộ',
    pronunciation: 'hedʒ fʌnd',
    example: 'Hedge funds use complex strategies.',
    exampleTranslation: 'Quỹ phòng hộ sử dụng các chiến lược phức tạp.',
    category: 'specialized-econ-finance',
    image: '🎯'
  },
  {
    word: 'Credit Rating',
    meaning: 'Xếp hạng tín dụng',
    pronunciation: 'ˈkredɪt ˈreɪtɪŋ',
    example: 'A good credit rating lowers borrowing costs.',
    exampleTranslation: 'Xếp hạng tín dụng tốt giảm chi phí vay.',
    category: 'specialized-econ-finance',
    image: '⭐'
  },
  {
    word: 'Liquidity',
    meaning: 'Tính thanh khoản',
    pronunciation: 'lɪˈkwɪdɪti',
    example: 'Cash has high liquidity.',
    exampleTranslation: 'Tiền mặt có tính thanh khoản cao.',
    category: 'specialized-econ-finance',
    image: '💧'
  },
  {
    word: 'Leverage',
    meaning: 'Đòn bẩy tài chính',
    pronunciation: 'ˈlevərɪdʒ',
    example: 'Leverage amplifies investment returns.',
    exampleTranslation: 'Đòn bẩy tài chính khuếch đại lợi suất đầu tư.',
    category: 'specialized-econ-finance',
    image: '📈'
  },
  {
    word: 'Derivatives',
    meaning: 'Công cụ phái sinh',
    pronunciation: 'dɪˈrɪvətɪvz',
    example: 'Derivatives are used for hedging.',
    exampleTranslation: 'Công cụ phái sinh được sử dụng để phòng hộ.',
    category: 'specialized-econ-finance',
    image: '📊'
  },
  {
    word: 'Venture Capital',
    meaning: 'Vốn mạo hiểm',
    pronunciation: 'ˈventʃər ˈkæpɪtl',
    example: 'Venture capital funds startups.',
    exampleTranslation: 'Vốn mạo hiểm tài trợ cho các công ty khởi nghiệp.',
    category: 'specialized-econ-finance',
    image: '🚀'
  },

  // Chuyên ngành - Y tế - Giải phẫu
  {
    word: 'Anatomy',
    meaning: 'Giải phẫu học',
    pronunciation: 'əˈnætəmi',
    example: 'Anatomy is the study of body structure.',
    exampleTranslation: 'Giải phẫu học là nghiên cứu cấu trúc cơ thể.',
    category: 'specialized-med-anatomy',
    image: '🫀'
  },
  {
    word: 'Skeleton',
    meaning: 'Bộ xương',
    pronunciation: 'ˈskelɪtn',
    example: 'The skeleton supports the body.',
    exampleTranslation: 'Bộ xương hỗ trợ cơ thể.',
    category: 'specialized-med-anatomy',
    image: '🦴'
  },
  {
    word: 'Muscle',
    meaning: 'Cơ bắp',
    pronunciation: 'ˈmʌsl',
    example: 'Muscles contract to produce movement.',
    exampleTranslation: 'Cơ bắp co lại để tạo ra chuyển động.',
    category: 'specialized-med-anatomy',
    image: '💪'
  },
  {
    word: 'Organ',
    meaning: 'Cơ quan',
    pronunciation: 'ˈɔːrɡən',
    example: 'The heart is a vital organ.',
    exampleTranslation: 'Tim là một cơ quan quan trọng.',
    category: 'specialized-med-anatomy',
    image: '❤️'
  },
  {
    word: 'Nerve',
    meaning: 'Thần kinh',
    pronunciation: 'nɜːrv',
    example: 'Nerves transmit signals to the brain.',
    exampleTranslation: 'Thần kinh truyền tín hiệu đến não.',
    category: 'specialized-med-anatomy',
    image: '🧠'
  },
  {
    word: 'Tissue',
    meaning: 'Mô',
    pronunciation: 'ˈtɪʃuː',
    example: 'Tissue is made up of cells.',
    exampleTranslation: 'Mô được tạo thành từ các tế bào.',
    category: 'specialized-med-anatomy',
    image: '🔬'
  },
  {
    word: 'Vessel',
    meaning: 'Mạch máu',
    pronunciation: 'ˈvesl',
    example: 'Blood vessels carry blood throughout the body.',
    exampleTranslation: 'Mạch máu vận chuyển máu khắp cơ thể.',
    category: 'specialized-med-anatomy',
    image: '🩸'
  },
  {
    word: 'Gland',
    meaning: 'Tuyến',
    pronunciation: 'ɡlænd',
    example: 'Glands produce hormones.',
    exampleTranslation: 'Tuyến sản xuất hormone.',
    category: 'specialized-med-anatomy',
    image: '⚗️'
  },
  {
    word: 'Ligament',
    meaning: 'Dây chằng',
    pronunciation: 'ˈlɪɡəmənt',
    example: 'Ligaments connect bones together.',
    exampleTranslation: 'Dây chằng kết nối các xương lại với nhau.',
    category: 'specialized-med-anatomy',
    image: '🔗'
  },
  {
    word: 'Cartilage',
    meaning: 'Sụn',
    pronunciation: 'ˈkɑːrtɪlɪdʒ',
    example: 'Cartilage provides flexibility to joints.',
    exampleTranslation: 'Sụn cung cấp tính linh hoạt cho các khớp.',
    category: 'specialized-med-anatomy',
    image: '🦴'
  },

  // Chuyên ngành - Y tế - Dược học
  {
    word: 'Medication',
    meaning: 'Thuốc',
    pronunciation: 'ˌmedɪˈkeɪʃn',
    example: 'Medication helps treat diseases.',
    exampleTranslation: 'Thuốc giúp điều trị bệnh tật.',
    category: 'specialized-med-pharma',
    image: '💊'
  },
  {
    word: 'Dosage',
    meaning: 'Liều lượng',
    pronunciation: 'ˈdoʊsɪdʒ',
    example: 'The correct dosage is important.',
    exampleTranslation: 'Liều lượng chính xác rất quan trọng.',
    category: 'specialized-med-pharma',
    image: '⚖️'
  },
  {
    word: 'Prescription',
    meaning: 'Đơn thuốc',
    pronunciation: 'prɪˈskrɪpʃn',
    example: 'The doctor wrote a prescription.',
    exampleTranslation: 'Bác sĩ viết một đơn thuốc.',
    category: 'specialized-med-pharma',
    image: '📋'
  },
  {
    word: 'Side Effect',
    meaning: 'Tác dụng phụ',
    pronunciation: 'saɪd ɪˈfekt',
    example: 'Some medications have side effects.',
    exampleTranslation: 'Một số loại thuốc có tác dụng phụ.',
    category: 'specialized-med-pharma',
    image: '⚠️'
  },
  {
    word: 'Antibiotic',
    meaning: 'Kháng sinh',
    pronunciation: 'ˌæntɪbaɪˈɑːtɪk',
    example: 'Antibiotics fight bacterial infections.',
    exampleTranslation: 'Kháng sinh chống lại các nhiễm trùng do vi khuẩn.',
    category: 'specialized-med-pharma',
    image: '🦠'
  },
  {
    word: 'Vaccine',
    meaning: 'Vắc xin',
    pronunciation: 'vækˈsiːn',
    example: 'Vaccines prevent diseases.',
    exampleTranslation: 'Vắc xin ngăn ngừa bệnh tật.',
    category: 'specialized-med-pharma',
    image: '💉'
  },
  {
    word: 'Allergy',
    meaning: 'Dị ứng',
    pronunciation: 'ˈælɜːrdʒi',
    example: 'Some people have allergies to medications.',
    exampleTranslation: 'Một số người có dị ứng với thuốc.',
    category: 'specialized-med-pharma',
    image: '🤧'
  },
  {
    word: 'Toxin',
    meaning: 'Độc tố',
    pronunciation: 'ˈtɑːksɪn',
    example: 'Toxins can harm the body.',
    exampleTranslation: 'Độc tố có thể gây hại cho cơ thể.',
    category: 'specialized-med-pharma',
    image: '☠️'
  },
  {
    word: 'Hormone',
    meaning: 'Hormone',
    pronunciation: 'ˈhɔːrmoʊn',
    example: 'Hormones regulate body functions.',
    exampleTranslation: 'Hormone điều chỉnh các chức năng cơ thể.',
    category: 'specialized-med-pharma',
    image: '⚗️'
  },
  {
    word: 'Enzyme',
    meaning: 'Enzyme',
    pronunciation: 'ˈenzaɪm',
    example: 'Enzymes speed up chemical reactions.',
    exampleTranslation: 'Enzyme tăng tốc độ các phản ứng hóa học.',
    category: 'specialized-med-pharma',
    image: '🧬'
  },

  // Chuyên ngành - Y tế - Phẫu thuật
  {
    word: 'Surgery',
    meaning: 'Phẫu thuật',
    pronunciation: 'ˈsɜːrdʒəri',
    example: 'Surgery is a medical procedure.',
    exampleTranslation: 'Phẫu thuật là một thủ tục y tế.',
    category: 'specialized-med-surgery',
    image: '🔪'
  },
  {
    word: 'Surgeon',
    meaning: 'Bác sĩ phẫu thuật',
    pronunciation: 'ˈsɜːrdʒən',
    example: 'The surgeon performed the operation.',
    exampleTranslation: 'Bác sĩ phẫu thuật thực hiện ca phẫu thuật.',
    category: 'specialized-med-surgery',
    image: '👨‍⚕️'
  },
  {
    word: 'Anesthesia',
    meaning: 'Gây mê',
    pronunciation: 'ænəsˈθiːʒə',
    example: 'Anesthesia is used during surgery.',
    exampleTranslation: 'Gây mê được sử dụng trong phẫu thuật.',
    category: 'specialized-med-surgery',
    image: '💤'
  },
  {
    word: 'Incision',
    meaning: 'Vết mổ',
    pronunciation: 'ɪnˈsɪʒn',
    example: 'The surgeon made an incision.',
    exampleTranslation: 'Bác sĩ phẫu thuật tạo một vết mổ.',
    category: 'specialized-med-surgery',
    image: '🔴'
  },
  {
    word: 'Suture',
    meaning: 'Khâu',
    pronunciation: 'ˈsuːtʃər',
    example: 'Sutures close the wound.',
    exampleTranslation: 'Khâu đóng lại vết mổ.',
    category: 'specialized-med-surgery',
    image: '🧵'
  },
  {
    word: 'Transplant',
    meaning: 'Ghép',
    pronunciation: 'ˈtrænzplænt',
    example: 'A heart transplant saves lives.',
    exampleTranslation: 'Ghép tim cứu sống.',
    category: 'specialized-med-surgery',
    image: '❤️'
  },
  {
    word: 'Biopsy',
    meaning: 'Sinh thiết',
    pronunciation: 'ˈbaɪɑːpsi',
    example: 'A biopsy confirms the diagnosis.',
    exampleTranslation: 'Sinh thiết xác nhận chẩn đoán.',
    category: 'specialized-med-surgery',
    image: '🔬'
  },
  {
    word: 'Catheter',
    meaning: 'Ống thông',
    pronunciation: 'ˈkæθɪtər',
    example: 'A catheter is inserted into the vein.',
    exampleTranslation: 'Ống thông được đưa vào tĩnh mạch.',
    category: 'specialized-med-surgery',
    image: '💉'
  },
  {
    word: 'Prosthetic',
    meaning: 'Chân tay giả',
    pronunciation: 'prɑːsˈθetɪk',
    example: 'A prosthetic limb replaces a lost limb.',
    exampleTranslation: 'Chân tay giả thay thế chân tay bị mất.',
    category: 'specialized-med-surgery',
    image: '🦿'
  },
  {
    word: 'Rehabilitation',
    meaning: 'Phục hồi chức năng',
    pronunciation: 'ˌriːhəˌbɪlɪˈteɪʃn',
    example: 'Rehabilitation helps patients recover.',
    exampleTranslation: 'Phục hồi chức năng giúp bệnh nhân hồi phục.',
    category: 'specialized-med-surgery',
    image: '🏥'
  },

  // Chuyên ngành - Y tế - Điều dưỡng
  {
    word: 'Nurse',
    meaning: 'Y tá',
    pronunciation: 'nɜːrs',
    example: 'The nurse cares for patients.',
    exampleTranslation: 'Y tá chăm sóc bệnh nhân.',
    category: 'specialized-med-nursing',
    image: '👩‍⚕️'
  },
  {
    word: 'Patient',
    meaning: 'Bệnh nhân',
    pronunciation: 'ˈpeɪʃnt',
    example: 'The patient is recovering well.',
    exampleTranslation: 'Bệnh nhân đang hồi phục tốt.',
    category: 'specialized-med-nursing',
    image: '🏥'
  },
  {
    word: 'Vital Signs',
    meaning: 'Dấu hiệu sinh tồn',
    pronunciation: 'ˈvaɪtl saɪnz',
    example: 'Vital signs include heart rate and blood pressure.',
    exampleTranslation: 'Dấu hiệu sinh tồn bao gồm nhịp tim và huyết áp.',
    category: 'specialized-med-nursing',
    image: '❤️'
  },
  {
    word: 'Blood Pressure',
    meaning: 'Huyết áp',
    pronunciation: 'blʌd ˈpreʃər',
    example: 'Blood pressure is measured in mmHg.',
    exampleTranslation: 'Huyết áp được đo bằng mmHg.',
    category: 'specialized-med-nursing',
    image: '📊'
  },
  {
    word: 'Temperature',
    meaning: 'Nhiệt độ',
    pronunciation: 'ˈtemprətʃər',
    example: 'The patient\'s temperature is normal.',
    exampleTranslation: 'Nhiệt độ của bệnh nhân bình thường.',
    category: 'specialized-med-nursing',
    image: '🌡️'
  },
  {
    word: 'Pulse',
    meaning: 'Mạch',
    pronunciation: 'pʌls',
    example: 'The nurse checks the patient\'s pulse.',
    exampleTranslation: 'Y tá kiểm tra mạch của bệnh nhân.',
    category: 'specialized-med-nursing',
    image: '💓'
  },
  {
    word: 'Hygiene',
    meaning: 'Vệ sinh',
    pronunciation: 'ˈhaɪdʒiːn',
    example: 'Good hygiene prevents infections.',
    exampleTranslation: 'Vệ sinh tốt ngăn ngừa nhiễm trùng.',
    category: 'specialized-med-nursing',
    image: '🧼'
  },
  {
    word: 'Bedside',
    meaning: 'Bên giường bệnh',
    pronunciation: 'ˈbedˌsaɪd',
    example: 'The nurse stays at the patient\'s bedside.',
    exampleTranslation: 'Y tá ở bên giường bệnh của bệnh nhân.',
    category: 'specialized-med-nursing',
    image: '🛏️'
  },
  {
    word: 'Wound Care',
    meaning: 'Chăm sóc vết mổ',
    pronunciation: 'wuːnd keər',
    example: 'Wound care is important for healing.',
    exampleTranslation: 'Chăm sóc vết mổ rất quan trọng để lành.',
    category: 'specialized-med-nursing',
    image: '🩹'
  },
  {
    word: 'Comfort',
    meaning: 'Thoải mái',
    pronunciation: 'ˈkʌmfərt',
    example: 'The nurse ensures patient comfort.',
    exampleTranslation: 'Y tá đảm bảo sự thoải mái của bệnh nhân.',
    category: 'specialized-med-nursing',
    image: '😊'
  },

  // Chuyên ngành - Giáo dục - Sư phạm
  {
    word: 'Pedagogy',
    meaning: 'Sư phạm',
    pronunciation: 'ˈpedəɡɑːdʒi',
    example: 'Pedagogy is the art of teaching.',
    exampleTranslation: 'Sư phạm là nghệ thuật giảng dạy.',
    category: 'specialized-edu-pedagogy',
    image: '📚'
  },
  {
    word: 'Curriculum',
    meaning: 'Chương trình học',
    pronunciation: 'kəˈrɪkjələm',
    example: 'The curriculum includes various subjects.',
    exampleTranslation: 'Chương trình học bao gồm nhiều môn học.',
    category: 'specialized-edu-pedagogy',
    image: '📖'
  },
  {
    word: 'Instruction',
    meaning: 'Hướng dẫn',
    pronunciation: 'ɪnˈstrʌkʃn',
    example: 'Good instruction improves learning.',
    exampleTranslation: 'Hướng dẫn tốt cải thiện học tập.',
    category: 'specialized-edu-pedagogy',
    image: '👨‍🏫'
  },
  {
    word: 'Classroom',
    meaning: 'Lớp học',
    pronunciation: 'ˈklæsruːm',
    example: 'The classroom is well-equipped.',
    exampleTranslation: 'Lớp học được trang bị tốt.',
    category: 'specialized-edu-pedagogy',
    image: '🏫'
  },
  {
    word: 'Lecture',
    meaning: 'Bài giảng',
    pronunciation: 'ˈlektʃər',
    example: 'The lecture was informative.',
    exampleTranslation: 'Bài giảng rất thông tin.',
    category: 'specialized-edu-pedagogy',
    image: '🎤'
  },
  {
    word: 'Seminar',
    meaning: 'Hội thảo',
    pronunciation: 'ˈsemɪnɑːr',
    example: 'The seminar discussed new teaching methods.',
    exampleTranslation: 'Hội thảo thảo luận các phương pháp giảng dạy mới.',
    category: 'specialized-edu-pedagogy',
    image: '👥'
  },
  {
    word: 'Workshop',
    meaning: 'Hội thảo thực hành',
    pronunciation: 'ˈwɜːrkʃɑːp',
    example: 'The workshop provided practical skills.',
    exampleTranslation: 'Hội thảo thực hành cung cấp kỹ năng thực tế.',
    category: 'specialized-edu-pedagogy',
    image: '🛠️'
  },
  {
    word: 'Textbook',
    meaning: 'Sách giáo khoa',
    pronunciation: 'ˈtekstbʊk',
    example: 'The textbook covers all topics.',
    exampleTranslation: 'Sách giáo khoa bao gồm tất cả các chủ đề.',
    category: 'specialized-edu-pedagogy',
    image: '📕'
  },
  {
    word: 'Assignment',
    meaning: 'Bài tập',
    pronunciation: 'əˈsaɪnmənt',
    example: 'The assignment is due next week.',
    exampleTranslation: 'Bài tập phải nộp tuần tới.',
    category: 'specialized-edu-pedagogy',
    image: '✏️'
  },
  {
    word: 'Grading',
    meaning: 'Chấm điểm',
    pronunciation: 'ˈɡreɪdɪŋ',
    example: 'Grading is based on performance.',
    exampleTranslation: 'Chấm điểm dựa trên hiệu suất.',
    category: 'specialized-edu-pedagogy',
    image: '📊'
  },

  // Chuyên ngành - Giáo dục - Tâm lý học
  {
    word: 'Psychology',
    meaning: 'Tâm lý học',
    pronunciation: 'saɪˈkɑːlədʒi',
    example: 'Psychology studies human behavior.',
    exampleTranslation: 'Tâm lý học nghiên cứu hành vi con người.',
    category: 'specialized-edu-psychology',
    image: '🧠'
  },
  {
    word: 'Cognition',
    meaning: 'Nhận thức',
    pronunciation: 'kɑːɡˈnɪʃn',
    example: 'Cognition involves thinking and learning.',
    exampleTranslation: 'Nhận thức liên quan đến tư duy và học tập.',
    category: 'specialized-edu-psychology',
    image: '💭'
  },
  {
    word: 'Motivation',
    meaning: 'Động lực',
    pronunciation: 'ˌmoʊtɪˈveɪʃn',
    example: 'Motivation is key to success.',
    exampleTranslation: 'Động lực là chìa khóa thành công.',
    category: 'specialized-edu-psychology',
    image: '🎯'
  },
  {
    word: 'Behavior',
    meaning: 'Hành vi',
    pronunciation: 'bɪˈheɪvjər',
    example: 'Behavior can be modified through training.',
    exampleTranslation: 'Hành vi có thể được sửa đổi thông qua đào tạo.',
    category: 'specialized-edu-psychology',
    image: '🚶'
  },
  {
    word: 'Emotion',
    meaning: 'Cảm xúc',
    pronunciation: 'ɪˈmoʊʃn',
    example: 'Emotions affect learning.',
    exampleTranslation: 'Cảm xúc ảnh hưởng đến học tập.',
    category: 'specialized-edu-psychology',
    image: '😊'
  },
  {
    word: 'Memory',
    meaning: 'Trí nhớ',
    pronunciation: 'ˈmeməri',
    example: 'Memory is essential for learning.',
    exampleTranslation: 'Trí nhớ rất cần thiết cho học tập.',
    category: 'specialized-edu-psychology',
    image: '🧠'
  },
  {
    word: 'Attention',
    meaning: 'Chú ý',
    pronunciation: 'əˈtenʃn',
    example: 'Attention is necessary for concentration.',
    exampleTranslation: 'Chú ý là cần thiết để tập trung.',
    category: 'specialized-edu-psychology',
    image: '👀'
  },
  {
    word: 'Perception',
    meaning: 'Nhận thức',
    pronunciation: 'pərˈsepʃn',
    example: 'Perception shapes our understanding.',
    exampleTranslation: 'Nhận thức định hình sự hiểu biết của chúng ta.',
    category: 'specialized-edu-psychology',
    image: '👁️'
  },
  {
    word: 'Development',
    meaning: 'Phát triển',
    pronunciation: 'dɪˈveləpmənt',
    example: 'Child development is important.',
    exampleTranslation: 'Phát triển trẻ em rất quan trọng.',
    category: 'specialized-edu-psychology',
    image: '👶'
  },
  {
    word: 'Counseling',
    meaning: 'Tư vấn',
    pronunciation: 'ˈkaʊnsəlɪŋ',
    example: 'Counseling helps students with problems.',
    exampleTranslation: 'Tư vấn giúp học sinh giải quyết vấn đề.',
    category: 'specialized-edu-psychology',
    image: '💬'
  },

  // Chuyên ngành - Kỹ thuật - Xây dựng
  {
    word: 'Construction',
    meaning: 'Xây dựng',
    pronunciation: 'kənˈstrʌkʃn',
    example: 'Construction requires careful planning.',
    exampleTranslation: 'Xây dựng đòi hỏi lập kế hoạch cẩn thận.',
    category: 'specialized-eng-civil',
    image: '🏗️'
  },
  {
    word: 'Foundation',
    meaning: 'Nền móng',
    pronunciation: 'faʊnˈdeɪʃn',
    example: 'A strong foundation is essential.',
    exampleTranslation: 'Nền móng vững chắc là cần thiết.',
    category: 'specialized-eng-civil',
    image: '🏢'
  },
  {
    word: 'Blueprint',
    meaning: 'Bản vẽ',
    pronunciation: 'ˈbluːprɪnt',
    example: 'The blueprint shows the design.',
    exampleTranslation: 'Bản vẽ hiển thị thiết kế.',
    category: 'specialized-eng-civil',
    image: '📐'
  },
  {
    word: 'Concrete',
    meaning: 'Bê tông',
    pronunciation: 'ˈkɑːnkriːt',
    example: 'Concrete is a durable material.',
    exampleTranslation: 'Bê tông là một vật liệu bền.',
    category: 'specialized-eng-civil',
    image: '🧱'
  },
  {
    word: 'Steel',
    meaning: 'Thép',
    pronunciation: 'stiːl',
    example: 'Steel is used in construction.',
    exampleTranslation: 'Thép được sử dụng trong xây dựng.',
    category: 'specialized-eng-civil',
    image: '⚙️'
  },
  {
    word: 'Bridge',
    meaning: 'Cầu',
    pronunciation: 'brɪdʒ',
    example: 'The bridge spans the river.',
    exampleTranslation: 'Cầu bắc qua sông.',
    category: 'specialized-eng-civil',
    image: '🌉'
  },
  {
    word: 'Beam',
    meaning: 'Dầm',
    pronunciation: 'biːm',
    example: 'Beams support the structure.',
    exampleTranslation: 'Dầm hỗ trợ cấu trúc.',
    category: 'specialized-eng-civil',
    image: '📏'
  },
  {
    word: 'Excavation',
    meaning: 'Đào đất',
    pronunciation: 'ˌeksəˈveɪʃn',
    example: 'Excavation is the first step.',
    exampleTranslation: 'Đào đất là bước đầu tiên.',
    category: 'specialized-eng-civil',
    image: '🚜'
  },
  {
    word: 'Surveying',
    meaning: 'Khảo sát',
    pronunciation: 'ˈsɜːrveɪɪŋ',
    example: 'Surveying determines the land boundaries.',
    exampleTranslation: 'Khảo sát xác định ranh giới đất đai.',
    category: 'specialized-eng-civil',
    image: '📍'
  },
  {
    word: 'Infrastructure',
    meaning: 'Cơ sở hạ tầng',
    pronunciation: 'ˈɪnfrəstrʌktʃər',
    example: 'Infrastructure is vital for development.',
    exampleTranslation: 'Cơ sở hạ tầng rất quan trọng cho phát triển.',
    category: 'specialized-eng-civil',
    image: '🛣️'
  },

  // Chuyên ngành - Kỹ thuật - Cơ khí
  {
    word: 'Mechanical',
    meaning: 'Cơ khí',
    pronunciation: 'məˈkænɪkl',
    example: 'Mechanical engineering designs machines.',
    exampleTranslation: 'Kỹ thuật cơ khí thiết kế máy móc.',
    category: 'specialized-eng-mechanical',
    image: '⚙️'
  },
  {
    word: 'Engine',
    meaning: 'Động cơ',
    pronunciation: 'ˈendʒɪn',
    example: 'The engine powers the vehicle.',
    exampleTranslation: 'Động cơ cung cấp năng lượng cho phương tiện.',
    category: 'specialized-eng-mechanical',
    image: '🚗'
  },
  {
    word: 'Turbine',
    meaning: 'Tuabin',
    pronunciation: 'ˈtɜːrbaɪn',
    example: 'Turbines generate electricity.',
    exampleTranslation: 'Tuabin phát điện.',
    category: 'specialized-eng-mechanical',
    image: '💨'
  },
  {
    word: 'Friction',
    meaning: 'Ma sát',
    pronunciation: 'ˈfrɪkʃn',
    example: 'Friction reduces efficiency.',
    exampleTranslation: 'Ma sát giảm hiệu suất.',
    category: 'specialized-eng-mechanical',
    image: '🔥'
  },
  {
    word: 'Lubrication',
    meaning: 'Bôi trơn',
    pronunciation: 'ˌluːbrɪˈkeɪʃn',
    example: 'Lubrication reduces wear.',
    exampleTranslation: 'Bôi trơn giảm mài mòn.',
    category: 'specialized-eng-mechanical',
    image: '🛢️'
  },
  {
    word: 'Transmission',
    meaning: 'Hộp số',
    pronunciation: 'trænzˈmɪʃn',
    example: 'The transmission transfers power.',
    exampleTranslation: 'Hộp số truyền tải năng lượng.',
    category: 'specialized-eng-mechanical',
    image: '⚙️'
  },
  {
    word: 'Bearing',
    meaning: 'Vòng bi',
    pronunciation: 'ˈberɪŋ',
    example: 'Bearings reduce friction.',
    exampleTranslation: 'Vòng bi giảm ma sát.',
    category: 'specialized-eng-mechanical',
    image: '⭕'
  },
  {
    word: 'Hydraulic',
    meaning: 'Thủy lực',
    pronunciation: 'haɪˈdrɔːlɪk',
    example: 'Hydraulic systems use fluid pressure.',
    exampleTranslation: 'Hệ thống thủy lực sử dụng áp suất chất lỏng.',
    category: 'specialized-eng-mechanical',
    image: '💧'
  },
  {
    word: 'Pneumatic',
    meaning: 'Khí nén',
    pronunciation: 'nuːˈmætɪk',
    example: 'Pneumatic tools use compressed air.',
    exampleTranslation: 'Công cụ khí nén sử dụng không khí nén.',
    category: 'specialized-eng-mechanical',
    image: '💨'
  },
  {
    word: 'Vibration',
    meaning: 'Rung động',
    pronunciation: 'vaɪˈbreɪʃn',
    example: 'Vibration can damage equipment.',
    exampleTranslation: 'Rung động có thể làm hỏng thiết bị.',
    category: 'specialized-eng-mechanical',
    image: '📳'
  },

  // Chuyên ngành - Kỹ thuật - Điện
  {
    word: 'Electrical',
    meaning: 'Điện',
    pronunciation: 'ɪˈlektrɪkl',
    example: 'Electrical engineering deals with electricity.',
    exampleTranslation: 'Kỹ thuật điện xử lý điện.',
    category: 'specialized-eng-electrical',
    image: '⚡'
  },
  {
    word: 'Circuit',
    meaning: 'Mạch điện',
    pronunciation: 'ˈsɜːrkɪt',
    example: 'A circuit completes the electrical path.',
    exampleTranslation: 'Mạch điện hoàn thành đường dẫn điện.',
    category: 'specialized-eng-electrical',
    image: '🔌'
  },
  {
    word: 'Voltage',
    meaning: 'Điện áp',
    pronunciation: 'ˈvoʊltɪdʒ',
    example: 'Voltage is measured in volts.',
    exampleTranslation: 'Điện áp được đo bằng vôn.',
    category: 'specialized-eng-electrical',
    image: '⚡'
  },
  {
    word: 'Current',
    meaning: 'Dòng điện',
    pronunciation: 'ˈkɜːrənt',
    example: 'Current flows through the circuit.',
    exampleTranslation: 'Dòng điện chảy qua mạch.',
    category: 'specialized-eng-electrical',
    image: '⚡'
  },
  {
    word: 'Resistance',
    meaning: 'Điện trở',
    pronunciation: 'rɪˈzɪstəns',
    example: 'Resistance opposes current flow.',
    exampleTranslation: 'Điện trở chống lại dòng điện.',
    category: 'specialized-eng-electrical',
    image: '🔌'
  },
  {
    word: 'Transformer',
    meaning: 'Máy biến áp',
    pronunciation: 'trænzˈfɔːrmər',
    example: 'A transformer changes voltage levels.',
    exampleTranslation: 'Máy biến áp thay đổi mức điện áp.',
    category: 'specialized-eng-electrical',
    image: '⚙️'
  },
  {
    word: 'Generator',
    meaning: 'Máy phát điện',
    pronunciation: 'ˈdʒenəreɪtər',
    example: 'A generator produces electricity.',
    exampleTranslation: 'Máy phát điện sản xuất điện.',
    category: 'specialized-eng-electrical',
    image: '⚡'
  },
  {
    word: 'Motor',
    meaning: 'Động cơ điện',
    pronunciation: 'ˈmoʊtər',
    example: 'An electric motor converts electricity to motion.',
    exampleTranslation: 'Động cơ điện chuyển đổi điện thành chuyển động.',
    category: 'specialized-eng-electrical',
    image: '⚙️'
  },
  {
    word: 'Conductor',
    meaning: 'Dây dẫn',
    pronunciation: 'kənˈdʌktər',
    example: 'Copper is a good conductor.',
    exampleTranslation: 'Đồng là một dây dẫn tốt.',
    category: 'specialized-eng-electrical',
    image: '🔌'
  },
  {
    word: 'Insulator',
    meaning: 'Chất cách điện',
    pronunciation: 'ˈɪnsuːleɪtər',
    example: 'Rubber is a good insulator.',
    exampleTranslation: 'Cao su là một chất cách điện tốt.',
    category: 'specialized-eng-electrical',
    image: '🔌'
  }
];

async function seedFlashcards() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Xóa dữ liệu cũ (tùy chọn)
    await Flashcard.deleteMany({});
    console.log('🗑️  Cleared old flashcards');

    // Thêm flashcards mới
    await Flashcard.insertMany(flashcardsData);
    console.log(`✅ Added ${flashcardsData.length} flashcards successfully!`);

    console.log('\n📊 Summary:');
    console.log('🔵 Cấp độ Cơ bản:');
    console.log('  - Màu sắc: 13 từ');
    console.log('  - Số đếm: 10 từ');
    console.log('  - Gia đình: 8 từ');
    console.log('  - Con vật: 10 từ');
    console.log('🟢 Cấp độ Trung cấp:');
    console.log('  - Công việc: 10 từ');
    console.log('  - Thời tiết: 10 từ');
    console.log('  - Thức ăn: 10 từ');
    console.log('  - Du lịch: 10 từ');
    console.log('🟣 Cấp độ Nâng cao:');
    console.log('  - Kinh doanh: 10 từ');
    console.log('  - Công nghệ: 10 từ');
    console.log('  - Khoa học: 10 từ');
    console.log('  - Văn học: 10 từ');
    console.log('🟠 Cấp độ Giao tiếp:');
    console.log('  - Hàng ngày: 10 từ');
    console.log('  - Nơi làm việc: 10 từ');
    console.log('  - Xã hội: 10 từ');
    console.log('  - Điện thoại: 10 từ');
    console.log('🔴 Cấp độ Chuyên ngành - Công nghệ thông tin:');
    console.log('  - Phần mềm: 10 từ');
    console.log('  - Phần cứng: 10 từ');
    console.log('  - Mạng: 10 từ');
    console.log('  - Bảo mật: 10 từ');
    console.log('🟠 Cấp độ Chuyên ngành - Kinh tế:');
    console.log('  - Kinh tế vĩ mô: 10 từ');
    console.log('  - Kinh tế vi mô: 10 từ');
    console.log('  - Thương mại: 10 từ');
    console.log('  - Tài chính: 10 từ');
    console.log('🔵 Cấp độ Chuyên ngành - Y tế:');
    console.log('  - Giải phẫu: 10 từ');
    console.log('  - Dược học: 10 từ');
    console.log('  - Phẫu thuật: 10 từ');
    console.log('  - Điều dưỡng: 10 từ');
    console.log('🟣 Cấp độ Chuyên ngành - Giáo dục:');
    console.log('  - Sư phạm: 10 từ');
    console.log('  - Tâm lý học: 10 từ');
    console.log('🟢 Cấp độ Chuyên ngành - Kỹ thuật:');
    console.log('  - Xây dựng: 10 từ');
    console.log('  - Cơ khí: 10 từ');
    console.log('  - Điện: 10 từ');
    console.log('Total: 481 flashcards\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedFlashcards();
