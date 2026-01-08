import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { NavigationContext } from '../context/NavigationContext';

export default function Learn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setPageState } = useContext(NavigationContext);
  const [unlockedLevels, setUnlockedLevels] = useState(['basic']);
  const [levelScores, setLevelScores] = useState({});
  const [specializationScores, setSpecializationScores] = useState({});
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [showSpecializationModal, setShowSpecializationModal] = useState(false);
  const [levels, setLevels] = useState([]);

  // Default levels (fallback)
  const defaultLevels = [
    { id: 'basic', name: 'Cơ bản', icon: '📚', color: 'blue', description: 'Từ vựng cơ bản cho người mới bắt đầu' },
    { id: 'intermediate', name: 'Trung cấp', icon: '📖', color: 'green', description: 'Mở rộng vốn từ vựng hàng ngày' },
    { id: 'advanced', name: 'Nâng cao', icon: '🎓', color: 'purple', description: 'Từ vựng chuyên sâu và học thuật' },
    { id: 'communication', name: 'Giao tiếp', icon: '💬', color: 'orange', description: 'Kỹ năng giao tiếp thực tế' },
    { id: 'specialized', name: 'Chuyên ngành', icon: '💼', color: 'red', description: 'Tiếng Anh chuyên ngành' }
  ];

  useEffect(() => {
    loadLevels();
    loadUserProgress();
  }, [location]);

  const loadLevels = async () => {
    try {
      const res = await API.get('/flashcards/levels');
      if (res.data.success && res.data.levels.length > 0) {
        setLevels(res.data.levels);
      } else {
        setLevels(defaultLevels);
      }
    } catch (err) {
      console.error('Error loading levels:', err);
      setLevels(defaultLevels);
    }
  };

  const loadUserProgress = async () => {
    try {
      const res = await API.get('/user/profile');
      setUnlockedLevels(res.data.unlockedLevels || ['basic']);
      setLevelScores(res.data.levelScores || {});
      setSpecializationScores(res.data.specializationScores || {});
      setSelectedSpecialization(res.data.selectedSpecialization || null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSpecializedClick = async () => {
    try {
      const res = await API.get('/user/profile');
      const selectedSpec = res.data.selectedSpecialization;
      
      if (selectedSpec) {
        // Người dùng đã chọn chuyên ngành rồi, đi thẳng đến trang chủ đề
        setPageState('learn', `/level-topics?level=specialized&specialization=${selectedSpec}`);
        navigate(`/level-topics?level=specialized&specialization=${selectedSpec}`);
      } else {
        // Người dùng chưa chọn chuyên ngành, hiển thị trang chọn
        setPageState('learn', '/specialized-selector');
        navigate('/specialized-selector');
      }
    } catch (err) {
      console.error(err);
      // Nếu có lỗi, mặc định đi đến trang chọn
      navigate('/specialized-selector');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">📚 Học từ vựng</h1>
          <p className="text-lg text-gray-600">Chọn cấp độ phù hợp với trình độ của bạn</p>
          <div className="mt-3 bg-blue-100 rounded-lg p-3 inline-block">
            <p className="text-sm text-gray-700">
              💡 <span className="font-semibold">Mẹo:</span> Đạt tối thiểu <span className="font-bold text-blue-600">70 điểm</span> ở bài ôn tập để mở khóa cấp độ tiếp theo
            </p>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level, index) => {
            const isLocked = !unlockedLevels.includes(level.id);
            let score = levelScores[level.id] || 0;
            
            // Nếu là chuyên ngành, lấy điểm của chuyên ngành đã chọn
            if (level.id === 'specialized' && selectedSpecialization) {
              score = specializationScores[selectedSpecialization] || 0;
            }
            
            const isPassed = score >= 70;

            return (
              <div
                key={level.id}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 ${
                  isLocked ? 'opacity-60' : 'hover:scale-105 hover:shadow-2xl'
                }`}
              >
                {/* Level Number Badge */}
                <div className={`absolute top-3 left-3 w-8 h-8 bg-${level.color}-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                  {index + 1}
                </div>

                {/* Lock Badge */}
                {isLocked && (
                  <div className="absolute top-3 right-3 bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    🔒 Khóa
                  </div>
                )}

                {/* Passed Badge */}
                {!isLocked && isPassed && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    ✓ Đã đạt
                  </div>
                )}

                {/* Content */}
                <div className={`p-6 bg-gradient-to-br from-${level.color}-50 to-${level.color}-100`}>
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">
                      {level.icon?.startsWith('data:image') ? (
                        <img src={level.icon} alt={level.name} className="w-16 h-16 object-contain mx-auto" />
                      ) : (
                        level.icon
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{level.name}</h2>
                    <p className="text-sm text-gray-600">{level.description}</p>
                  </div>

                  {/* Score Display */}
                  {!isLocked && score > 0 && (
                    <div className="mb-3">
                      <div className="bg-white rounded-lg p-2 shadow-md mb-2">
                        <p className="text-xs text-gray-600 mb-1 text-center">
                          {level.id === 'specialized' && selectedSpecialization ? `Điểm ôn tập - ${selectedSpecialization.toUpperCase()}` : 'Điểm ôn tập'}
                        </p>
                        <p className={`text-lg font-bold text-center ${isPassed ? 'text-green-600' : 'text-orange-600'}`}>
                          {score}/10
                        </p>
                      </div>
                      
                      {/* Xem thêm button cho specialized */}
                      {level.id === 'specialized' && Object.keys(specializationScores).length > 1 && (
                        <button
                          onClick={() => setShowSpecializationModal(true)}
                          className="w-full px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition-colors"
                        >
                          Xem thêm →
                        </button>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  {isLocked ? (
                    <div className="text-center">
                      <button
                        disabled
                        className="w-full px-4 py-2 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed text-sm"
                      >
                        🔒 Hoàn thành cấp độ trước
                      </button>
                    </div>
                  ) : level.id === 'specialized' ? (
                    <button
                      onClick={handleSpecializedClick}
                      className={`block w-full px-4 py-2 text-white rounded-lg font-semibold text-center transition-colors text-sm bg-red-600 hover:bg-red-700`}
                    >
                      Bắt đầu học →
                    </button>
                  ) : (
                    <Link
                      to={`/level-topics?level=${level.id}`}
                      onClick={() => setPageState('learn', `/level-topics?level=${level.id}`)}
                      className={`block w-full px-4 py-2 text-white rounded-lg font-semibold text-center transition-colors text-sm ${
                        level.id === 'advanced'
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : `bg-${level.color}-600 hover:bg-${level.color}-700`
                      }`}
                    >
                      Bắt đầu học →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">📊 Tiến độ của bạn</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {levels.map(level => {
              const isUnlocked = unlockedLevels.includes(level.id);
              let score = levelScores[level.id] || 0;
              
              // Nếu là chuyên ngành, lấy điểm của chuyên ngành đã chọn
              if (level.id === 'specialized' && selectedSpecialization) {
                score = specializationScores[selectedSpecialization] || 0;
              }
              
              return (
                <div key={level.id} className="text-center">
                  <div className={`text-3xl mb-1 ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                    {level.icon?.startsWith('data:image') ? (
                      <img src={level.icon} alt={level.name} className="w-8 h-8 object-contain mx-auto" />
                    ) : (
                      level.icon
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-700">{level.name}</p>
                  {isUnlocked ? (
                    <div>
                      <p className={`text-sm font-bold ${score >= 7 ? 'text-green-600' : 'text-gray-600'}`}>
                        {score > 0 ? `${score}/10` : 'Chưa làm'}
                      </p>
                      {/* Xem thêm button cho specialized */}
                      {level.id === 'specialized' && Object.keys(specializationScores).length > 1 && (
                        <button
                          onClick={() => setShowSpecializationModal(true)}
                          className="mt-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Xem thêm →
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">🔒 Khóa</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Specialization Scores Modal */}
        {showSpecializationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Điểm các chuyên ngành</h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                {Object.entries(specializationScores).map(([spec, score]) => {
                  if (score === 0) return null; // Không hiển thị nếu chưa làm
                  
                  const specNames = {
                    'it': '💻 Công nghệ thông tin',
                    'economics': '💰 Kinh tế',
                    'medical': '⚕️ Y tế',
                    'education': '🎓 Giáo dục',
                    'engineering': '⚙️ Kỹ thuật'
                  };
                  
                  const isPassed = score >= 7;
                  
                  return (
                    <div key={spec} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{specNames[spec]}</span>
                      <span className={`font-bold text-lg ${isPassed ? 'text-green-600' : 'text-orange-600'}`}>
                        {score}/10
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <button
                onClick={() => setShowSpecializationModal(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
