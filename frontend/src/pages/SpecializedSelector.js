import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationContext } from '../context/NavigationContext';
import API from '../services/api';

export default function SpecializedSelector() {
  const navigate = useNavigate();
  const { setPageState } = useContext(NavigationContext);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra xem người dùng đã chọn chuyên ngành chưa
    checkUserSpecialization();
  }, []);

  const checkUserSpecialization = async () => {
    try {
      const res = await API.get('/user/profile');
      console.log('User profile:', res.data);
      console.log('selectedSpecialization:', res.data.selectedSpecialization);
      
      if (res.data.selectedSpecialization) {
        // Người dùng đã chọn chuyên ngành rồi, chuyển hướng đến trang chủ đề
        console.log('Redirecting to level-topics with specialization:', res.data.selectedSpecialization);
        navigate(`/level-topics?level=specialized&specialization=${res.data.selectedSpecialization}`, { replace: true });
      } else {
        // Người dùng chưa chọn, cho phép hiển thị trang chọn
        console.log('No specialization selected, showing selector');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Lỗi kiểm tra chuyên ngành:', err);
      setIsLoading(false);
    }
  };

  const specializations = [
    { id: 'it', name: 'Công nghệ thông tin', icon: '💻', color: 'blue' },
    { id: 'economics', name: 'Kinh tế', icon: '💰', color: 'green' },
    { id: 'medical', name: 'Y tế', icon: '⚕️', color: 'red' },
    { id: 'education', name: 'Giáo dục', icon: '🎓', color: 'purple' },
    { id: 'engineering', name: 'Kỹ thuật', icon: '⚙️', color: 'orange' }
  ];

  const handleSelectSpecialization = (id) => {
    setSelectedSpecialization(id);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      // Lưu chuyên ngành đã chọn vào database
      await API.put('/user/profile', {
        selectedSpecialization: selectedSpecialization
      });
      
      // Lưu trạng thái và điều hướng đến trang chủ đề
      setPageState('learn', `/level-topics?level=specialized&specialization=${selectedSpecialization}`);
      navigate(`/level-topics?level=specialized&specialization=${selectedSpecialization}`);
    } catch (err) {
      console.error('Lỗi lưu chuyên ngành:', err);
      alert('Có lỗi xảy ra khi lưu chuyên ngành');
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedSpecialization(null);
  };

  const selectedSpec = specializations.find(s => s.id === selectedSpecialization);

  // Nếu đang kiểm tra, không render gì
  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">💼 Chọn chuyên ngành</h1>
          <p className="text-lg text-gray-600">Chọn chuyên ngành bạn muốn học tiếng Anh</p>
        </div>

        {/* Confirmation Dialog */}
        {showConfirm && selectedSpec && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Xác nhận chuyên ngành</h2>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn chọn chuyên ngành <span className="font-bold text-red-600">{selectedSpec.name}</span> không?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Specializations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {specializations.map(spec => (
            <button
              key={spec.id}
              onClick={() => handleSelectSpecialization(spec.id)}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl p-8 text-center`}
            >
              <div className={`text-6xl mb-4`}>{spec.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{spec.name}</h2>
              <p className="text-sm text-gray-600">Bắt đầu học ngay</p>
              
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${spec.color}-50 to-${spec.color}-100 -z-10`}></div>
            </button>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/learn')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
