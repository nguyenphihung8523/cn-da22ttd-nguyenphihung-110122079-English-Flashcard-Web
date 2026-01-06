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
              <span className="text-blue-200">
                👤 {adminInfo.username}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              🚪 Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⚙️ Quản lý Hệ thống</h1>
          <p className="text-gray-600">Quản lý cấp độ, chủ đề, flashcards, người dùng và nội dung học tập</p>
        </div>

        {/* Admin Profile Info */}
        {adminInfo && !showAdminProfile && (
          <div className="mb-8 bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">👤 Thông tin hồ sơ</h2>
                <div className="space-y-2">
                  <p className="text-gray-700"><span className="font-semibold">Tên:</span> {adminInfo.username}</p>
                  <p className="text-gray-700"><span className="font-semibold">Email:</span> {adminInfo.email}</p>
                  <p className="text-gray-700"><span className="font-semibold">Quyền:</span> <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold text-sm">{adminInfo.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</span></p>
                </div>
              </div>
              <div className="text-right">
                <button
                  onClick={() => setShowAdminProfile(true)}
                  className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <span className="text-2xl font-bold text-white">👨‍💼</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Profile Page */}
        {showAdminProfile && adminInfo && (
          <div className="mb-8">
            <button
              onClick={() => setShowAdminProfile(false)}
              className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-semibold"
            >
              ← Quay lại
            </button>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <span className="text-5xl">👨‍💼</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{adminInfo.username}</h1>
                    <p className="text-blue-100 text-lg">{adminInfo.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Thông tin cơ bản */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Thông tin cơ bản</h2>
                    <div className="space-y-4">
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
                        <p className="text-lg font-semibold">
                          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                            {adminInfo.role === 'admin' ? '⚙️ Quản trị viên' : '👤 Người dùng'}
                          </span>
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                        <p className="text-lg font-semibold">
                          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                            ✓ Hoạt động
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Thống kê */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Thống kê</h2>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                        <p className="text-sm text-gray-600 mb-1">Tổng người dùng</p>
                        <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                        <p className="text-sm text-gray-600 mb-1">Người dùng hoạt động</p>
                        <p className="text-3xl font-bold text-green-600">{stats?.activeUsers || 0}</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600">
                        <p className="text-sm text-gray-600 mb-1">Quản trị viên</p>
                        <p className="text-3xl font-bold text-purple-600">{stats?.adminUsers || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mô tả vai trò */}
                <div className="mt-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">🔐 Vai trò Quản trị viên</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Quản lý người dùng (xem, sửa, xóa, thay đổi quyền)</li>
                    <li>✓ Quản lý flashcards (thêm, sửa, xóa)</li>
                    <li>✓ Quản lý cấp độ và chủ đề</li>
                    <li>✓ Quản lý nội dung luyện nói</li>
                    <li>✓ Xem báo cáo và thống kê hệ thống</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        {!showAdminProfile && (
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
              📇 Flashcards
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
        )}

        {/* Content */}
        {!showAdminProfile && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải dữ liệu...</p>
              </div>
            ) : (
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
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Đang tải dữ liệu người dùng...</p>
                  </div>
                ) : users.length === 0 ? (
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
                {/* Level Management */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">📚 Quản lý Cấp độ</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-6">
                    {['Cơ bản', 'Trung cấp', 'Nâng cao', 'Giao tiếp', 'Chuyên ngành'].map((level, idx) => (
                      <div key={idx} className="border-2 border-blue-300 rounded-lg p-4 hover:shadow-lg transition">
                        <h3 className="font-bold text-gray-800 mb-3">{level}</h3>
                        <div className="space-y-2 mb-3">
                          <p className="text-sm text-gray-600">📇 Flashcards: 50</p>
                          <p className="text-sm text-gray-600">📝 Chủ đề: 4</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">Sửa</button>
                          <button className="flex-1 px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">Xóa</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Topic Management */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">🏷️ Quản lý Chủ đề</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Chủ đề</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cấp độ</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Flashcards</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Màu sắc', level: 'Cơ bản', count: 8 },
                          { name: 'Số đếm', level: 'Cơ bản', count: 10 },
                          { name: 'Gia đình', level: 'Cơ bản', count: 8 },
                          { name: 'Công việc', level: 'Trung cấp', count: 12 },
                          { name: 'Thời tiết', level: 'Trung cấp', count: 10 }
                        ].map((topic, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">{topic.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{topic.level}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                                {topic.count}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm space-x-2">
                              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">✏️ Sửa</button>
                              <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">🗑️ Xóa</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Flashcard Management */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">📇 Quản lý Flashcards</h2>
                  </div>
                  <div className="p-6 mb-4 bg-gray-50 flex gap-4">
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm flashcard..." 
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Tất cả cấp độ</option>
                      <option>Cơ bản</option>
                      <option>Trung cấp</option>
                      <option>Nâng cao</option>
                    </select>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Từ vựng</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nghĩa</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cấp độ</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Chủ đề</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flashcards.slice(0, 15).map((card) => (
                          <tr key={card._id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">{card.word}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{card.meaning}</td>
                            <td className="px-6 py-4 text-sm">{card.level}</td>
                            <td className="px-6 py-4 text-sm">{card.topic}</td>
                            <td className="px-6 py-4 text-sm space-x-2">
                              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">✏️ Sửa</button>
                              <button 
                                onClick={() => deleteFlashcard(card._id)}
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
                  <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
                    Hiển thị 15 / {flashcards.length} flashcards
                  </div>
                </div>
              </div>
            )}

            {/* Speaking Tab */}
            {activeTab === 'speaking' && (
              <div className="space-y-6">
                {/* Speaking Levels */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">🎤 Quản lý Cấp độ Luyện nói</h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
                      ➕ Thêm cấp độ
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                    {[
                      { name: 'Cơ bản', topics: 4, items: 32 },
                      { name: 'Giao tiếp', topics: 4, items: 32 },
                      { name: 'Đoạn văn', topics: 3, items: 24 }
                    ].map((level, idx) => (
                      <div key={idx} className="border-2 border-purple-300 rounded-lg p-4 hover:shadow-lg transition">
                        <h3 className="font-bold text-gray-800 mb-3">{level.name}</h3>
                        <div className="space-y-2 mb-3">
                          <p className="text-sm text-gray-600">📝 Chủ đề: {level.topics}</p>
                          <p className="text-sm text-gray-600">🎯 Mục luyện tập: {level.items}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">Sửa</button>
                          <button className="flex-1 px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">Xóa</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Speaking Topics */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">📚 Quản lý Chủ đề Luyện nói</h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
                      ➕ Thêm chủ đề
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Chủ đề</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cấp độ</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mục luyện tập</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Động vật', level: 'Cơ bản', items: 8 },
                          { name: 'Trái cây', level: 'Cơ bản', items: 8 },
                          { name: 'Hàng ngày', level: 'Giao tiếp', items: 8 },
                          { name: 'Mua sắm', level: 'Giao tiếp', items: 8 },
                          { name: 'Kinh doanh', level: 'Đoạn văn', items: 8 }
                        ].map((topic, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">{topic.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{topic.level}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                                {topic.items}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm space-x-2">
                              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">✏️ Sửa</button>
                              <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">🗑️ Xóa</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Speaking Content Items */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">🎯 Quản lý Mục Luyện tập</h2>
                  </div>
                  <div className="p-6 mb-4 bg-gray-50 flex gap-4">
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm mục luyện tập..." 
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Tất cả cấp độ</option>
                      <option>Cơ bản</option>
                      <option>Giao tiếp</option>
                      <option>Đoạn văn</option>
                    </select>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nội dung</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Chủ đề</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cấp độ</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { text: 'Cat', topic: 'Động vật', level: 'Cơ bản' },
                          { text: 'Dog', topic: 'Động vật', level: 'Cơ bản' },
                          { text: 'Good morning', topic: 'Hàng ngày', level: 'Giao tiếp' },
                          { text: 'How are you?', topic: 'Hàng ngày', level: 'Giao tiếp' }
                        ].map((item, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">{item.text}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{item.topic}</td>
                            <td className="px-6 py-4 text-sm">{item.level}</td>
                            <td className="px-6 py-4 text-sm space-x-2">
                              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">✏️ Sửa</button>
                              <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">🗑️ Xóa</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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
