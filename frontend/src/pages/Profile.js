import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  // Password states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  useEffect(() => {
    checkPasswordStrength(newPassword);
  }, [newPassword]);

  const loadProfile = async () => {
    try {
      const res = await API.get('/user/profile');
      setUser(res.data);
      setUsername(res.data.username);
      setEmail(res.data.email);
      setGender(res.data.gender || '');
      setBirthDate(res.data.birthDate || '');
      setAvatar(res.data.avatar || '');
      setAvatarPreview(res.data.avatar || '');
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

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength('');
      return;
    }
    if (password.length < 6) {
      setPasswordStrength('Yếu');
    } else if (password.length < 10) {
      setPasswordStrength('Trung bình');
    } else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      setPasswordStrength('Mạnh');
    } else {
      setPasswordStrength('Trung bình');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
        setAvatar(e.target.result); // Set base64 as avatar
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUrlChange = (e) => {
    const url = e.target.value;
    setAvatar(url);
    setAvatarPreview(url);
    setAvatarFile(null); // Clear file if URL is used
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await API.put('/user/profile', { 
        username, 
        gender, 
        birthDate,
        avatar
      });
      alert('Cập nhật thành công');
      setEditing(false);
      loadProfile();
    } catch (err) {
      alert('Lỗi cập nhật: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }
    if (newPassword.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    try {
      await API.post('/user/change-password', { oldPassword, newPassword });
      alert('Đổi mật khẩu thành công');
      setChangingPassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi đổi mật khẩu');
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

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 'Yếu') return 'text-red-600';
    if (passwordStrength === 'Trung bình') return 'text-yellow-600';
    if (passwordStrength === 'Mạnh') return 'text-green-600';
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">👤 Hồ sơ cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Thông tin tài khoản */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📋 Thông tin tài khoản</h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ✏️ Chỉnh sửa
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Họ tên</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email (không thể thay đổi)</label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Giới tính</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày sinh</label>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  {/* Avatar Section */}
                  <div className="col-span-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Ảnh đại diện</label>
                    
                    {/* Avatar Preview */}
                    <div className="flex items-center gap-6 mb-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                          username.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">Chọn ảnh từ máy tính hoặc nhập URL</p>
                        <p className="text-xs text-gray-500">Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF</p>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tải ảnh từ máy tính</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>

                    {/* URL Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hoặc nhập URL ảnh</label>
                      <input
                        type="text"
                        value={avatar.startsWith('data:') ? '' : avatar}
                        onChange={handleAvatarUrlChange}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                      💾 Lưu thay đổi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setUsername(user.username);
                        setGender(user.gender || '');
                        setBirthDate(user.birthDate || '');
                        setAvatar(user.avatar || '');
                        setAvatarPreview(user.avatar || '');
                        setAvatarFile(null);
                      }}
                      className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold"
                    >
                      ❌ Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{user.username}</h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Giới tính</p>
                      <p className="font-semibold text-gray-800">
                        {gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : gender === 'other' ? 'Khác' : 'Chưa cập nhật'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Ngày sinh</p>
                      <p className="font-semibold text-gray-800">{birthDate || 'Chưa cập nhật'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Ngày tạo tài khoản</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Loại tài khoản</p>
                      <p className="font-semibold text-gray-800">
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Đổi mật khẩu */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">🔒 Đổi mật khẩu</h2>
                {!changingPassword && (
                  <button
                    onClick={() => setChangingPassword(true)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    🔑 Đổi mật khẩu
                  </button>
                )}
              </div>

              {changingPassword ? (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu cũ</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    {passwordStrength && (
                      <p className={`text-sm mt-1 font-semibold ${getPasswordStrengthColor()}`}>
                        Độ mạnh: {passwordStrength}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                      💾 Đổi mật khẩu
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChangingPassword(false);
                        setOldPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold"
                    >
                      ❌ Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-600">Nhấn nút "Đổi mật khẩu" để thay đổi mật khẩu của bạn</p>
              )}
            </div>
          </div>

          {/* Right Column - Shortcuts */}
          <div className="space-y-6">
            {/* Liên kết nhanh */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🔗 Liên kết nhanh</h2>
              <div className="space-y-3">
                <Link
                  to="/favorites"
                  className="flex items-center justify-between p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⭐</span>
                    <span className="font-semibold text-gray-800">Từ yêu thích</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600">→</span>
                </Link>
                <Link
                  to="/mistakes"
                  className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📝</span>
                    <span className="font-semibold text-gray-800">Từ cần ôn tập</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600">→</span>
                </Link>
                <Link
                  to="/stats"
                  className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📈</span>
                    <span className="font-semibold text-gray-800">Tiến độ học</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600">→</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚙️</span>
                    <span className="font-semibold text-gray-800">Cài đặt</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600">→</span>
                </Link>
              </div>
            </div>

            {/* Tiến độ tổng quan */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">🎯 Tiến độ tổng quan</h2>
              <div className="space-y-4">
                {/* Learning Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>📚 Cấp độ học tập</span>
                    <span className="font-bold">{user.unlockedLevels?.length || 1}/5</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-300"
                      style={{ width: `${((user.unlockedLevels?.length || 1) / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Speaking Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>🎤 Cấp độ luyện nói</span>
                    <span className="font-bold">{stats?.speakingLevels || 1}/3</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-300"
                      style={{ width: `${((stats?.speakingLevels || 1) / 3) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Achievements */}
                <div className="pt-3 border-t border-white border-opacity-30">
                  <p className="text-sm opacity-90 mb-3">🏆 Thành tích</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-white bg-opacity-20 rounded p-2">
                      <p className="opacity-90">Điểm cao nhất</p>
                      <p className="font-bold text-lg">{Math.max(...Object.values(user.levelScores || {0: 0}))} / 100</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded p-2">
                      <p className="opacity-90">Phiên luyện nói</p>
                      <p className="font-bold text-lg">{stats?.speakingSessions || 0}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded p-2">
                      <p className="opacity-90">Từ vựng học</p>
                      <p className="font-bold text-lg">{stats?.totalCards || 0}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded p-2">
                      <p className="opacity-90">Độ chính xác TB</p>
                      <p className="font-bold text-lg">{stats?.averageAccuracy || 0}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
