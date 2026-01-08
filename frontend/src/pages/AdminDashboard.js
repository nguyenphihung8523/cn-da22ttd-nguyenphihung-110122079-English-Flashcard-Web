import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { NavigationContext } from '../context/NavigationContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { setPageState } = useContext(NavigationContext);
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [speakingContent, setSpeakingContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showSpeakingModal, setShowSpeakingModal] = useState(false);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterTopic, setFilterTopic] = useState('all');
  
  // States for drill-down: Level -> Topic -> Flashcards
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [levelTopics, setLevelTopics] = useState([]);
  const [topicFlashcards, setTopicFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});

  // States for Speaking drill-down
  const [selectedSpeakingLevel, setSelectedSpeakingLevel] = useState(null);
  const [selectedSpeakingTopic, setSelectedSpeakingTopic] = useState(null);
  const [speakingTopics, setSpeakingTopics] = useState([]);
  const [speakingItems, setSpeakingItems] = useState([]);

  // Speaking levels and topics data (matching user page)
  const speakingLevelsList = [
    { id: 'basic', name: 'Cơ bản', icon: '🌱' },
    { id: 'conversation', name: 'Giao tiếp', icon: '💬' },
    { id: 'paragraph', name: 'Đoạn văn', icon: '📝' }
  ];
  const speakingTopicsData = {
    'basic': [
      { id: 'animals', name: 'Động vật', icon: '🐾', count: 8 },
      { id: 'fruits', name: 'Trái cây', icon: '🍎', count: 8 },
      { id: 'colors', name: 'Màu sắc', icon: '🎨', count: 8 },
      { id: 'family', name: 'Gia đình', icon: '👨‍👩‍👧‍👦', count: 8 }
    ],
    'conversation': [
      { id: 'daily', name: 'Hàng ngày', icon: '☀️', count: 8 },
      { id: 'shopping', name: 'Mua sắm', icon: '🛒', count: 8 },
      { id: 'restaurant', name: 'Nhà hàng', icon: '🍽️', count: 8 },
      { id: 'travel', name: 'Du lịch', icon: '✈️', count: 8 }
    ],
    'paragraph': [
      { id: 'phone', name: 'Điện thoại', icon: '📞', count: 8 },
      { id: 'business', name: 'Kinh doanh', icon: '💼', count: 8 },
      { id: 'technology', name: 'Công nghệ', icon: '💻', count: 8 }
    ]
  };

  // Speaking items data (matching user page)
  const speakingItemsData = {
    'basic': {
      'animals': [
        { id: 1, text: 'Cat', meaning: 'Con mèo' },
        { id: 2, text: 'Dog', meaning: 'Con chó' },
        { id: 3, text: 'Bird', meaning: 'Con chim' },
        { id: 4, text: 'Fish', meaning: 'Con cá' },
        { id: 5, text: 'Rabbit', meaning: 'Con thỏ' },
        { id: 6, text: 'Horse', meaning: 'Con ngựa' },
        { id: 7, text: 'Elephant', meaning: 'Con voi' },
        { id: 8, text: 'Lion', meaning: 'Sư tử' }
      ],
      'fruits': [
        { id: 1, text: 'Apple', meaning: 'Quả táo' },
        { id: 2, text: 'Banana', meaning: 'Quả chuối' },
        { id: 3, text: 'Orange', meaning: 'Quả cam' },
        { id: 4, text: 'Strawberry', meaning: 'Quả dâu' },
        { id: 5, text: 'Grape', meaning: 'Quả nho' },
        { id: 6, text: 'Watermelon', meaning: 'Quả dưa hấu' },
        { id: 7, text: 'Mango', meaning: 'Quả xoài' },
        { id: 8, text: 'Pineapple', meaning: 'Quả dứa' }
      ],
      'colors': [
        { id: 1, text: 'Red', meaning: 'Màu đỏ' },
        { id: 2, text: 'Blue', meaning: 'Màu xanh dương' },
        { id: 3, text: 'Green', meaning: 'Màu xanh lá' },
        { id: 4, text: 'Yellow', meaning: 'Màu vàng' },
        { id: 5, text: 'Black', meaning: 'Màu đen' },
        { id: 6, text: 'White', meaning: 'Màu trắng' },
        { id: 7, text: 'Purple', meaning: 'Màu tím' },
        { id: 8, text: 'Pink', meaning: 'Màu hồng' }
      ],
      'family': [
        { id: 1, text: 'Mother', meaning: 'Mẹ' },
        { id: 2, text: 'Father', meaning: 'Bố' },
        { id: 3, text: 'Sister', meaning: 'Chị/Em gái' },
        { id: 4, text: 'Brother', meaning: 'Anh/Em trai' },
        { id: 5, text: 'Grandmother', meaning: 'Bà' },
        { id: 6, text: 'Grandfather', meaning: 'Ông' },
        { id: 7, text: 'Aunt', meaning: 'Cô/Dì' },
        { id: 8, text: 'Uncle', meaning: 'Chú/Bác' }
      ]
    },
    'conversation': {
      'daily': [
        { id: 1, text: 'Good morning. How are you today?', meaning: 'Chào buổi sáng. Hôm nay bạn khỏe không?' },
        { id: 2, text: 'What time is it?', meaning: 'Mấy giờ rồi?' },
        { id: 3, text: 'Have a nice day!', meaning: 'Chúc bạn một ngày tốt lành!' },
        { id: 4, text: 'See you later.', meaning: 'Hẹn gặp lại.' },
        { id: 5, text: 'How was your weekend?', meaning: 'Cuối tuần của bạn thế nào?' },
        { id: 6, text: 'What are you doing?', meaning: 'Bạn đang làm gì?' },
        { id: 7, text: 'Nice to meet you.', meaning: 'Rất vui được gặp bạn.' },
        { id: 8, text: 'Thank you very much.', meaning: 'Cảm ơn bạn rất nhiều.' }
      ],
      'shopping': [
        { id: 1, text: 'How much is this?', meaning: 'Cái này giá bao nhiêu?' },
        { id: 2, text: 'Do you have this in another size?', meaning: 'Bạn có size khác không?' },
        { id: 3, text: 'Can I try this on?', meaning: 'Tôi có thể thử không?' },
        { id: 4, text: 'Where is the fitting room?', meaning: 'Phòng thử đồ ở đâu?' },
        { id: 5, text: 'I would like to pay.', meaning: 'Tôi muốn thanh toán.' },
        { id: 6, text: 'Do you accept credit cards?', meaning: 'Bạn có chấp nhận thẻ tín dụng không?' },
        { id: 7, text: 'Can I get a receipt?', meaning: 'Tôi có thể lấy hóa đơn không?' },
        { id: 8, text: 'Thank you for your help.', meaning: 'Cảm ơn bạn đã giúp đỡ.' }
      ],
      'restaurant': [
        { id: 1, text: 'A table for two, please.', meaning: 'Một bàn cho hai người.' },
        { id: 2, text: 'What do you recommend?', meaning: 'Bạn khuyên gì?' },
        { id: 3, text: 'I would like to order.', meaning: 'Tôi muốn gọi món.' },
        { id: 4, text: 'Can I have the menu?', meaning: 'Tôi có thể lấy thực đơn không?' },
        { id: 5, text: 'Is this spicy?', meaning: 'Cái này có cay không?' },
        { id: 6, text: 'Can I have the bill?', meaning: 'Tôi có thể lấy hóa đơn không?' },
        { id: 7, text: 'The food is delicious!', meaning: 'Món ăn ngon quá!' },
        { id: 8, text: 'Thank you for the meal.', meaning: 'Cảm ơn bữa ăn ngon lành.' }
      ],
      'travel': [
        { id: 1, text: 'Where is the train station?', meaning: 'Ga tàu ở đâu?' },
        { id: 2, text: 'How do I get to the airport?', meaning: 'Làm thế nào để đến sân bay?' },
        { id: 3, text: 'Can you help me with directions?', meaning: 'Bạn có thể giúp tôi chỉ đường không?' },
        { id: 4, text: 'How much is a ticket?', meaning: 'Vé giá bao nhiêu?' },
        { id: 5, text: 'What time does the bus leave?', meaning: 'Xe buýt khởi hành lúc mấy giờ?' },
        { id: 6, text: 'Is this the right way?', meaning: 'Đây có phải là đường đúng không?' },
        { id: 7, text: 'Can you recommend a hotel?', meaning: 'Bạn có thể giới thiệu khách sạn không?' },
        { id: 8, text: 'Thank you for your help.', meaning: 'Cảm ơn bạn đã giúp đỡ.' }
      ]
    },
    'paragraph': {
      'phone': [
        { id: 1, text: 'The telephone has revolutionized communication across the world.', meaning: 'Điện thoại đã cách mạng hóa giao tiếp trên toàn thế giới.' },
        { id: 2, text: 'Mobile phones have become an essential part of modern life.', meaning: 'Điện thoại di động đã trở thành một phần thiết yếu của cuộc sống hiện đại.' },
        { id: 3, text: 'Video calling technology has changed how families stay connected.', meaning: 'Công nghệ gọi video đã thay đổi cách các gia đình kết nối với nhau.' },
        { id: 4, text: 'The history of telecommunications spans over a century.', meaning: 'Lịch sử viễn thông kéo dài hơn một thế kỷ.' }
      ],
      'business': [
        { id: 1, text: 'Business communication is the foundation of successful organizations.', meaning: 'Giao tiếp kinh doanh là nền tảng của các tổ chức thành công.' },
        { id: 2, text: 'Corporate meetings are essential for decision making and strategic planning.', meaning: 'Các cuộc họp công ty là thiết yếu để ra quyết định và lập kế hoạch chiến lược.' },
        { id: 3, text: 'Professional presentations require careful preparation and clear communication.', meaning: 'Các bài thuyết trình chuyên nghiệp đòi hỏi chuẩn bị cẩn thận và giao tiếp rõ ràng.' },
        { id: 4, text: 'Leadership in business requires strong communication skills.', meaning: 'Lãnh đạo trong kinh doanh đòi hỏi kỹ năng giao tiếp mạnh mẽ.' }
      ],
      'technology': [
        { id: 1, text: 'Artificial intelligence is transforming industries and changing how we work.', meaning: 'Trí tuệ nhân tạo đang chuyển đổi các ngành công nghiệp và thay đổi cách chúng ta làm việc.' },
        { id: 2, text: 'Cloud computing has revolutionized data storage and accessibility.', meaning: 'Điện toán đám mây đã cách mạng hóa lưu trữ và khả năng truy cập dữ liệu.' },
        { id: 3, text: 'Cybersecurity is increasingly important as digital threats continue to evolve.', meaning: 'An ninh mạng ngày càng trở nên quan trọng khi các mối đe dọa kỹ thuật số tiếp tục phát triển.' },
        { id: 4, text: 'The Internet of Things connects billions of devices worldwide.', meaning: 'Internet of Things kết nối hàng tỷ thiết bị trên toàn thế giới.' }
      ]
    }
  };

  const handleSelectSpeakingLevel = (level) => {
    setSelectedSpeakingLevel(level);
    setSelectedSpeakingTopic(null);
    setSpeakingTopics(speakingTopicsData[level.id] || []);
    setSpeakingItems([]);
  };

  const handleSelectSpeakingTopic = (topic) => {
    setSelectedSpeakingTopic(topic);
    // Load speaking items from data
    const levelId = selectedSpeakingLevel.id;
    const topicId = topic.id;
    const items = speakingItemsData[levelId]?.[topicId] || [];
    setSpeakingItems(items);
  };

  const handleBackToSpeakingLevels = () => {
    setSelectedSpeakingLevel(null);
    setSelectedSpeakingTopic(null);
    setSpeakingTopics([]);
    setSpeakingItems([]);
  };

  const handleBackToSpeakingTopics = () => {
    setSelectedSpeakingTopic(null);
    setSpeakingItems([]);
  };

  // Toggle flip card
  const toggleFlipCard = (cardId) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Levels list
  const levelsList = ['Cơ bản', 'Trung cấp', 'Nâng cao', 'Giao tiếp', 'Chuyên ngành'];

  const handleSelectLevel = async (level) => {
    setSelectedLevel(level);
    setSelectedTopic(null);
    setTopicFlashcards([]);
    
    // Load topics for this level from API
    try {
      setLoading(true);
      const response = await API.get('/flashcards', { params: { level } });
      if (response.data) {
        // Group by topic and count
        const topicCounts = {};
        response.data.forEach(card => {
          if (card.topic) {
            topicCounts[card.topic] = (topicCounts[card.topic] || 0) + 1;
          }
        });
        const topics = Object.entries(topicCounts).map(([name, count]) => ({ name, count }));
        setLevelTopics(topics);
      }
    } catch (error) {
      console.error('Lỗi tải topics:', error);
      setLevelTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = async (topic) => {
    setSelectedTopic(topic);
    // Load flashcards for this topic from API
    try {
      setLoading(true);
      const response = await API.get('/flashcards', {
        params: { level: selectedLevel, topic: topic.name }
      });
      if (response.data) {
        setTopicFlashcards(response.data);
      }
    } catch (error) {
      console.error('Lỗi tải flashcards:', error);
      setTopicFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setSelectedTopic(null);
    setLevelTopics([]);
    setTopicFlashcards([]);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setTopicFlashcards([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    setPageState('admin', '/admin');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setAdminInfo(user);
    }
    loadUsers();
  }, [setPageState]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Lỗi tải thống kê:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('📡 Calling API: /admin/users');
      const response = await API.get('/admin/users');
      console.log('📦 Full response:', response);
      console.log('📊 Response data:', response.data);
      console.log('✅ Success flag:', response.data.success);
      console.log('👥 Users array:', response.data.users);
      
      if (response.data.success) {
        console.log('✅ Setting users:', response.data.users.length, 'users');
        setUsers(response.data.users);
      } else {
        console.error('❌ API returned success: false', response.data);
        alert('API Error: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Lỗi tải danh sách người dùng:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/flashcards');
      if (response.data.success) {
        setFlashcards(response.data.flashcards);
      }
    } catch (error) {
      console.error('Lỗi tải flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuizQuestions = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/quiz-questions');
      if (response.data.success) {
        setQuizQuestions(response.data.questions);
      }
    } catch (error) {
      console.error('Lỗi tải câu hỏi quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSpeakingContent = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/speaking-content');
      if (response.data.success) {
        setSpeakingContent(response.data.content);
      }
    } catch (error) {
      console.error('Lỗi tải nội dung luyện nói:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users' && users.length === 0) loadUsers();
    if (tab === 'flashcards' && flashcards.length === 0) loadFlashcards();
    if (tab === 'quiz' && quizQuestions.length === 0) loadQuizQuestions();
    if (tab === 'speaking' && speakingContent.length === 0) loadSpeakingContent();
    if (tab === 'reports') loadStats();
  };

  const toggleUserStatus = async (userId) => {
    try {
      const response = await API.patch(`/admin/users/${userId}/toggle-status`);
      if (response.data.success) {
        loadUsers();
      }
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      const response = await API.patch(`/admin/users/${userId}/change-role`, { role: newRole });
      if (response.data.success) {
        loadUsers();
      }
    } catch (error) {
      console.error('Lỗi thay đổi quyền:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Bạn chắc chắn muốn xóa người dùng này?')) {
      try {
        const response = await API.delete(`/admin/users/${userId}`);
        if (response.data.success) {
          loadUsers();
        }
      } catch (error) {
        console.error('Lỗi xóa người dùng:', error);
      }
    }
  };

  const deleteFlashcard = async (flashcardId) => {
    if (window.confirm('Bạn chắc chắn muốn xóa flashcard này?')) {
      try {
        const response = await API.delete(`/admin/flashcards/${flashcardId}`);
        if (response.data.success) {
          loadFlashcards();
        }
      } catch (error) {
        console.error('Lỗi xóa flashcard:', error);
      }
    }
  };

  const deleteQuizQuestion = async (questionId) => {
    if (window.confirm('Bạn chắc chắn muốn xóa câu hỏi này?')) {
      try {
        const response = await API.delete(`/admin/quiz-questions/${questionId}`);
        if (response.data.success) {
          loadQuizQuestions();
        }
      } catch (error) {
        console.error('Lỗi xóa câu hỏi:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚙️</span>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-blue-200 text-sm">English Flashcard Web</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {adminInfo && (
              <div className="relative">
                <button
                  onClick={() => setShowAdminProfile(!showAdminProfile)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <span className="text-lg">👨‍💼</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{adminInfo.username}</p>
                    <p className="text-xs text-blue-200">{adminInfo.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</p>
                  </div>
                  <span className="text-blue-200">{showAdminProfile ? '▲' : '▼'}</span>
                </button>
                
                {/* Dropdown Profile */}
                {showAdminProfile && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <span className="text-2xl">👨‍💼</span>
                        </div>
                        <div>
                          <p className="font-bold">{adminInfo.username}</p>
                          <p className="text-sm text-blue-200">{adminInfo.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span>📧</span>
                        <span className="text-sm">{adminInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span>🔑</span>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {adminInfo.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span>✅</span>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Hoạt động</span>
                      </div>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm"
                      >
                        🚪 Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Click outside to close dropdown */}
      {showAdminProfile && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowAdminProfile(false)}
        />
      )}

      <div className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⚙️ Quản lý Hệ thống</h1>
          <p className="text-gray-600">Quản lý cấp độ, chủ đề, flashcards, người dùng và nội dung học tập</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-lg shadow p-2 overflow-x-auto">
          <button
            onClick={() => handleTabChange('users')}
            className={`px-4 py-2 rounded font-semibold transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            👥 Người dùng
          </button>
          <button
            onClick={() => handleTabChange('flashcards')}
            className={`px-4 py-2 rounded font-semibold transition-all whitespace-nowrap ${
              activeTab === 'flashcards'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            📚 Bài học
          </button>
          <button
            onClick={() => handleTabChange('speaking')}
            className={`px-4 py-2 rounded font-semibold transition-all whitespace-nowrap ${
              activeTab === 'speaking'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
              🎤 Luyện nói
            </button>
            <button
              onClick={() => handleTabChange('reports')}
              className={`px-4 py-2 rounded font-semibold transition-all whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              📈 Báo cáo
            </button>
          </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
                  <button
                    onClick={() => setShowUserModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                  >
                    ➕ Thêm người dùng
                  </button>
                </div>
                {users.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-600">Không có người dùng nào</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tài khoản</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quyền</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user._id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-800">{user.username}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                            <td className="px-6 py-4 text-sm">
                              <select
                                value={user.role}
                                onChange={(e) => changeUserRole(user._id, e.target.value)}
                                    className="px-2 py-1 border rounded text-sm"
                                  >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                  <button
                                    onClick={() => toggleUserStatus(user._id)}
                                    className={`px-3 py-1 rounded text-white font-semibold text-sm ${
                                      user.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                  >
                                    {user.isActive ? '✓ Hoạt động' : '✗ Khóa'}
                                  </button>
                                </td>
                                <td className="px-6 py-4 text-sm space-x-2">
                                  <button
                                    onClick={() => deleteUser(user._id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-semibold text-sm"
                                  >
                                    🗑️ Xóa
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

            {/* Flashcards Tab */}
            {activeTab === 'flashcards' && (
              <div className="space-y-6">
                {/* Breadcrumb Navigation */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <button 
                      onClick={handleBackToLevels}
                      className={`${!selectedLevel ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                      📚 Cấp độ
                    </button>
                    {selectedLevel && (
                      <>
                        <span className="text-gray-400">→</span>
                        <button 
                          onClick={handleBackToTopics}
                          className={`${selectedLevel && !selectedTopic ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                          {selectedLevel}
                        </button>
                      </>
                    )}
                    {selectedTopic && (
                      <>
                        <span className="text-gray-400">→</span>
                        <span className="text-blue-600 font-semibold">{selectedTopic.name}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Level View - Show all levels */}
                {!selectedLevel && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">📚 Quản lý Cấp độ</h2>
                        <p className="text-gray-600 mt-1">Nhấn "Sửa" để xem các chủ đề của cấp độ</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
                        ➕ Thêm cấp độ
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-6">
                      {levelsList.map((level, idx) => (
                        <div key={idx} className="border-2 border-blue-300 rounded-lg p-4 hover:shadow-lg transition">
                          <h3 className="font-bold text-gray-800 mb-3">{level}</h3>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSelectLevel(level)}
                              className="flex-1 px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                            >
                              ✏️ Sửa
                            </button>
                            <button className="flex-1 px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">🗑️ Xóa</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topic View - Show topics of selected level */}
                {selectedLevel && !selectedTopic && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">🏷️ Chủ đề - {selectedLevel}</h2>
                        <p className="text-gray-600 mt-1">Nhấn "Sửa" để xem các flashcard của chủ đề</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
                          ➕ Thêm chủ đề
                        </button>
                        <button 
                          onClick={handleBackToLevels}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-semibold"
                        >
                          ← Quay lại
                        </button>
                      </div>
                    </div>
                    {loading ? (
                      <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Đang tải chủ đề...</p>
                      </div>
                    ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Chủ đề</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Số Flashcards</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {levelTopics.map((topic, idx) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-800 font-medium">{topic.name}</td>
                              <td className="px-6 py-4 text-sm">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                                  {topic.count}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm space-x-2">
                                <button 
                                  onClick={() => handleSelectTopic(topic)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                >
                                  ✏️ Sửa
                                </button>
                                <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">🗑️ Xóa</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    )}
                  </div>
                )}

                {/* Flashcard View - Show flashcards of selected topic */}
                {selectedTopic && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">📇 Flashcards - {selectedTopic.name}</h2>
                        <p className="text-gray-600 mt-1">Cấp độ: {selectedLevel} • Nhấn vào thẻ để lật</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
                          ➕ Thêm flashcard
                        </button>
                        <button 
                          onClick={handleBackToTopics}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-semibold"
                        >
                          ← Quay lại
                        </button>
                      </div>
                    </div>
                    
                    {/* Flashcards Grid */}
                    <div className="p-6">
                      {loading ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-gray-600">Đang tải flashcards...</p>
                        </div>
                      ) : topicFlashcards.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {topicFlashcards.map((card) => (
                            <div key={card._id} className="flex flex-col">
                              {/* Flashcard với hiệu ứng lật */}
                              <div 
                                className="relative cursor-pointer"
                                style={{ perspective: '1000px', height: '280px' }}
                                onClick={() => toggleFlipCard(card._id)}
                              >
                                <div 
                                  className="relative w-full h-full transition-transform duration-700"
                                  style={{ 
                                    transformStyle: 'preserve-3d',
                                    transform: flippedCards[card._id] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                  }}
                                >
                                  {/* Mặt trước - Front */}
                                  <div 
                                    className="absolute w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-300"
                                    style={{ backfaceVisibility: 'hidden' }}
                                  >
                                    <div className="relative h-full flex flex-col justify-between p-4">
                                      {/* Header */}
                                      <div className="flex justify-between items-start">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                          {topicFlashcards.indexOf(card) + 1}
                                        </div>
                                        <span className="text-gray-400 text-xs">Nhấn để lật</span>
                                      </div>

                                      {/* Content chính */}
                                      <div className="flex-1 flex flex-col justify-center items-center">
                                        {/* Hình minh họa */}
                                        {card.image && (
                                          <div className="text-5xl mb-3">
                                            {card.image}
                                          </div>
                                        )}

                                        {/* Từ vựng */}
                                        <h2 className="text-2xl font-bold text-blue-600 mb-2 text-center">{card.word}</h2>
                                        
                                        {/* Phiên âm */}
                                        {card.pronunciation && (
                                          <p className="text-sm text-gray-500">/{card.pronunciation}/</p>
                                        )}
                                      </div>
                                      
                                      {/* Footer */}
                                      <div className="text-center">
                                        <p className="text-xs text-gray-400">Click để xem nghĩa</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Mặt sau - Back */}
                                  <div 
                                    className="absolute w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-green-300"
                                    style={{ 
                                      backfaceVisibility: 'hidden',
                                      transform: 'rotateY(180deg)'
                                    }}
                                  >
                                    <div className="relative h-full flex flex-col justify-between p-4">
                                      {/* Header */}
                                      <div className="flex justify-between items-start">
                                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                                          {topicFlashcards.indexOf(card) + 1}
                                        </div>
                                        <span className="text-gray-400 text-xs">Nhấn để lật</span>
                                      </div>

                                      {/* Content chính */}
                                      <div className="flex-1 flex flex-col justify-center items-center px-2">
                                        {/* Nghĩa */}
                                        <p className="text-xl font-bold text-gray-800 mb-3 text-center">{card.meaning}</p>
                                        
                                        {/* Ví dụ */}
                                        {card.example && (
                                          <div className="bg-gray-50 rounded-lg p-3 w-full">
                                            <p className="text-sm text-gray-700 italic text-center">"{card.example}"</p>
                                            {card.exampleTranslation && (
                                              <p className="text-xs text-gray-500 text-center mt-1">"{card.exampleTranslation}"</p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Footer */}
                                      <div className="text-center">
                                        <p className="text-xs text-gray-400">Click để xem từ vựng</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Action buttons */}
                              <div className="flex gap-2 mt-3 justify-center">
                                <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 font-medium">
                                  ✏️ Sửa
                                </button>
                                <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 font-medium">
                                  🗑️ Xóa
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          Chưa có flashcard nào trong chủ đề này
                        </div>
                      )}
                    </div>
                    
                    {topicFlashcards.length > 0 && (
                      <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
                        Tổng: {topicFlashcards.length} flashcards
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Speaking Tab */}
            {activeTab === 'speaking' && (
              <div className="space-y-6">
                {/* Breadcrumb Navigation */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <button 
                      onClick={handleBackToSpeakingLevels}
                      className={`${!selectedSpeakingLevel ? 'text-purple-600 font-semibold' : 'text-gray-600 hover:text-purple-600'}`}
                    >
                      🎤 Cấp độ
                    </button>
                    {selectedSpeakingLevel && (
                      <>
                        <span className="text-gray-400">→</span>
                        <button 
                          onClick={handleBackToSpeakingTopics}
                          className={`${selectedSpeakingLevel && !selectedSpeakingTopic ? 'text-purple-600 font-semibold' : 'text-gray-600 hover:text-purple-600'}`}
                        >
                          {selectedSpeakingLevel.name}
                        </button>
                      </>
                    )}
                    {selectedSpeakingTopic && (
                      <>
                        <span className="text-gray-400">→</span>
                        <span className="text-purple-600 font-semibold">{selectedSpeakingTopic.name}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Level View */}
                {!selectedSpeakingLevel && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">🎤 Quản lý Cấp độ Luyện nói</h2>
                        <p className="text-gray-600 mt-1">Nhấn "Sửa" để xem các chủ đề của cấp độ</p>
                      </div>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold">
                        ➕ Thêm cấp độ
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                      {speakingLevelsList.map((level, idx) => (
                        <div key={idx} className="border-2 border-purple-300 rounded-lg p-4 hover:shadow-lg transition">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">{level.icon}</span>
                            <h3 className="font-bold text-gray-800">{level.name}</h3>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSelectSpeakingLevel(level)}
                              className="flex-1 px-2 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                            >
                              ✏️ Sửa
                            </button>
                            <button className="flex-1 px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">🗑️ Xóa</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topic View */}
                {selectedSpeakingLevel && !selectedSpeakingTopic && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">🏷️ Chủ đề - {selectedSpeakingLevel.name}</h2>
                        <p className="text-gray-600 mt-1">Nhấn "Sửa" để xem các mục luyện tập</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold">
                          ➕ Thêm chủ đề
                        </button>
                        <button 
                          onClick={handleBackToSpeakingLevels}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-semibold"
                        >
                          ← Quay lại
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Chủ đề</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Số mục luyện tập</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {speakingTopics.map((topic, idx) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                <span className="mr-2">{topic.icon}</span>{topic.name}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                                  {topic.count}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm space-x-2">
                                <button 
                                  onClick={() => handleSelectSpeakingTopic(topic)}
                                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                                >
                                  ✏️ Sửa
                                </button>
                                <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">🗑️ Xóa</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Speaking Items View */}
                {selectedSpeakingTopic && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">🎯 Mục luyện tập - {selectedSpeakingTopic.name}</h2>
                        <p className="text-gray-600 mt-1">Cấp độ: {selectedSpeakingLevel.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold">
                          ➕ Thêm mục
                        </button>
                        <button 
                          onClick={handleBackToSpeakingTopics}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-semibold"
                        >
                          ← Quay lại
                        </button>
                      </div>
                    </div>
                    
                    {/* Speaking Items List */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {speakingItems.map((item, index) => (
                          <div 
                            key={item.id} 
                            className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50 hover:border-purple-400 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="text-lg font-semibold text-gray-800">{item.text}</p>
                                  <p className="text-sm text-purple-600 mt-1">{item.meaning}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 font-medium">
                                  ✏️ Sửa
                                </button>
                                <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 font-medium">
                                  🗑️ Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {speakingItems.length > 0 && (
                      <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
                        Tổng: {speakingItems.length} mục luyện tập
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && stats && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalUsers}</div>
                    <div className="text-gray-600">Tổng người dùng</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">{stats.activeUsers}</div>
                    <div className="text-gray-600">Người dùng hoạt động</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">👥 Thống kê người dùng</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span className="text-gray-700">Tổng người dùng</span>
                        <span className="font-bold text-blue-600">{stats.totalUsers}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                        <span className="text-gray-700">Người dùng hoạt động</span>
                        <span className="font-bold text-green-600">{stats.activeUsers}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                        <span className="text-gray-700">Người dùng bị khóa</span>
                        <span className="font-bold text-red-600">{stats.totalUsers - stats.activeUsers}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                        <span className="text-gray-700">Quản trị viên</span>
                        <span className="font-bold text-purple-600">{stats.adminUsers}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Báo cáo chi tiết</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Tỷ lệ người dùng hoạt động</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );
}
