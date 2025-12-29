import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register(){
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      alert('Đăng ký thành công. Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi đăng ký');
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex flex-col justify-center px-4 py-4">
      <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-md mx-auto flex-shrink-0">
        {/* Logo and Title */}
        <div className="text-center mb-3">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg mx-auto mb-2">
            <span className="text-xl font-bold text-white">EF</span>
          </div>
          <h1 className="text-base font-bold text-gray-800">English Flashcard</h1>
          <p className="text-sm text-gray-600">Tạo tài khoản mới</p>
        </div>

        {/* Register Form */}
        <form onSubmit={submit} className="space-y-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tên người dùng</label>
            <input 
              type="text"
              value={username} 
              onChange={e=>setUsername(e.target.value)} 
              placeholder="Nhập tên người dùng" 
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tài khoản</label>
            <input 
              type="email"
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="Nhập email hoặc tên đăng nhập" 
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
            <input 
              type="password"
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              placeholder="Nhập mật khẩu" 
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <input 
              type="password"
              value={confirmPassword} 
              onChange={e=>setConfirmPassword(e.target.value)} 
              placeholder="Nhập lại mật khẩu" 
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Terms and Policy */}
          <div className="pt-1">
            <p className="text-sm text-gray-600 text-center leading-tight">
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <a href="#" className="text-blue-600 hover:underline font-semibold">Điều khoản</a>
              {' '}và{' '}
              <a href="#" className="text-blue-600 hover:underline font-semibold">Chính sách</a>
            </p>
          </div>

          <button 
            type="submit"
            className="w-full px-4 py-2.5 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors shadow text-sm"
          >
            Đăng ký
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản? {' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-1 text-center">
          <Link to="/" className="text-blue-500 hover:text-blue-700 text-sm">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
