import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, userRes] = await Promise.all([
        API.get('/learning/stats'),
        API.get('/user/profile')
      ]);
      
      setStats(statsRes.data);
      setUser(userRes.data);
    } catch (err) {
      console.error('Dashboard loading error:', err);
      setError(err);
      
      // If authentication error, redirect to login
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      // Set default values for other errors
      setStats({
        totalWordsLearned: 0,
        totalSpeakingPractices: 0,
        todayActivities: 0,
        todaySpeaking: 0
      });
      setUser({
        username: 'Người dùng',
        email: ''
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error && !stats && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">Không thể tải dữ liệu. Vui lòng thử lại.</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Xin chào, {user.username}! 👋</h1>
        <p className="text-xl opacity-90">Chào mừng bạn quay trở lại với English Flashcard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Tổng từ đã học</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalWordsLearned}</p>
            </div>
            <div className="text-5xl">📚</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Lần luyện nói</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalSpeakingPractices}</p>
            </div>
            <div className="text-5xl">🎤</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Hoạt động hôm nay</p>
              <p className="text-3xl font-bold text-gray-800">{stats.todayActivities}</p>
            </div>
            <div className="text-5xl">✨</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Luyện nói hôm nay</p>
              <p className="text-3xl font-bold text-gray-800">{stats.todaySpeaking}</p>
            </div>
            <div className="text-5xl">🔥</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bắt đầu học ngay</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/learn"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-blue-500"
          >
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Học từ vựng</h3>
            <p className="text-gray-600">Học flashcard với lật thẻ và phát âm</p>
          </Link>

          <Link
            to="/speaking"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-green-500"
          >
            <div className="text-5xl mb-4">🎤</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Luyện phát âm</h3>
            <p className="text-gray-600">Thực hành phát âm với AI</p>
          </Link>

          <Link
            to="/favorites"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-yellow-500"
          >
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Từ yêu thích</h3>
            <p className="text-gray-600">Xem lại các từ đã đánh dấu</p>
          </Link>

          <Link
            to="/mistakes"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-red-500"
          >
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Ôn tập</h3>
            <p className="text-gray-600">Ôn lại từ phát âm sai</p>
          </Link>

          <Link
            to="/stats"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-purple-500"
          >
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Thống kê</h3>
            <p className="text-gray-600">Xem tiến độ học tập của bạn</p>
          </Link>

          <Link
            to="/flashcards"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-indigo-500"
          >
            <div className="text-5xl mb-4">📇</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Quản lý Flashcards</h3>
            <p className="text-gray-600">Tạo và quản lý bộ thẻ của bạn</p>
          </Link>


        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white text-center">
        <p className="text-2xl font-semibold mb-2">💪 "The expert in anything was once a beginner."</p>
        <p className="text-lg opacity-90">Hãy tiếp tục học tập mỗi ngày!</p>
      </div>
    </div>
  );
}
