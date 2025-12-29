import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { loadVoices } from '../utils/speechHelper';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [voiceGender, setVoiceGender] = useState('female');
  const [voiceAccent, setVoiceAccent] = useState('us');
  const [showImages, setShowImages] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('Loading user settings...');
      const res = await API.get('/user/profile');
      console.log('Settings loaded:', res.data);
      setUser(res.data);
      setVoiceGender(res.data.settings?.voiceGender || 'female');
      setVoiceAccent(res.data.settings?.voiceAccent || 'us');
      setShowImages(res.data.settings?.showImages !== false); // Default true
      loadVoices(); // Load voices
    } catch (err) {
      console.error('Error loading settings:', err);
      console.error('Error details:', err.response?.data);
      
      // Nếu token hết hạn, chuyển về trang login
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
        return;
      }
      
      // Set default values if API fails
      setUser({ username: 'User', email: 'user@example.com' });
      setVoiceGender('female');
      setVoiceAccent('us');
      setShowImages(true);
      alert('Không thể tải cài đặt. Vui lòng kiểm tra kết nối mạng và thử lại.');
    }
  };

  const handleSaveSettings = async () => {
    try {
      console.log('Đang lưu cài đặt:', { voiceGender, voiceAccent, showImages });
      const response = await API.put('/user/settings', {
        voiceGender,
        voiceAccent,
        showImages
      });
      console.log('Response:', response.data);
      alert('Lưu cài đặt thành công');
      loadSettings();
    } catch (err) {
      console.error('Lỗi lưu cài đặt:', err);
      console.error('Error response:', err.response?.data);
      alert('Lỗi lưu cài đặt: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleLogoutAllDevices = async () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất khỏi tất cả thiết bị?')) {
      try {
        await API.post('/user/logout-all');
        localStorage.removeItem('token');
        navigate('/login');
      } catch (err) {
        alert('Lỗi đăng xuất');
      }
    }
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⚙️ Cài đặt</h1>
          <p className="text-gray-600">Tùy chỉnh trải nghiệm học tập của bạn</p>
        </div>

        <div className="space-y-6">
          {/* Cài đặt học tập */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🎓 Cài đặt học tập</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Giọng phát âm</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Giới tính giọng nói</label>
                    <select
                      value={voiceGender}
                      onChange={(e) => setVoiceGender(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="male">👨 Nam</option>
                      <option value="female">👩 Nữ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Giọng địa phương</label>
                    <select
                      value={voiceAccent}
                      onChange={(e) => setVoiceAccent(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="us">🇺🇸 Anh - Mỹ</option>
                      <option value="uk">🇬🇧 Anh - Anh</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">Hiển thị hình minh họa</p>
                    <p className="text-sm text-gray-600 mt-1">Bật/tắt emoji và hình ảnh trên flashcard</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showImages}
                      onChange={(e) => setShowImages(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg shadow-lg transform hover:scale-105 transition-all"
              >
                💾 Lưu cài đặt
              </button>
            </div>
          </div>

          {/* Quản lý bảo mật */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🛡️ Quản lý bảo mật</h2>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-green-800 font-semibold">Đang đăng nhập</p>
                    <p className="text-sm text-green-600">Phiên đăng nhập của bạn đang hoạt động</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold shadow-lg transform hover:scale-105 transition-all"
                >
                  🚪 Đăng xuất
                </button>
                <button
                  onClick={handleLogoutAllDevices}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold shadow-lg transform hover:scale-105 transition-all"
                >
                  🔐 Đăng xuất tất cả thiết bị
                </button>
              </div>
            </div>
          </div>

          {/* Thông tin ứng dụng */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">ℹ️ Thông tin ứng dụng</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Phiên bản:</span> 1.0.0</p>
              <p><span className="font-semibold">Ngày cập nhật:</span> {new Date().toLocaleDateString('vi-VN')}</p>
              <p><span className="font-semibold">Người dùng:</span> {user.username}</p>
              <p className="pt-3 border-t border-white border-opacity-30">
                © 2024 English Flashcard. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
