import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      alert('Đăng nhập thành công');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi đăng nhập');
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex flex-col justify-center px-4 py-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-auto flex-shrink-0">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-2xl font-bold text-white">EF</span>
          </div>
          <h1 className="text-lg font-bold text-gray-800 mb-1">English Flashcard</h1>
          <p className="text-sm text-gray-600">Đăng nhập để tiếp tục</p>
        </div>

        {/* Login Form */}
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tài khoản</label>
            <input 
              type="email"
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="Nhập email hoặc tên đăng nhập" 
              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
            <input 
              type="password"
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              placeholder="Nhập mật khẩu" 
              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div className="pt-3">
            <button 
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow text-base"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản? {' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-3 text-center">
          <Link to="/" className="text-blue-500 hover:text-blue-700 text-sm">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
