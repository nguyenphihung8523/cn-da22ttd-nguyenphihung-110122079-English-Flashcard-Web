import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { NavigationContext } from '../context/NavigationContext';

export default function LevelTopics() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setPageState, clearPageState } = useContext(NavigationContext);
  const level = searchParams.get('level') || 'basic';
  const specialization = searchParams.get('specialization') || 'it';
  const [completedTopics, setCompletedTopics] = useState([]);
  const [levelScore, setLevelScore] = useState(0);

  const specializations = [
    { id: 'it', name: 'Công nghệ thông tin', icon: '💻' },
    { id: 'economics', name: 'Kinh tế', icon: '💰' },
    { id: 'medical', name: 'Y tế', icon: '⚕️' },
    { id: 'education', name: 'Giáo dục', icon: '🎓' },
    { id: 'engineering', name: 'Kỹ thuật', icon: '⚙️' }
  ];

  const levelInfo = {
    basic: { name: 'Cơ bản', icon: '📚', color: 'blue' },
    intermediate: { name: 'Trung cấp', icon: '📖', color: 'green' },
    advanced: { name: 'Nâng cao', icon: '🎓', color: 'purple' },
    communication: { name: 'Giao tiếp', icon: '💬', color: 'orange' },
    specialized: { name: 'Tiếng Anh chuyên ngành', icon: '💼', color: 'red' }
  };

  const topics = {
    basic: [
      { id: 'colors', name: 'Màu sắc', icon: '🎨' },
      { id: 'numbers', name: 'Số đếm', icon: '🔢' },
      { id: 'family', name: 'Gia đình', icon: '👨‍👩‍👧‍👦' },
      { id: 'animals', name: 'Con vật', icon: '🐾' }
    ],
    intermediate: [
      { id: 'intermediate-food', name: 'Thức ăn', icon: '🍽️' },
      { id: 'intermediate-travel', name: 'Du lịch', icon: '✈️' },
      { id: 'intermediate-weather', name: 'Thời tiết', icon: '🌤️' },
      { id: 'intermediate-jobs', name: 'Công việc', icon: '💼' }
    ],
    advanced: [
      { id: 'advanced-business', name: 'Kinh doanh', icon: '💼' },
      { id: 'advanced-technology', name: 'Công nghệ', icon: '💻' },
      { id: 'advanced-science', name: 'Khoa học', icon: '🔬' },
      { id: 'advanced-literature', name: 'Văn học', icon: '📚' }
    ],
    communication: [
      { id: 'daily', name: 'Hàng ngày', icon: '☀️' },
      { id: 'workplace', name: 'Nơi làm việc', icon: '🏢' },
      { id: 'social', name: 'Xã hội', icon: '👥' },
      { id: 'phone', name: 'Điện thoại', icon: '📱' }
    ],
    specialized: [
      { id: 'medical', name: 'Y tế', icon: '⚕️' },
      { id: 'legal', name: 'Pháp lý', icon: '⚖️' },
      { id: 'finance', name: 'Tài chính', icon: '💰' },
      { id: 'engineering', name: 'Kỹ thuật', icon: '⚙️' }
    ]
  };

  // Chủ đề cho mỗi chuyên ngành
  const specializationTopics = {
    it: [
      { id: 'specialized-it-software', name: 'Phần mềm', icon: '💻' },
      { id: 'specialized-it-hardware', name: 'Phần cứng', icon: '🖥️' },
      { id: 'specialized-it-network', name: 'Mạng', icon: '🌐' },
      { id: 'specialized-it-security', name: 'Bảo mật', icon: '🔒' }
    ],
    economics: [
      { id: 'specialized-econ-macro', name: 'Kinh tế vĩ mô', icon: '📊' },
      { id: 'specialized-econ-micro', name: 'Kinh tế vi mô', icon: '💹' },
      { id: 'specialized-econ-trade', name: 'Thương mại', icon: '🏪' },
      { id: 'specialized-econ-finance', name: 'Tài chính', icon: '💰' }
    ],
    medical: [
      { id: 'specialized-med-anatomy', name: 'Giải phẫu', icon: '🫀' },
      { id: 'specialized-med-pharma', name: 'Dược học', icon: '💊' },
      { id: 'specialized-med-surgery', name: 'Phẫu thuật', icon: '🔬' },
      { id: 'specialized-med-nursing', name: 'Điều dưỡng', icon: '⚕️' }
    ],
    education: [
      { id: 'specialized-edu-pedagogy', name: 'Sư phạm', icon: '📚' },
      { id: 'specialized-edu-psychology', name: 'Tâm lý học', icon: '🧠' },
      { id: 'specialized-edu-curriculum', name: 'Chương trình học', icon: '📖' },
      { id: 'specialized-edu-assessment', name: 'Đánh giá', icon: '✅' }
    ],
    engineering: [
      { id: 'specialized-eng-civil', name: 'Xây dựng', icon: '🏗️' },
      { id: 'specialized-eng-mechanical', name: 'Cơ khí', icon: '⚙️' },
      { id: 'specialized-eng-electrical', name: 'Điện', icon: '⚡' },
      { id: 'specialized-eng-chemical', name: 'Hóa học', icon: '🧪' }
    ]
  };

  useEffect(() => {
    loadProgress();
    // Lưu trạng thái trang LevelTopics khi người dùng vào trang này
    setPageState('learn', `/level-topics?level=${level}`);
  }, [level, specialization, setPageState]);

  const loadProgress = async () => {
    try {
      const [profileRes, progressRes] = await Promise.all([
        API.get('/user/profile'),
        API.get(`/learning/progress/${level}`)
      ]);
      
      // Nếu là cấp độ specialized, lấy điểm số riêng cho chuyên ngành
      if (level === 'specialized' && specialization) {
        setLevelScore(profileRes.data.specializationScores?.[specialization] || 0);
      } else {
        setLevelScore(profileRes.data.levelScores?.[level] || 0);
      }
      
      setCompletedTopics(progressRes.data.completedTopics || []);
    } catch (err) {
      console.error(err);
    }
  };

  const currentLevel = levelInfo[level];
  const currentTopics = level === 'specialized' ? (specializationTopics[specialization] || []) : (topics[level] || []);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Specialization Selector - chỉ hiển thị khi level là specialized */}
      {level === 'specialized' && (
        <div className="mb-6 flex items-center gap-4">
          <label className="text-lg font-semibold text-gray-700">Chọn chuyên ngành:</label>
          <select
            value={specialization}
            onChange={(e) => {
              navigate(`/level-topics?level=specialized&specialization=${e.target.value}`);
            }}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-800 hover:border-blue-500 focus:outline-none focus:border-blue-600"
          >
            {specializations.map(spec => (
              <option key={spec.id} value={spec.id}>
                {spec.icon} {spec.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => {
            clearPageState('learn');
            navigate('/learn');
          }}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Quay lại menu học
        </button>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">
            {currentLevel.icon} {currentLevel.name}
            {level === 'specialized' && ` - ${specializations.find(s => s.id === specialization)?.name}`}
          </h1>
          <p className="text-xl opacity-90">Hoàn thành tất cả các chủ đề để mở khóa bài ôn tập</p>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {currentTopics.map(topic => {
          const isCompleted = completedTopics.includes(topic.id);
          
          return (
            <div
              key={topic.id}
              className={`bg-white rounded-xl shadow-lg p-6 flex items-center justify-between hover:shadow-2xl transition-all ${
                isCompleted ? 'border-2 border-green-500' : ''
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-5xl">{topic.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-gray-800">{topic.name}</h3>
                    {isCompleted && (
                      <span className="text-2xl text-green-600">✓</span>
                    )}
                  </div>
                  {isCompleted && (
                    <p className="text-sm text-green-600 font-semibold mt-1">Đã hoàn thành</p>
                  )}
                </div>
              </div>
              <Link
                to={`/learn-cards?level=${level}&topic=${topic.id}`}
                onClick={() => setPageState('learn', `/level-topics?level=${level}`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                Học
              </Link>
            </div>
          );
        })}
      </div>

      {/* Review Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">📝 Bài ôn tập</h2>
            <p className="text-lg opacity-90 mb-2">
              Kiểm tra kiến thức của bạn với 10 câu hỏi
            </p>
            <p className="text-xl font-bold">
              Điểm hiện tại: {levelScore}/10
            </p>
            {levelScore >= 7 ? (
              <p className="text-sm mt-2 bg-white bg-opacity-20 inline-block px-3 py-1 rounded-full">
                ✅ Đã đạt yêu cầu
              </p>
            ) : (
              <p className="text-sm mt-2 bg-white bg-opacity-20 inline-block px-3 py-1 rounded-full">
                Cần tối thiểu 7 điểm
              </p>
            )}
          </div>
          <Link
            to={level === 'specialized' ? `/quiz?level=${level}&specialization=${specialization}` : `/quiz?level=${level}`}
            onClick={() => setPageState('learn', `/level-topics?level=${level}`)}
            className="px-8 py-4 bg-white text-green-600 rounded-xl hover:bg-green-50 font-bold text-lg shadow-lg"
          >
            Bắt đầu ôn tập
          </Link>
        </div>
      </div>
    </div>
  );
}
