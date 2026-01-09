import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NavigationContext } from '../context/NavigationContext';
import API from '../services/api';

export default function Header(){
  const navigate = useNavigate();
  const location = useLocation();
  const { getPageState } = useContext(NavigationContext);
  const token = localStorage.getItem('token');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('user');

  useEffect(() => {
    if (token) {
      loadUserRole();
    }
  }, [token]);

  const loadUserRole = async () => {
    try {
      const response = await API.get('/user/profile');
      setUserRole(response.data.role || 'user');
    } catch (error) {
      console.error('Lỗi tải thông tin người dùng:', error);
    }
  };

  const handleLogout = () => {
    // Xóa tất cả dữ liệu user trong localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== 'theme') { // Giữ lại theme nếu có
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    navigate('/');
  };

  const handleMenuClick = (page, defaultPath) => {
    // Nếu đang ở trang chính của menu, không làm gì
    if (location.pathname === defaultPath) {
      return;
    }
    
    // Kiểm tra xem có trạng thái trang con được lưu không
    const savedState = getPageState(page);
    if (savedState && savedState !== defaultPath) {
      // Nếu có trang con được lưu, điều hướng đến trang con đó
      navigate(savedState);
    } else {
      // Nếu không có trang con, điều hướng đến trang chính
      navigate(defaultPath);
    }
  };

  return (
    <header className="bg-blue-600 py-2.5 sticky top-0 z-50 shadow-md">
      <div className="w-full flex items-center justify-between px-8">
        <Link to={token ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
            <span className="text-lg font-bold text-blue-600">EF</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">English Flashcard</h1>
            <p className="text-xs text-blue-100">Learn English Effectively</p>
          </div>
        </Link>

        <div className="flex items-center space-x-2">
          {token ? (
            <>
              {userRole !== 'admin' && (
                <>
                  <button 
                    onClick={() => handleMenuClick('learn', '/learn')}
                    className="px-3 py-1.5 text-white hover:text-blue-100 transition-colors font-semibold text-sm"
                  >
                    📚 Học
                  </button>
                  <button 
                    onClick={() => handleMenuClick('speaking', '/speaking')}
                    className="px-3 py-1.5 text-white hover:text-blue-100 transition-colors font-semibold text-sm"
                  >
                    🎤 Luyện nói
                  </button>
                  <button 
                    onClick={() => handleMenuClick('favorites', '/favorites')}
                    className="px-3 py-1.5 text-white hover:text-blue-100 transition-colors font-semibold text-sm"
                  >
                    ⭐ Yêu thích
                  </button>
                  <button 
                    onClick={() => handleMenuClick('flashcards', '/flashcards')}
                    className="px-3 py-1.5 text-white hover:text-blue-100 transition-colors font-semibold text-sm"
                  >
                    📇 Flashcard của tôi
                  </button>
                </>
              )}

              {userRole === 'admin' && (
                <Link
                  to="/admin"
                  className="px-3 py-1.5 text-white hover:text-blue-100 transition-colors font-semibold text-sm"
                >
                  ⚙️ Quản lý
                </Link>
              )}
              
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="px-4 py-1.5 bg-white text-blue-600 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg"
                >
                  👤 Hồ sơ
                </button>
                
                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl py-1">
                    {userRole !== 'admin' && (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="block px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-50"
                        >
                          👤 Tài khoản
                        </Link>
                        <Link
                          to="/stats"
                          onClick={() => setMenuOpen(false)}
                          className="block px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-50"
                        >
                          📊 Thống kê
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setMenuOpen(false)}
                          className="block px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-50"
                        >
                          ⚙️ Cài đặt
                        </Link>
                        <Link
                          to="/flashcards"
                          onClick={() => setMenuOpen(false)}
                          className="block px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-50"
                        >
                          📇 Flashcards
                        </Link>
                        <Link
                          to="/feedback"
                          onClick={() => setMenuOpen(false)}
                          className="block px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-50"
                        >
                          💬 Gửi phản hồi
                        </Link>
                        <hr className="my-1" />
                      </>
                    )}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="px-6 py-1.5 bg-white text-blue-600 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
