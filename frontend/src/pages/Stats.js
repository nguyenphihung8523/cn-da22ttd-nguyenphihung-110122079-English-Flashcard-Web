import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [speakingStats, setSpeakingStats] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadUser();
    loadStats();
    loadSpeakingStats();
    loadHistory();
  }, []);

  const loadUser = async () => {
    try {
      const res = await API.get('/user/profile');
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadStats = async () => {
    try {
      const res = await API.get('/learning/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSpeakingStats = async () => {
    try {
      const res = await API.get('/speaking/progress');
      setSpeakingStats(res.data.progress);
    } catch (err) {
      console.error(err);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await API.get('/learning/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Thống kê học tập và luyện nói</h2>

      {/* Tổng quan - Learning Stats */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">📚 Thống kê học tập</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Tổng từ đã học</p>
            <p className="text-4xl font-bold">{stats.totalWordsLearned || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Hoạt động hôm nay</p>
            <p className="text-4xl font-bold">{stats.todayActivities || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Cấp độ đã mở khóa</p>
            <p className="text-4xl font-bold">{user?.unlockedLevels?.length || 1}/5</p>
          </div>
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Điểm cao nhất</p>
            <p className="text-4xl font-bold">{Math.max(...Object.values(user?.levelScores || {0: 0})) || 0}</p>
          </div>
        </div>
      </div>

      {/* Tổng quan - Speaking Stats */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">🎤 Thống kê luyện nói</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Tổng phiên luyện</p>
            <p className="text-4xl font-bold">{speakingStats?.totalSessions || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Chủ đề hoàn thành</p>
            <p className="text-4xl font-bold">{speakingStats?.completedTopics?.length || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-lime-500 to-lime-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Thời gian luyện (phút)</p>
            <p className="text-4xl font-bold">{Math.round(speakingStats?.totalPracticeTime / 60) || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Luyện nói hôm nay</p>
            <p className="text-4xl font-bold">{stats.todaySpeaking || 0}</p>
          </div>
        </div>
      </div>

      {/* Ngày học gần nhất */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">📅 Hoạt động gần nhất</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">📚</div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Lần học gần nhất</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.lastStudyDate 
                    ? new Date(stats.lastStudyDate).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Chưa có dữ liệu'}
                </p>
                {stats.lastStudyDate && (
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(stats.lastStudyDate).toLocaleTimeString('vi-VN')}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎤</div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Lần luyện nói gần nhất</p>
                <p className="text-2xl font-bold text-gray-800">
                  {speakingStats?.lastPracticeDate
                    ? new Date(speakingStats.lastPracticeDate).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Chưa có dữ liệu'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chủ đề hoàn thành */}
      {speakingStats?.completedTopics && speakingStats.completedTopics.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">🏆 Chủ đề luyện nói hoàn thành</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {speakingStats.completedTopics.map((topic, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500">
                <p className="font-semibold text-gray-800">{topic.level} - {topic.topic}</p>
                <p className="text-sm text-gray-600 mt-1">Điểm: {topic.averageScore}%</p>
                <p className="text-sm text-gray-600">Lần luyện: {topic.totalAttempts}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lịch sử học tập */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">📝 Lịch sử hoạt động gần đây</h3>
        {history.length === 0 ? (
          <p className="text-gray-600">Chưa có lịch sử hoạt động</p>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 20).map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3 hover:bg-gray-50 p-2 rounded transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.flashcard?.word || item.level || 'N/A'}</p>
                  <p className="text-sm text-gray-600">
                    {item.activityType === 'view' && '👁️ Đã xem'}
                    {item.activityType === 'speaking_correct' && '✅ Phát âm đúng'}
                    {item.activityType === 'speaking_incorrect' && '❌ Phát âm sai'}
                    {item.activityType === 'topic_completed' && '🎉 Hoàn thành chủ đề'}
                    {item.spokenText && ` - Đã nói: "${item.spokenText}"`}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(item.timestamp).toLocaleString('vi-VN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
