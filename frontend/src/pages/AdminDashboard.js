import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { NavigationContext } from '../context/NavigationContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { setPageState } = useContext(NavigationContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [speakingContent, setSpeakingContent] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [levels, setLevels] = useState([]);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showSpeakingModal, setShowSpeakingModal] = useState(false);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterTopic, setFilterTopic] = useState('all');
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // States for drill-down: Level -> Topic -> Flashcards
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedLevelId, setSelectedLevelId] = useState(null); // Store level ID for API calls
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [levelTopics, setLevelTopics] = useState([]);
  const [topicFlashcards, setTopicFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  
  // Topic management states
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  
  // Flashcard management states
  const [showFlashcardFormModal, setShowFlashcardFormModal] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState(null);
  
  // Quiz management states
  const [levelQuizQuestions, setLevelQuizQuestions] = useState([]);
  const [showQuizFormModal, setShowQuizFormModal] = useState(false);
  const [editingQuizQuestion, setEditingQuizQuestion] = useState(null);
  
  // States for Speaking drill-down
  const [selectedSpeakingLevel, setSelectedSpeakingLevel] = useState(null);
  const [selectedSpeakingTopic, setSelectedSpeakingTopic] = useState(null);
  const [speakingTopics, setSpeakingTopics] = useState([]);
  const [speakingItems, setSpeakingItems] = useState([]);
  const [showSpeakingTopicModal, setShowSpeakingTopicModal] = useState(false);
  const [editingSpeakingTopic, setEditingSpeakingTopic] = useState(null);
  const [showSpeakingItemModal, setShowSpeakingItemModal] = useState(false);
  const [editingSpeakingItem, setEditingSpeakingItem] = useState(null);
  const [speakingLevelsList, setSpeakingLevelsList] = useState([]);
  const [showSpeakingLevelModal, setShowSpeakingLevelModal] = useState(false);
  const [editingSpeakingLevel, setEditingSpeakingLevel] = useState(null);

  // Default speaking levels (fallback if no data in DB)
  const defaultSpeakingLevels = [
    { id: 'basic', name: 'Cơ bản', icon: '🌱' },
    { id: 'conversation', name: 'Giao tiếp', icon: '💬' },
    { id: 'paragraph', name: 'Đoạn văn', icon: '📝' }
  ];

  // Default speaking topic icons
  const defaultSpeakingTopicIcons = {
    'animals': '🐾', 'fruits': '🍎', 'colors': '🎨', 'family': '👨‍👩‍👧‍👦',
    'daily': '☀️', 'shopping': '🛒', 'restaurant': '🍽️', 'travel': '✈️',
    'phone': '📞', 'business': '💼', 'technology': '💻'
  };

  // Load speaking levels from API
  const loadSpeakingLevels = async () => {
    try {
      const response = await API.get('/admin/speaking-levels');
      if (response.data.success && response.data.levels.length > 0) {
        setSpeakingLevelsList(response.data.levels);
      } else {
        setSpeakingLevelsList(defaultSpeakingLevels);
      }
    } catch (error) {
      console.error('Lỗi tải cấp độ luyện nói:', error);
      setSpeakingLevelsList(defaultSpeakingLevels);
    }
  };

  // Speaking Level CRUD
  const handleCreateSpeakingLevel = async (levelData) => {
    try {
      const response = await API.post('/admin/speaking-levels', levelData);
      if (response.data.success) {
        await loadSpeakingLevels();
        setShowSpeakingLevelModal(false);
        alert('Thêm cấp độ luyện nói thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi thêm cấp độ');
    }
  };

  const handleUpdateSpeakingLevel = async (levelId, levelData) => {
    try {
      const response = await API.put(`/admin/speaking-levels/${levelId}`, levelData);
      if (response.data.success) {
        await loadSpeakingLevels();
        setShowSpeakingLevelModal(false);
        setEditingSpeakingLevel(null);
        alert('Cập nhật cấp độ thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi cập nhật cấp độ');
    }
  };

  const handleDeleteSpeakingLevel = async (levelId) => {
    if (!window.confirm('Bạn có chắc muốn xóa cấp độ này?')) return;
    try {
      const response = await API.delete(`/admin/speaking-levels/${levelId}`);
      if (response.data.success) {
        await loadSpeakingLevels();
        alert('Xóa cấp độ thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi xóa cấp độ');
    }
  };

  // Load speaking topics from API
  const loadSpeakingTopics = async (levelId) => {
    try {
      setLoading(true);
      const response = await API.get(`/admin/speaking-topics/level/${levelId}`);
      if (response.data.success) {
        setSpeakingTopics(response.data.topics);
      }
    } catch (error) {
      console.error('Lỗi tải chủ đề luyện nói:', error);
      setSpeakingTopics([]);
    } finally {
      setLoading(false);
    }
  };

  // Load speaking items from API
  const loadSpeakingItems = async (levelId, topicId) => {
    try {
      setLoading(true);
      const response = await API.get(`/admin/speaking-items/${levelId}/${topicId}`);
      if (response.data.success) {
        setSpeakingItems(response.data.items);
      }
    } catch (error) {
      console.error('Lỗi tải mục luyện nói:', error);
      setSpeakingItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSpeakingLevel = async (level) => {
    setSelectedSpeakingLevel(level);
    setSelectedSpeakingTopic(null);
    setSpeakingItems([]);
    await loadSpeakingTopics(level.id);
  };

  const handleSelectSpeakingTopic = async (topic) => {
    setSelectedSpeakingTopic(topic);
    await loadSpeakingItems(selectedSpeakingLevel.id, topic.id);
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

  // Speaking Topic CRUD
  const handleCreateSpeakingTopic = async (topicData) => {
    try {
      const response = await API.post('/admin/speaking-topics', {
        ...topicData,
        levelId: selectedSpeakingLevel.id
      });
      if (response.data.success) {
        await loadSpeakingTopics(selectedSpeakingLevel.id);
        setShowSpeakingTopicModal(false);
        alert('Thêm chủ đề luyện nói thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi thêm chủ đề');
    }
  };

  const handleUpdateSpeakingTopic = async (topicId, topicData) => {
    try {
      const response = await API.put(`/admin/speaking-topics/${selectedSpeakingLevel.id}/${topicId}`, topicData);
      if (response.data.success) {
        await loadSpeakingTopics(selectedSpeakingLevel.id);
        setShowSpeakingTopicModal(false);
        setEditingSpeakingTopic(null);
        alert('Cập nhật chủ đề thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi cập nhật chủ đề');
    }
  };

  const handleDeleteSpeakingTopic = async (topicId) => {
    if (!window.confirm('Bạn có chắc muốn xóa chủ đề này?')) return;
    try {
      const response = await API.delete(`/admin/speaking-topics/${selectedSpeakingLevel.id}/${topicId}`);
      if (response.data.success) {
        await loadSpeakingTopics(selectedSpeakingLevel.id);
        alert('Xóa chủ đề thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi xóa chủ đề');
    }
  };

  // Speaking Item CRUD
  const handleCreateSpeakingItem = async (itemData) => {
    try {
      const response = await API.post('/admin/speaking-items', {
        ...itemData,
        level: selectedSpeakingLevel.id,
        topic: selectedSpeakingTopic.id
      });
      if (response.data.success) {
        await loadSpeakingItems(selectedSpeakingLevel.id, selectedSpeakingTopic.id);
        setShowSpeakingItemModal(false);
        alert('Thêm mục luyện nói thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi thêm mục luyện nói');
    }
  };

  const handleUpdateSpeakingItem = async (itemId, itemData) => {
    try {
      const response = await API.put(`/admin/speaking-items/${itemId}`, itemData);
      if (response.data.success) {
        await loadSpeakingItems(selectedSpeakingLevel.id, selectedSpeakingTopic.id);
        setShowSpeakingItemModal(false);
        setEditingSpeakingItem(null);
        alert('Cập nhật mục luyện nói thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi cập nhật mục luyện nói');
    }
  };

  const handleDeleteSpeakingItem = async (itemId) => {
    if (!window.confirm('Bạn có chắc muốn xóa mục luyện nói này?')) return;
    try {
      const response = await API.delete(`/admin/speaking-items/${itemId}`);
      if (response.data.success) {
        await loadSpeakingItems(selectedSpeakingLevel.id, selectedSpeakingTopic.id);
        alert('Xóa mục luyện nói thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi xóa mục luyện nói');
    }
  };

  // Toggle flip card
  const toggleFlipCard = (cardId) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Default topic icons mapping (same as user page)
  const defaultTopicIcons = {
    // Basic
    'colors': '🎨', 'Màu sắc': '🎨',
    'numbers': '🔢', 'Số đếm': '🔢',
    'family': '👨‍👩‍👧‍👦', 'Gia đình': '👨‍👩‍👧‍👦',
    'animals': '🐾', 'Con vật': '🐾',
    // Intermediate
    'intermediate-food': '🍽️', 'Thức ăn': '🍽️',
    'intermediate-travel': '✈️', 'Du lịch': '✈️',
    'intermediate-weather': '🌤️', 'Thời tiết': '🌤️',
    'intermediate-jobs': '💼', 'Công việc': '💼',
    // Advanced
    'advanced-business': '💼', 'Kinh doanh': '💼',
    'advanced-technology': '💻', 'Công nghệ': '💻',
    'advanced-science': '🔬', 'Khoa học': '🔬',
    'advanced-literature': '📚', 'Văn học': '📚',
    // Communication
    'daily': '☀️', 'Hàng ngày': '☀️',
    'workplace': '🏢', 'Nơi làm việc': '🏢',
    'social': '👥', 'Xã hội': '👥',
    'phone': '📱', 'Điện thoại': '📱',
    // Specialized
    'medical': '⚕️', 'Y tế': '⚕️',
    'legal': '⚖️', 'Pháp lý': '⚖️',
    'finance': '💰', 'Tài chính': '💰',
    'engineering': '⚙️', 'Kỹ thuật': '⚙️'
  };

  const handleSelectLevel = async (levelName, levelId) => {
    setSelectedLevel(levelName);
    setSelectedLevelId(levelId || levelName);
    setSelectedTopic(null);
    setTopicFlashcards([]);
    
    try {
      setLoading(true);
      
      // ALWAYS load topics from flashcards first (this is the actual data)
      const flashcardsRes = await API.get('/flashcards', { params: { level: levelName } });
      const topicCounts = {};
      if (flashcardsRes.data) {
        flashcardsRes.data.forEach(card => {
          if (card.topic) {
            topicCounts[card.topic] = (topicCounts[card.topic] || 0) + 1;
          }
        });
      }
      
      // Create topics from flashcards with correct icons
      const topicsFromFlashcards = Object.entries(topicCounts).map(([name, count]) => ({ 
        id: name, 
        name, 
        count,
        icon: defaultTopicIcons[name] || '📖',
        fromFlashcards: true
      }));
      
      // Try to get additional topic info from Topic collection (for icons, descriptions, etc.)
      try {
        const topicLevelId = levelId || levelName;
        const topicsRes = await API.get(`/admin/topics/level/${topicLevelId}`);
        if (topicsRes.data.success && topicsRes.data.topics.length > 0) {
          // Merge: use flashcard topics as base, enhance with database info
          const dbTopicsMap = {};
          topicsRes.data.topics.forEach(t => {
            dbTopicsMap[t.id] = t;
            dbTopicsMap[t.name] = t;
          });
          
          const mergedTopics = topicsFromFlashcards.map(topic => {
            const dbTopic = dbTopicsMap[topic.id] || dbTopicsMap[topic.name];
            if (dbTopic) {
              return {
                ...dbTopic,
                count: topic.count,
                fromFlashcards: true
              };
            }
            return topic;
          });
          
          // Also add any database topics that don't have flashcards yet
          topicsRes.data.topics.forEach(dbTopic => {
            const exists = mergedTopics.some(t => t.id === dbTopic.id || t.name === dbTopic.name);
            if (!exists) {
              mergedTopics.push({
                ...dbTopic,
                count: 0,
                fromFlashcards: false
              });
            }
          });
          
          setLevelTopics(mergedTopics);
        } else {
          setLevelTopics(topicsFromFlashcards);
        }
      } catch (err) {
        // If Topic API fails, just use flashcard topics
        setLevelTopics(topicsFromFlashcards);
      }
      
      // Load quiz questions for this level (use levelId for database query)
      loadLevelQuizQuestions(levelName, levelId);
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
      // Query theo topic ID để khớp với cách tạo flashcard mới
      const response = await API.get('/flashcards', {
        params: { level: selectedLevel, topic: topic.id }
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
    setLevelQuizQuestions([]);
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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu mới không khớp!');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      const response = await API.put('/user/change-password', {
        currentPassword,
        newPassword
      });

      if (response.data.success) {
        setPasswordSuccess('Đổi mật khẩu thành công!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Lỗi đổi mật khẩu!');
    }
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
    if (tab === 'flashcards') {
      if (flashcards.length === 0) loadFlashcards();
      loadLevels(); // Load levels for flashcards tab
    }
    if (tab === 'quiz' && quizQuestions.length === 0) loadQuizQuestions();
    if (tab === 'speaking') {
      loadSpeakingLevels();
    }
    if (tab === 'reports') loadStats();
    if (tab === 'feedbacks') loadFeedbacks();
  };

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/feedbacks');
      if (response.data.success) {
        setFeedbacks(response.data.feedbacks);
      }
    } catch (error) {
      console.error('Lỗi tải phản hồi:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFeedbackStatus = async (userId, feedbackId, newStatus) => {
    try {
      await API.patch(`/admin/feedbacks/${userId}/${feedbackId}`, { status: newStatus });
      loadFeedbacks();
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái phản hồi:', error);
    }
  };

  const replyToFeedback = async (userId, feedbackId, replyText) => {
    try {
      await API.patch(`/admin/feedbacks/${userId}/${feedbackId}/reply`, { adminReply: replyText });
      loadFeedbacks();
    } catch (error) {
      console.error('Lỗi gửi phản hồi:', error);
    }
  };

  // ============ LEVEL MANAGEMENT ============
  const loadLevels = async () => {
    try {
      const response = await API.get('/admin/levels');
      if (response.data.success) {
        setLevels(response.data.levels);
      }
    } catch (error) {
      console.error('Lỗi tải cấp độ:', error);
    }
  };

  const handleCreateLevel = async (levelData) => {
    try {
      const response = await API.post('/admin/levels', levelData);
      if (response.data.success) {
        loadLevels();
        setShowLevelModal(false);
        alert('Thêm cấp độ thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi thêm cấp độ');
    }
  };

  const handleUpdateLevel = async (levelId, levelData) => {
    try {
      const response = await API.put(`/admin/levels/${levelId}`, levelData);
      if (response.data.success) {
        loadLevels();
        setShowLevelModal(false);
        setEditingLevel(null);
        alert('Cập nhật cấp độ thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi cập nhật cấp độ');
    }
  };

  const handleDeleteLevel = async (levelId) => {
    if (!window.confirm('Bạn có chắc muốn xóa cấp độ này?')) return;
    try {
      const response = await API.delete(`/admin/levels/${levelId}`);
      if (response.data.success) {
        loadLevels();
        alert('Xóa cấp độ thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi xóa cấp độ');
    }
  };

  // ============ TOPIC MANAGEMENT ============
  const handleCreateTopic = async (topicData) => {
    try {
      const response = await API.post('/admin/topics', {
        ...topicData,
        levelId: selectedLevelId
      });
      if (response.data.success) {
        // Reload topics for current level
        handleSelectLevel(selectedLevel, selectedLevelId);
        setShowTopicModal(false);
        alert('Thêm chủ đề thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi thêm chủ đề');
    }
  };

  const handleUpdateTopic = async (topicId, topicData) => {
    try {
      const response = await API.put(`/admin/topics/${selectedLevelId}/${topicId}`, topicData);
      if (response.data.success) {
        handleSelectLevel(selectedLevel, selectedLevelId);
        setShowTopicModal(false);
        setEditingTopic(null);
        alert('Cập nhật chủ đề thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi cập nhật chủ đề');
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm('Bạn có chắc muốn xóa chủ đề này?')) return;
    try {
      const response = await API.delete(`/admin/topics/${selectedLevelId}/${topicId}`);
      if (response.data.success) {
        handleSelectLevel(selectedLevel, selectedLevelId);
        alert('Xóa chủ đề thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi xóa chủ đề');
    }
  };

  // ============ FLASHCARD MANAGEMENT ============
  const handleCreateFlashcard = async (flashcardData) => {
    try {
      const response = await API.post('/admin/flashcards', {
        ...flashcardData,
        level: selectedLevelId, // Gửi level ID thay vì name để tạo category đúng
        topic: selectedTopic.id // Gửi topic ID thay vì name để tạo category đúng
      });
      if (response.data.success) {
        // Reload flashcards for current topic
        handleSelectTopic(selectedTopic);
        setShowFlashcardFormModal(false);
        alert('Thêm flashcard thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi thêm flashcard');
    }
  };

  const handleUpdateFlashcard = async (flashcardId, flashcardData) => {
    try {
      const response = await API.put(`/admin/flashcards/${flashcardId}`, flashcardData);
      if (response.data.success) {
        handleSelectTopic(selectedTopic);
        setShowFlashcardFormModal(false);
        setEditingFlashcard(null);
        alert('Cập nhật flashcard thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi cập nhật flashcard');
    }
  };

  const handleDeleteFlashcardItem = async (flashcardId) => {
    if (!window.confirm('Bạn có chắc muốn xóa flashcard này?')) return;
    try {
      const response = await API.delete(`/admin/flashcards/${flashcardId}`);
      if (response.data.success) {
        handleSelectTopic(selectedTopic);
        alert('Xóa flashcard thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi xóa flashcard');
    }
  };

  // ============ QUIZ MANAGEMENT ============
  // Map Vietnamese level names to English level IDs used in database
  const levelNameToId = {
    'Cơ bản': 'basic',
    'Trung cấp': 'intermediate',
    'Nâng cao': 'advanced',
    'Giao tiếp': 'communication',
    'Chuyên ngành': 'specialized'
  };
  
  const loadLevelQuizQuestions = async (levelName, levelId) => {
    try {
      setLoading(true);
      const response = await API.get('/admin/quiz-questions');
      if (response.data.success) {
        // Use levelId directly if available, otherwise map from name
        const targetLevelId = levelId || levelNameToId[levelName] || levelName.toLowerCase();
        console.log('🔍 Filtering quiz by level:', targetLevelId, 'from', response.data.questions.length, 'questions');
        // Filter by level ID (English)
        const filtered = response.data.questions.filter(q => q.level === targetLevelId);
        console.log('📊 Found', filtered.length, 'questions for level', targetLevelId);
        setLevelQuizQuestions(filtered);
      }
    } catch (error) {
      console.error('Lỗi tải câu hỏi quiz:', error);
      setLevelQuizQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuizQuestion = async (questionData) => {
    try {
      // Use selectedLevelId (English) for database consistency
      const levelId = selectedLevelId || levelNameToId[selectedLevel] || selectedLevel.toLowerCase();
      const response = await API.post('/admin/quiz-questions', {
        ...questionData,
        level: levelId
      });
      if (response.data.success) {
        loadLevelQuizQuestions(selectedLevel, selectedLevelId);
        setShowQuizFormModal(false);
        alert('Thêm câu hỏi thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi thêm câu hỏi');
    }
  };

  const handleUpdateQuizQuestion = async (questionId, questionData) => {
    try {
      const response = await API.put(`/admin/quiz-questions/${questionId}`, questionData);
      if (response.data.success) {
        loadLevelQuizQuestions(selectedLevel, selectedLevelId);
        setShowQuizFormModal(false);
        setEditingQuizQuestion(null);
        alert('Cập nhật câu hỏi thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi cập nhật câu hỏi');
    }
  };

  const handleDeleteQuizQuestion = async (questionId) => {
    if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;
    try {
      const response = await API.delete(`/admin/quiz-questions/${questionId}`);
      if (response.data.success) {
        loadLevelQuizQuestions(selectedLevel, selectedLevelId);
        alert('Xóa câu hỏi thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi xóa câu hỏi');
    }
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
      {/* Header - Full width */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-800 to-blue-900 shadow-lg z-40 flex items-center justify-between px-6">
        {/* Left - Logo */}
        <div className="flex items-center gap-3 w-64">
          <span className="text-3xl">⚙️</span>
          <div>
            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
            <p className="text-blue-300 text-xs">English Flashcard Web</p>
          </div>
        </div>
        
        {/* Right - Admin Info */}
        {adminInfo && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{adminInfo.username}</p>
              <p className="text-xs text-blue-300">{adminInfo.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-xl">👨‍💼</span>
            </div>
          </div>
        )}
      </header>

      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-xl fixed left-0 top-16 flex flex-col">
        {/* Menu Navigation */}
        <div className="p-4 flex-1">
          <p className="text-xs text-blue-300 uppercase font-semibold mb-3">Menu quản lý</p>
          <nav className="space-y-2">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-left flex items-center gap-3 ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-800 shadow-lg'
                  : 'bg-blue-700 hover:bg-blue-600 text-white'
              }`}
            >
              <span className="text-xl">🏠</span>
              <span>Trang chủ</span>
            </button>
            <button
              onClick={() => handleTabChange('users')}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-left flex items-center gap-3 ${
                activeTab === 'users'
                  ? 'bg-white text-blue-800 shadow-lg'
                  : 'bg-blue-700 hover:bg-blue-600 text-white'
              }`}
            >
              <span className="text-xl">👥</span>
              <span>Người dùng</span>
            </button>
            <button
              onClick={() => handleTabChange('flashcards')}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-left flex items-center gap-3 ${
                activeTab === 'flashcards'
                  ? 'bg-white text-blue-800 shadow-lg'
                  : 'bg-blue-700 hover:bg-blue-600 text-white'
              }`}
            >
              <span className="text-xl">📚</span>
              <span>Bài học</span>
            </button>
            <button
              onClick={() => handleTabChange('speaking')}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-left flex items-center gap-3 ${
                activeTab === 'speaking'
                  ? 'bg-white text-blue-800 shadow-lg'
                  : 'bg-blue-700 hover:bg-blue-600 text-white'
              }`}
            >
              <span className="text-xl">🎤</span>
              <span>Luyện nói</span>
            </button>
            <button
              onClick={() => handleTabChange('reports')}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-left flex items-center gap-3 ${
                activeTab === 'reports'
                  ? 'bg-white text-blue-800 shadow-lg'
                  : 'bg-blue-700 hover:bg-blue-600 text-white'
              }`}
            >
              <span className="text-xl">📈</span>
              <span>Báo cáo</span>
            </button>
            <button
              onClick={() => handleTabChange('feedbacks')}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-left flex items-center gap-3 ${
                activeTab === 'feedbacks'
                  ? 'bg-white text-blue-800 shadow-lg'
                  : 'bg-blue-700 hover:bg-blue-600 text-white'
              }`}
            >
              <span className="text-xl">💬</span>
              <span>Nhận phản hồi</span>
            </button>
            <button
              onClick={() => handleTabChange('profile')}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-left flex items-center gap-3 ${
                activeTab === 'profile'
                  ? 'bg-white text-blue-800 shadow-lg'
                  : 'bg-blue-700 hover:bg-blue-600 text-white'
              }`}
            >
              <span className="text-xl">👤</span>
              <span>Thông tin tài khoản</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 rounded-lg font-semibold transition-all text-left flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white"
            >
              <span className="text-xl">🚪</span>
              <span>Đăng xuất</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-16 p-6 bg-gray-100 min-h-screen">
        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-xl text-white">
                  <h1 className="text-3xl font-bold mb-2">
                    Xin chào, {adminInfo?.username || 'Admin'}! 👋
                  </h1>
                  <p className="text-blue-100">Chào mừng bạn đến với trang quản trị English Flashcard Web</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm">Tổng người dùng</p>
                    <p className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm">Đang hoạt động</p>
                    <p className="text-2xl font-bold text-green-600">{stats?.activeUsers || 0}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-5 border-l-4 border-red-500">
                    <p className="text-gray-500 text-sm">Bị khóa</p>
                    <p className="text-2xl font-bold text-red-600">{(stats?.totalUsers || 0) - (stats?.activeUsers || 0)}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-5 border-l-4 border-purple-500">
                    <p className="text-gray-500 text-sm">Quản trị viên</p>
                    <p className="text-2xl font-bold text-purple-600">{stats?.adminUsers || 0}</p>
                  </div>
                </div>

                {/* New Users Stats */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Người dùng mới đăng ký</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-2">Hôm nay</p>
                      <p className="text-3xl font-bold text-blue-600">{stats?.newUsersToday || 0}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-2">Tuần này</p>
                      <p className="text-3xl font-bold text-green-600">{stats?.newUsersThisWeek || 0}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-2">Tháng này</p>
                      <p className="text-3xl font-bold text-purple-600">{stats?.newUsersThisMonth || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ Thao tác nhanh</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => handleTabChange('users')}
                      className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-all"
                    >
                      <span className="text-2xl block mb-2">👥</span>
                      <span className="text-sm font-medium text-gray-700">Quản lý người dùng</span>
                    </button>
                    <button
                      onClick={() => handleTabChange('flashcards')}
                      className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-all"
                    >
                      <span className="text-2xl block mb-2">📚</span>
                      <span className="text-sm font-medium text-gray-700">Quản lý bài học</span>
                    </button>
                    <button
                      onClick={() => handleTabChange('speaking')}
                      className="p-4 bg-teal-50 hover:bg-teal-100 rounded-lg text-center transition-all"
                    >
                      <span className="text-2xl block mb-2">🎤</span>
                      <span className="text-sm font-medium text-gray-700">Quản lý luyện nói</span>
                    </button>
                    <button
                      onClick={() => handleTabChange('reports')}
                      className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-all"
                    >
                      <span className="text-2xl block mb-2">📈</span>
                      <span className="text-sm font-medium text-gray-700">Xem báo cáo</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                        <h2 className="text-2xl font-bold text-gray-800">📚 Quản lý Cấp độ & Bài học</h2>
                        <p className="text-gray-600 mt-1">Quản lý cấp độ và nhấn vào cấp độ để xem các chủ đề</p>
                      </div>
                      <button 
                        onClick={() => { setEditingLevel(null); setShowLevelModal(true); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                      >
                        ➕ Thêm cấp độ
                      </button>
                    </div>
                    
                    {/* Levels Table */}
                    {levels.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-gray-600">Chưa có cấp độ nào</p>
                        <p className="text-sm text-gray-500 mt-2">Nhấn "Thêm cấp độ" để tạo cấp độ mới</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Icon</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên cấp độ</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mô tả</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                            </tr>
                          </thead>
                          <tbody>
                            {levels.map((level) => (
                              <tr key={level.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  {level.icon?.startsWith('data:image') ? (
                                    <img src={level.icon} alt={level.name} className="w-10 h-10 object-contain" />
                                  ) : (
                                    <span className="text-2xl">{level.icon}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm font-mono text-gray-600">{level.id}</td>
                                <td className="px-6 py-4 font-semibold text-gray-800">{level.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{level.description || '-'}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    level.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {level.isActive ? '✓ Hoạt động' : '✗ Ẩn'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                  <button
                                    onClick={() => handleSelectLevel(level.name, level.id)}
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                  >
                                    📖 Xem chủ đề
                                  </button>
                                  <button
                                    onClick={() => { setEditingLevel(level); setShowLevelModal(true); }}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                  >
                                    ✏️ Sửa
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLevel(level.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
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

                {/* Topic View - Show topics of selected level */}
                {selectedLevel && !selectedTopic && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">🏷️ Chủ đề - {selectedLevel}</h2>
                        <p className="text-gray-600 mt-1">Quản lý chủ đề và nhấn "Xem flashcards" để xem các flashcard</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setEditingTopic(null); setShowTopicModal(true); }}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                        >
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
                    ) : levelTopics.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-gray-600">Chưa có chủ đề nào trong cấp độ này</p>
                        <p className="text-sm text-gray-500 mt-2">Nhấn "Thêm chủ đề" để tạo chủ đề mới</p>
                      </div>
                    ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Icon</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên chủ đề</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Số Flashcards</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {levelTopics.map((topic, idx) => (
                            <tr key={topic.id || idx} className="border-b hover:bg-gray-50">
                              <td className="px-6 py-4">
                                {topic.icon?.startsWith('data:image') ? (
                                  <img src={topic.icon} alt={topic.name} className="w-8 h-8 object-contain" />
                                ) : (
                                  <span className="text-xl">{topic.icon || '📖'}</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm font-mono text-gray-600">{topic.id || '-'}</td>
                              <td className="px-6 py-4 text-sm text-gray-800 font-medium">{topic.name}</td>
                              <td className="px-6 py-4 text-sm">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                                  {topic.count || 0}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm space-x-2">
                                <button 
                                  onClick={() => handleSelectTopic(topic)}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                >
                                  📖 Xem flashcards
                                </button>
                                <button 
                                  onClick={() => { setEditingTopic(topic); setShowTopicModal(true); }}
                                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                >
                                  ✏️ Sửa
                                </button>
                                <button 
                                  onClick={() => handleDeleteTopic(topic.id)}
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
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
                    
                    {/* Quiz Questions Section */}
                    <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50">
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">📝 Bài ôn tập - {selectedLevel}</h2>
                          <p className="text-gray-600 mt-1">Quản lý câu hỏi trắc nghiệm cho cấp độ này</p>
                        </div>
                        <button 
                          onClick={() => { setEditingQuizQuestion(null); setShowQuizFormModal(true); }}
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold"
                        >
                          ➕ Thêm câu hỏi
                        </button>
                      </div>
                      
                      {levelQuizQuestions.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="text-5xl mb-3">📭</div>
                          <p className="text-gray-600">Chưa có câu hỏi nào cho cấp độ này</p>
                          <p className="text-sm text-gray-500 mt-1">Nhấn "Thêm câu hỏi" để tạo câu hỏi mới</p>
                        </div>
                      ) : (
                        <div className="divide-y">
                          {levelQuizQuestions.map((question, idx) => (
                            <div key={question._id} className="p-4 hover:bg-gray-50">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-sm font-semibold">
                                      Câu {idx + 1}
                                    </span>
                                    {question.category && (
                                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-sm">
                                        {question.category}
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-medium text-gray-800 mb-1">{question.question}</p>
                                  <p className="text-sm text-gray-500 mb-3">{question.questionVi}</p>
                                  
                                  {/* Options */}
                                  <div className="grid grid-cols-2 gap-2">
                                    {question.options?.map((opt, optIdx) => (
                                      <div 
                                        key={optIdx}
                                        className={`p-2 rounded text-sm ${
                                          opt.isCorrect 
                                            ? 'bg-green-100 border border-green-300 text-green-800' 
                                            : 'bg-gray-50 border border-gray-200 text-gray-700'
                                        }`}
                                      >
                                        <span className="font-medium">{String.fromCharCode(65 + optIdx)}.</span> {opt.text}
                                        {opt.isCorrect && <span className="ml-2">✓</span>}
                                        <p className="text-xs text-gray-500 mt-0.5">{opt.textVi}</p>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  {question.explanation && (
                                    <p className="mt-2 text-sm text-blue-600 italic">💡 {question.explanation}</p>
                                  )}
                                </div>
                                
                                <div className="flex gap-2 ml-4">
                                  <button 
                                    onClick={() => { setEditingQuizQuestion(question); setShowQuizFormModal(true); }}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                  >
                                    ✏️ Sửa
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteQuizQuestion(question._id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                  >
                                    🗑️ Xóa
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {levelQuizQuestions.length > 0 && (
                        <div className="p-3 bg-gray-50 text-center text-sm text-gray-600">
                          Tổng: {levelQuizQuestions.length} câu hỏi
                        </div>
                      )}
                    </div>
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
                        <button 
                          onClick={() => { setEditingFlashcard(null); setShowFlashcardFormModal(true); }}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                        >
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
                                          <div className="mb-3">
                                            {card.image.startsWith('data:image') ? (
                                              <img src={card.image} alt={card.word} className="w-24 h-24 object-contain" />
                                            ) : (
                                              <span className="text-5xl">{card.image}</span>
                                            )}
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
                                <button 
                                  onClick={() => { setEditingFlashcard(card); setShowFlashcardFormModal(true); }}
                                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 font-medium"
                                >
                                  ✏️ Sửa
                                </button>
                                <button 
                                  onClick={() => handleDeleteFlashcardItem(card._id)}
                                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 font-medium"
                                >
                                  🗑️ Xóa
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <div className="text-6xl mb-4">📭</div>
                          <p>Chưa có flashcard nào trong chủ đề này</p>
                          <p className="text-sm mt-2">Nhấn "Thêm flashcard" để tạo flashcard mới</p>
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
                        <p className="text-gray-600 mt-1">Nhấn "Xem chủ đề" để xem các chủ đề của cấp độ</p>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingSpeakingLevel(null);
                          setShowSpeakingLevelModal(true);
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold"
                      >
                        ➕ Thêm cấp độ
                      </button>
                    </div>
                    {loading ? (
                      <div className="p-12 text-center">
                        <div className="text-4xl mb-4">⏳</div>
                        <p className="text-gray-600">Đang tải...</p>
                      </div>
                    ) : speakingLevelsList.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-gray-600">Chưa có cấp độ nào. Nhấn "Thêm cấp độ" để tạo mới.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                        {speakingLevelsList.map((level, idx) => (
                          <div key={idx} className="border-2 border-purple-300 rounded-lg p-4 hover:shadow-lg transition">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">{level.icon}</span>
                              <h3 className="font-bold text-gray-800">{level.name}</h3>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">{level.description || 'Không có mô tả'}</p>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleSelectSpeakingLevel(level)}
                                className="flex-1 px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                              >
                                👁️ Xem chủ đề
                              </button>
                              <button 
                                onClick={() => {
                                  setEditingSpeakingLevel(level);
                                  setShowSpeakingLevelModal(true);
                                }}
                                className="px-2 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => handleDeleteSpeakingLevel(level.id)}
                                className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Topic View */}
                {selectedSpeakingLevel && !selectedSpeakingTopic && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">🏷️ Chủ đề - {selectedSpeakingLevel.name}</h2>
                        <p className="text-gray-600 mt-1">Nhấn "Xem mục" để xem các mục luyện tập</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingSpeakingTopic(null);
                            setShowSpeakingTopicModal(true);
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold"
                        >
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
                    {loading ? (
                      <div className="p-12 text-center">
                        <div className="text-4xl mb-4">⏳</div>
                        <p className="text-gray-600">Đang tải...</p>
                      </div>
                    ) : speakingTopics.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-gray-600">Chưa có chủ đề nào. Nhấn "Thêm chủ đề" để tạo mới.</p>
                      </div>
                    ) : (
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
                                  <span className="mr-2">{topic.icon || defaultSpeakingTopicIcons[topic.id] || '🎤'}</span>{topic.name}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                                    {topic.count || 0}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm space-x-2">
                                  <button 
                                    onClick={() => handleSelectSpeakingTopic(topic)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                  >
                                    👁️ Xem mục
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setEditingSpeakingTopic(topic);
                                      setShowSpeakingTopicModal(true);
                                    }}
                                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                                  >
                                    ✏️ Sửa
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteSpeakingTopic(topic.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
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

                {/* Speaking Items View */}
                {selectedSpeakingTopic && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">🎯 Mục luyện tập - {selectedSpeakingTopic.name}</h2>
                        <p className="text-gray-600 mt-1">Cấp độ: {selectedSpeakingLevel.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingSpeakingItem(null);
                            setShowSpeakingItemModal(true);
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold"
                        >
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
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-4">⏳</div>
                          <p className="text-gray-600">Đang tải...</p>
                        </div>
                      ) : speakingItems.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-6xl mb-4">📭</div>
                          <p className="text-gray-600">Chưa có mục luyện tập nào. Nhấn "Thêm mục" để tạo mới.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {speakingItems.map((item, index) => (
                            <div 
                              key={item._id || item.id} 
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
                                  <button 
                                    onClick={() => {
                                      setEditingSpeakingItem(item);
                                      setShowSpeakingItemModal(true);
                                    }}
                                    className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 font-medium"
                                  >
                                    ✏️ Sửa
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteSpeakingItem(item._id)}
                                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 font-medium"
                                  >
                                    🗑️ Xóa
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {speakingItems.length > 0 && (
                      <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
                        Tổng: {speakingItems.length} mục luyện tập
                      </div>
                    )}
                  </div>
                )}

                {/* Speaking Topic Modal */}
                {showSpeakingTopicModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                      <div className="p-6 border-b">
                        <h3 className="text-xl font-bold text-gray-800">
                          {editingSpeakingTopic ? '✏️ Sửa chủ đề' : '➕ Thêm chủ đề mới'}
                        </h3>
                      </div>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const topicData = {
                          id: formData.get('id'),
                          name: formData.get('name'),
                          icon: formData.get('icon'),
                          description: formData.get('description')
                        };
                        if (editingSpeakingTopic) {
                          handleUpdateSpeakingTopic(editingSpeakingTopic.id, topicData);
                        } else {
                          handleCreateSpeakingTopic(topicData);
                        }
                      }}>
                        <div className="p-6 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID chủ đề (tiếng Anh)</label>
                            <input
                              type="text"
                              name="id"
                              defaultValue={editingSpeakingTopic?.id || ''}
                              required
                              disabled={!!editingSpeakingTopic}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                              placeholder="vd: animals, daily, phone"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên chủ đề</label>
                            <input
                              type="text"
                              name="name"
                              defaultValue={editingSpeakingTopic?.name || ''}
                              required
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                              placeholder="vd: Động vật, Hàng ngày"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
                            <input
                              type="text"
                              name="icon"
                              defaultValue={editingSpeakingTopic?.icon || '🎤'}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                              placeholder="🎤"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                            <textarea
                              name="description"
                              defaultValue={editingSpeakingTopic?.description || ''}
                              rows={2}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                              placeholder="Mô tả ngắn về chủ đề"
                            />
                          </div>
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowSpeakingTopicModal(false);
                              setEditingSpeakingTopic(null);
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                          >
                            {editingSpeakingTopic ? 'Cập nhật' : 'Thêm'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Speaking Item Modal */}
                {showSpeakingItemModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                      <div className="p-6 border-b">
                        <h3 className="text-xl font-bold text-gray-800">
                          {editingSpeakingItem ? '✏️ Sửa mục luyện tập' : '➕ Thêm mục luyện tập mới'}
                        </h3>
                      </div>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const itemData = {
                          text: formData.get('text'),
                          meaning: formData.get('meaning')
                        };
                        if (editingSpeakingItem) {
                          handleUpdateSpeakingItem(editingSpeakingItem._id, itemData);
                        } else {
                          handleCreateSpeakingItem(itemData);
                        }
                      }}>
                        <div className="p-6 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Câu tiếng Anh</label>
                            <textarea
                              name="text"
                              defaultValue={editingSpeakingItem?.text || ''}
                              required
                              rows={3}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                              placeholder="vd: Good morning. How are you today?"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nghĩa tiếng Việt</label>
                            <textarea
                              name="meaning"
                              defaultValue={editingSpeakingItem?.meaning || ''}
                              rows={3}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                              placeholder="vd: Chào buổi sáng. Hôm nay bạn khỏe không?"
                            />
                          </div>
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowSpeakingItemModal(false);
                              setEditingSpeakingItem(null);
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                          >
                            {editingSpeakingItem ? 'Cập nhật' : 'Thêm'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Speaking Level Modal */}
                {showSpeakingLevelModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                      <div className="p-6 border-b">
                        <h3 className="text-xl font-bold text-gray-800">
                          {editingSpeakingLevel ? '✏️ Sửa cấp độ' : '➕ Thêm cấp độ mới'}
                        </h3>
                      </div>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const levelData = {
                          id: formData.get('id'),
                          name: formData.get('name'),
                          icon: formData.get('icon'),
                          description: formData.get('description')
                        };
                        if (editingSpeakingLevel) {
                          handleUpdateSpeakingLevel(editingSpeakingLevel.id, levelData);
                        } else {
                          handleCreateSpeakingLevel(levelData);
                        }
                      }}>
                        <div className="p-6 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID cấp độ (tiếng Anh)</label>
                            <input
                              type="text"
                              name="id"
                              defaultValue={editingSpeakingLevel?.id || ''}
                              required
                              disabled={!!editingSpeakingLevel}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                              placeholder="vd: basic, conversation, paragraph"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên cấp độ</label>
                            <input
                              type="text"
                              name="name"
                              defaultValue={editingSpeakingLevel?.name || ''}
                              required
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                              placeholder="vd: Cơ bản, Giao tiếp, Đoạn văn"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
                            <input
                              type="text"
                              name="icon"
                              defaultValue={editingSpeakingLevel?.icon || '🎤'}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                              placeholder="🎤"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                            <textarea
                              name="description"
                              defaultValue={editingSpeakingLevel?.description || ''}
                              rows={2}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                              placeholder="Mô tả ngắn về cấp độ"
                            />
                          </div>
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowSpeakingLevelModal(false);
                              setEditingSpeakingLevel(null);
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                          >
                            {editingSpeakingLevel ? 'Cập nhật' : 'Thêm'}
                          </button>
                        </div>
                      </form>
                    </div>
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
                  <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Người dùng mới đăng ký</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-sm text-gray-600 mb-2">Hôm nay</div>
                      <div className="text-2xl font-bold text-blue-600">{stats.newUsersToday || 0}</div>
                      <div className="text-xs text-gray-500 mt-1">người dùng</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-sm text-gray-600 mb-2">Tuần này</div>
                      <div className="text-2xl font-bold text-green-600">{stats.newUsersThisWeek || 0}</div>
                      <div className="text-xs text-gray-500 mt-1">người dùng</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-sm text-gray-600 mb-2">Tháng này</div>
                      <div className="text-2xl font-bold text-purple-600">{stats.newUsersThisMonth || 0}</div>
                      <div className="text-xs text-gray-500 mt-1">người dùng</div>
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

            {/* Feedbacks Tab */}
            {activeTab === 'feedbacks' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-800">💬 Phản hồi từ người dùng</h2>
                  <p className="text-gray-600 mt-1">Xem và quản lý phản hồi từ người dùng</p>
                </div>
                
                {feedbacks.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-600">Chưa có phản hồi nào</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {feedbacks.map((item) => (
                      <div key={`${item.userId}-${item.feedback._id}`} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-lg">👤</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{item.username}</p>
                              <p className="text-sm text-gray-500">{item.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.feedback.type === 'suggestion' ? 'bg-blue-100 text-blue-700' :
                              item.feedback.type === 'bug' ? 'bg-red-100 text-red-700' :
                              item.feedback.type === 'question' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {item.feedback.type === 'suggestion' ? '💡 Góp ý' :
                               item.feedback.type === 'bug' ? '🐛 Báo lỗi' :
                               item.feedback.type === 'question' ? '❓ Câu hỏi' : '📝 Khác'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.feedback.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              item.feedback.status === 'read' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {item.feedback.status === 'pending' ? '⏳ Chờ xử lý' :
                               item.feedback.status === 'read' ? '👁️ Đã xem' : '✅ Đã xử lý'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="ml-13">
                          <h4 className="font-semibold text-gray-800 mb-2">{item.feedback.subject}</h4>
                          <p className="text-gray-600 mb-3 whitespace-pre-wrap">{item.feedback.message}</p>
                          
                          {/* Admin Reply Display */}
                          {item.feedback.adminReply && (
                            <div className="mb-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                              <p className="text-xs text-green-600 font-semibold mb-1">💬 Phản hồi của bạn:</p>
                              <p className="text-sm text-gray-700">{item.feedback.adminReply}</p>
                            </div>
                          )}
                          
                          {/* Reply Form */}
                          {!item.feedback.adminReply && (
                            <div className="mb-3">
                              <textarea
                                placeholder="Nhập phản hồi cho người dùng..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                rows={2}
                                id={`reply-${item.userId}-${item.feedback._id}`}
                              />
                              <button
                                onClick={() => {
                                  const replyText = document.getElementById(`reply-${item.userId}-${item.feedback._id}`).value;
                                  if (replyText.trim()) {
                                    replyToFeedback(item.userId, item.feedback._id, replyText.trim());
                                  }
                                }}
                                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                              >
                                💬 Gửi phản hồi
                              </button>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                              {new Date(item.feedback.createdAt).toLocaleString('vi-VN')}
                            </p>
                            <div className="flex gap-2">
                              {item.feedback.status === 'pending' && (
                                <button
                                  onClick={() => updateFeedbackStatus(item.userId, item.feedback._id, 'read')}
                                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                >
                                  Đánh dấu đã xem
                                </button>
                              )}
                              {item.feedback.status !== 'resolved' && (
                                <button
                                  onClick={() => updateFeedbackStatus(item.userId, item.feedback._id, 'resolved')}
                                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                >
                                  Đã xử lý
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


            {/* Level Modal */}
            {showLevelModal && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {editingLevel ? '✏️ Sửa cấp độ' : '➕ Thêm cấp độ mới'}
                  </h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const iconInput = document.getElementById('level-icon-input');
                    const iconPreview = document.getElementById('level-icon-preview');
                    
                    // Get icon value - either uploaded image (base64) or emoji text
                    let iconValue = formData.get('icon') || '📚';
                    if (iconPreview && iconPreview.src && iconPreview.src.startsWith('data:image')) {
                      iconValue = iconPreview.src;
                    }
                    
                    const levelData = {
                      id: formData.get('id'),
                      name: formData.get('name'),
                      icon: iconValue,
                      description: formData.get('description'),
                      isActive: formData.get('isActive') === 'on'
                    };
                    if (editingLevel) {
                      handleUpdateLevel(editingLevel.id, levelData);
                    } else {
                      handleCreateLevel(levelData);
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID (không dấu, viết thường)</label>
                      <input
                        name="id"
                        type="text"
                        defaultValue={editingLevel?.id || ''}
                        disabled={!!editingLevel}
                        placeholder="vd: beginner"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên cấp độ</label>
                      <input
                        name="name"
                        type="text"
                        defaultValue={editingLevel?.name || ''}
                        placeholder="vd: Người mới bắt đầu"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                      
                      {/* Icon Preview */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                          {editingLevel?.icon?.startsWith('data:image') ? (
                            <img 
                              id="level-icon-preview"
                              src={editingLevel.icon} 
                              alt="Icon" 
                              className="w-12 h-12 object-contain"
                            />
                          ) : (
                            <span id="level-icon-preview" className="text-3xl">
                              {editingLevel?.icon || '📚'}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Xem trước icon
                        </div>
                      </div>
                      
                      {/* Option 1: Emoji Input */}
                      <div className="mb-3">
                        <label className="block text-xs text-gray-500 mb-1">Nhập emoji:</label>
                        <input
                          name="icon"
                          type="text"
                          defaultValue={editingLevel?.icon?.startsWith('data:image') ? '' : (editingLevel?.icon || '📚')}
                          placeholder="vd: 🌱 📚 🎓"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            const preview = document.getElementById('level-icon-preview');
                            if (preview && e.target.value) {
                              if (preview.tagName === 'IMG') {
                                preview.parentElement.innerHTML = `<span id="level-icon-preview" class="text-3xl">${e.target.value}</span>`;
                              } else {
                                preview.textContent = e.target.value;
                              }
                            }
                          }}
                        />
                      </div>
                      
                      {/* Option 2: Upload Image */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Hoặc chọn hình từ máy:</label>
                        <input
                          id="level-icon-input"
                          type="file"
                          accept="image/*"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const preview = document.getElementById('level-icon-preview');
                                const previewContainer = preview.parentElement;
                                previewContainer.innerHTML = `<img id="level-icon-preview" src="${event.target.result}" alt="Icon" class="w-12 h-12 object-contain" />`;
                                // Clear emoji input when image is selected
                                const emojiInput = document.querySelector('input[name="icon"]');
                                if (emojiInput) emojiInput.value = '';
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <p className="text-xs text-gray-400 mt-1">Hỗ trợ: JPG, PNG, GIF (tối đa 500KB)</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        name="description"
                        defaultValue={editingLevel?.description || ''}
                        placeholder="Mô tả ngắn về cấp độ..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        name="isActive"
                        type="checkbox"
                        defaultChecked={editingLevel?.isActive !== false}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label className="text-sm text-gray-700">Hiển thị cho người dùng</label>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                      >
                        {editingLevel ? '💾 Cập nhật' : '➕ Thêm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowLevelModal(false); setEditingLevel(null); }}
                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Topic Modal */}
            {showTopicModal && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {editingTopic ? '✏️ Sửa chủ đề' : '➕ Thêm chủ đề mới'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Cấp độ: <span className="font-semibold text-blue-600">{selectedLevel}</span></p>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const topicIconPreview = document.getElementById('topic-icon-preview');
                    
                    // Get icon value - either uploaded image (base64) or emoji text
                    let iconValue = formData.get('topicIcon') || '📖';
                    if (topicIconPreview && topicIconPreview.src && topicIconPreview.src.startsWith('data:image')) {
                      iconValue = topicIconPreview.src;
                    }
                    
                    const topicData = {
                      id: formData.get('topicId'),
                      name: formData.get('topicName'),
                      icon: iconValue,
                      description: formData.get('topicDescription'),
                      isActive: formData.get('topicIsActive') === 'on'
                    };
                    if (editingTopic) {
                      handleUpdateTopic(editingTopic.id, topicData);
                    } else {
                      handleCreateTopic(topicData);
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID (không dấu, viết thường)</label>
                      <input
                        name="topicId"
                        type="text"
                        defaultValue={editingTopic?.id || ''}
                        disabled={!!editingTopic}
                        placeholder="vd: animals, fruits, colors"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên chủ đề</label>
                      <input
                        name="topicName"
                        type="text"
                        defaultValue={editingTopic?.name || ''}
                        placeholder="vd: Động vật, Trái cây, Màu sắc"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                      
                      {/* Icon Preview */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                          {editingTopic?.icon?.startsWith('data:image') ? (
                            <img 
                              id="topic-icon-preview"
                              src={editingTopic.icon} 
                              alt="Icon" 
                              className="w-10 h-10 object-contain"
                            />
                          ) : (
                            <span id="topic-icon-preview" className="text-2xl">
                              {editingTopic?.icon || '📖'}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">Xem trước</div>
                      </div>
                      
                      {/* Emoji Input */}
                      <div className="mb-3">
                        <label className="block text-xs text-gray-500 mb-1">Nhập emoji:</label>
                        <input
                          name="topicIcon"
                          type="text"
                          defaultValue={editingTopic?.icon?.startsWith('data:image') ? '' : (editingTopic?.icon || '📖')}
                          placeholder="vd: 🐾 🍎 🎨"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            const preview = document.getElementById('topic-icon-preview');
                            if (preview && e.target.value) {
                              if (preview.tagName === 'IMG') {
                                preview.parentElement.innerHTML = `<span id="topic-icon-preview" class="text-2xl">${e.target.value}</span>`;
                              } else {
                                preview.textContent = e.target.value;
                              }
                            }
                          }}
                        />
                      </div>
                      
                      {/* Upload Image */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Hoặc chọn hình từ máy:</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const preview = document.getElementById('topic-icon-preview');
                                const previewContainer = preview.parentElement;
                                previewContainer.innerHTML = `<img id="topic-icon-preview" src="${event.target.result}" alt="Icon" class="w-10 h-10 object-contain" />`;
                                const emojiInput = document.querySelector('input[name="topicIcon"]');
                                if (emojiInput) emojiInput.value = '';
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        name="topicDescription"
                        defaultValue={editingTopic?.description || ''}
                        placeholder="Mô tả ngắn về chủ đề..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        name="topicIsActive"
                        type="checkbox"
                        defaultChecked={editingTopic?.isActive !== false}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label className="text-sm text-gray-700">Hiển thị cho người dùng</label>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                      >
                        {editingTopic ? '💾 Cập nhật' : '➕ Thêm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowTopicModal(false); setEditingTopic(null); }}
                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Flashcard Modal */}
            {showFlashcardFormModal && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {editingFlashcard ? '✏️ Sửa flashcard' : '➕ Thêm flashcard mới'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Cấp độ: <span className="font-semibold text-blue-600">{selectedLevel}</span> | 
                    Chủ đề: <span className="font-semibold text-green-600">{selectedTopic?.name || selectedTopic?.id}</span>
                  </p>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const flashcardImagePreview = document.getElementById('flashcard-image-preview');
                    
                    // Get image value - either uploaded image (base64) or emoji text
                    let imageValue = formData.get('flashcardImage') || '';
                    if (flashcardImagePreview && flashcardImagePreview.src && flashcardImagePreview.src.startsWith('data:image')) {
                      imageValue = flashcardImagePreview.src;
                    }
                    
                    const flashcardData = {
                      word: formData.get('word'),
                      meaning: formData.get('meaning'),
                      example: formData.get('example'),
                      exampleTranslation: formData.get('exampleTranslation'),
                      pronunciation: formData.get('pronunciation'),
                      image: imageValue
                    };
                    if (editingFlashcard) {
                      handleUpdateFlashcard(editingFlashcard._id, flashcardData);
                    } else {
                      handleCreateFlashcard(flashcardData);
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Từ vựng <span className="text-red-500">*</span></label>
                      <input
                        name="word"
                        type="text"
                        defaultValue={editingFlashcard?.word || ''}
                        placeholder="vd: Apple, Hello, Beautiful"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nghĩa <span className="text-red-500">*</span></label>
                      <input
                        name="meaning"
                        type="text"
                        defaultValue={editingFlashcard?.meaning || ''}
                        placeholder="vd: Quả táo, Xin chào, Đẹp"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phát âm</label>
                      <input
                        name="pronunciation"
                        type="text"
                        defaultValue={editingFlashcard?.pronunciation || ''}
                        placeholder="vd: /ˈæp.əl/, /həˈloʊ/"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ví dụ (tiếng Anh)</label>
                      <textarea
                        name="example"
                        defaultValue={editingFlashcard?.example || ''}
                        placeholder="vd: I eat an apple every day."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dịch ví dụ (tiếng Việt)</label>
                      <textarea
                        name="exampleTranslation"
                        defaultValue={editingFlashcard?.exampleTranslation || ''}
                        placeholder="vd: Tôi ăn một quả táo mỗi ngày."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
                      
                      {/* Image Preview */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                          {editingFlashcard?.image?.startsWith('data:image') ? (
                            <img 
                              id="flashcard-image-preview"
                              src={editingFlashcard.image} 
                              alt="Preview" 
                              className="w-14 h-14 object-contain"
                            />
                          ) : editingFlashcard?.image ? (
                            <span id="flashcard-image-preview" className="text-3xl">
                              {editingFlashcard.image}
                            </span>
                          ) : (
                            <span id="flashcard-image-preview" className="text-3xl text-gray-300">
                              🖼️
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">Xem trước</div>
                      </div>
                      
                      {/* Emoji Input */}
                      <div className="mb-3">
                        <label className="block text-xs text-gray-500 mb-1">Nhập emoji:</label>
                        <input
                          name="flashcardImage"
                          type="text"
                          defaultValue={editingFlashcard?.image?.startsWith('data:image') ? '' : (editingFlashcard?.image || '')}
                          placeholder="vd: 🍎 🐱 📚"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            const preview = document.getElementById('flashcard-image-preview');
                            if (preview && e.target.value) {
                              if (preview.tagName === 'IMG') {
                                preview.parentElement.innerHTML = `<span id="flashcard-image-preview" class="text-3xl">${e.target.value}</span>`;
                              } else {
                                preview.textContent = e.target.value;
                              }
                            }
                          }}
                        />
                      </div>
                      
                      {/* Upload Image */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Hoặc chọn hình từ máy:</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const preview = document.getElementById('flashcard-image-preview');
                                const previewContainer = preview.parentElement;
                                previewContainer.innerHTML = `<img id="flashcard-image-preview" src="${event.target.result}" alt="Preview" class="w-14 h-14 object-contain" />`;
                                const emojiInput = document.querySelector('input[name="flashcardImage"]');
                                if (emojiInput) emojiInput.value = '';
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                      >
                        {editingFlashcard ? '💾 Cập nhật' : '➕ Thêm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowFlashcardFormModal(false); setEditingFlashcard(null); }}
                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Quiz Question Modal */}
            {showQuizFormModal && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {editingQuizQuestion ? '✏️ Sửa câu hỏi' : '➕ Thêm câu hỏi mới'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Cấp độ: <span className="font-semibold text-purple-600">{selectedLevel}</span>
                  </p>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    
                    // Build options array
                    const options = [];
                    const correctAnswer = formData.get('correctAnswer');
                    for (let i = 0; i < 4; i++) {
                      const text = formData.get(`option${i}`);
                      const textVi = formData.get(`optionVi${i}`);
                      if (text) {
                        options.push({
                          text,
                          textVi: textVi || '',
                          isCorrect: correctAnswer === String(i)
                        });
                      }
                    }
                    
                    const questionData = {
                      question: formData.get('question'),
                      questionVi: formData.get('questionVi'),
                      options,
                      category: formData.get('category') || 'general',
                      explanation: formData.get('explanation') || ''
                    };
                    
                    if (editingQuizQuestion) {
                      handleUpdateQuizQuestion(editingQuizQuestion._id, questionData);
                    } else {
                      handleCreateQuizQuestion(questionData);
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Câu hỏi (tiếng Anh) <span className="text-red-500">*</span></label>
                      <input
                        name="question"
                        type="text"
                        defaultValue={editingQuizQuestion?.question || ''}
                        placeholder="vd: What color is the sky?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Câu hỏi (tiếng Việt) <span className="text-red-500">*</span></label>
                      <input
                        name="questionVi"
                        type="text"
                        defaultValue={editingQuizQuestion?.questionVi || ''}
                        placeholder="vd: Bầu trời có màu gì?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
                      <input
                        name="category"
                        type="text"
                        defaultValue={editingQuizQuestion?.category || ''}
                        placeholder="vd: colors, animals, family"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    {/* Options */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Đáp án (chọn đáp án đúng) <span className="text-red-500">*</span></label>
                      {[0, 1, 2, 3].map((idx) => {
                        const option = editingQuizQuestion?.options?.[idx];
                        const isCorrect = option?.isCorrect;
                        return (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <input
                              type="radio"
                              name="correctAnswer"
                              value={idx}
                              defaultChecked={isCorrect || (!editingQuizQuestion && idx === 0)}
                              className="mt-2 w-4 h-4 text-green-600"
                            />
                            <div className="flex-1 space-y-2">
                              <input
                                name={`option${idx}`}
                                type="text"
                                defaultValue={option?.text || ''}
                                placeholder={`Đáp án ${String.fromCharCode(65 + idx)} (tiếng Anh)`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                                required={idx < 2}
                              />
                              <input
                                name={`optionVi${idx}`}
                                type="text"
                                defaultValue={option?.textVi || ''}
                                placeholder={`Đáp án ${String.fromCharCode(65 + idx)} (tiếng Việt)`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                              />
                            </div>
                          </div>
                        );
                      })}
                      <p className="text-xs text-gray-500">💡 Chọn radio button bên trái để đánh dấu đáp án đúng</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giải thích (tùy chọn)</label>
                      <textarea
                        name="explanation"
                        defaultValue={editingQuizQuestion?.explanation || ''}
                        placeholder="Giải thích tại sao đáp án đó đúng..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                      >
                        {editingQuizQuestion ? '💾 Cập nhật' : '➕ Thêm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowQuizFormModal(false); setEditingQuizQuestion(null); }}
                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && adminInfo && (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <span className="text-5xl">👨‍💼</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{adminInfo.username}</h2>
                      <p className="text-blue-200">{adminInfo.email}</p>
                      <span className="inline-block mt-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                        ⚙️ Quản trị viên
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thông tin cơ bản */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Tên người dùng</p>
                      <p className="text-lg font-semibold text-gray-800">{adminInfo.username}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="text-lg font-semibold text-gray-800">{adminInfo.email}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Quyền</p>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                        {adminInfo.role === 'admin' ? '⚙️ Quản trị viên' : '👤 Người dùng'}
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                        ✓ Hoạt động
                      </span>
                    </div>
                  </div>
                </div>

                {/* Đổi mật khẩu */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">🔐 Đổi mật khẩu</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập mật khẩu hiện tại"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập lại mật khẩu mới"
                        required
                      />
                    </div>

                    {passwordError && (
                      <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        ❌ {passwordError}
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                        ✅ {passwordSuccess}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      💾 Đổi mật khẩu
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
