import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import axios from 'axios';
import { speakWithSettings, loadVoices } from '../utils/speechHelper';
import { NavigationContext } from '../context/NavigationContext';

export default function LearnCards() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setPageState, clearPageState } = useContext(NavigationContext);
  const level = searchParams.get('level') || 'basic';
  const topic = searchParams.get('topic') || 'colors';
  
  const [cards, setCards] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewedCards, setViewedCards] = useState(new Set());
  const [userSettings, setUserSettings] = useState(null);

  const levelInfo = {
    basic: { name: 'Cơ bản', icon: '📚', borderColor: 'border-green-400', bgColor: 'bg-green-500', gradient: 'from-green-50 via-white to-emerald-50' },
    intermediate: { name: 'Trung cấp', icon: '📖', borderColor: 'border-blue-400', bgColor: 'bg-blue-500', gradient: 'from-blue-50 via-white to-cyan-50' },
    advanced: { name: 'Nâng cao', icon: '🎓', borderColor: 'border-purple-400', bgColor: 'bg-purple-500', gradient: 'from-purple-50 via-white to-violet-50' },
    communication: { name: 'Giao tiếp', icon: '💬', borderColor: 'border-orange-400', bgColor: 'bg-orange-500', gradient: 'from-orange-50 via-white to-amber-50' },
    specialized: { name: 'Tiếng Anh chuyên ngành', icon: '💼', borderColor: 'border-red-400', bgColor: 'bg-red-500', gradient: 'from-red-50 via-white to-rose-50' }
  };

  const topicInfo = {
    colors: { name: 'Màu sắc', icon: '🎨' },
    numbers: { name: 'Số đếm', icon: '🔢' },
    family: { name: 'Gia đình', icon: '👨‍👩‍👧‍👦' },
    animals: { name: 'Con vật', icon: '🐾' },
    'intermediate-jobs': { name: 'Công việc', icon: '💼' },
    'intermediate-weather': { name: 'Thời tiết', icon: '🌤️' },
    'intermediate-food': { name: 'Thức ăn', icon: '🍽️' },
    'intermediate-travel': { name: 'Du lịch', icon: '✈️' },
    'advanced-business': { name: 'Kinh doanh', icon: '💼' },
    'advanced-technology': { name: 'Công nghệ', icon: '💻' },
    'advanced-science': { name: 'Khoa học', icon: '🔬' },
    'advanced-literature': { name: 'Văn học', icon: '📚' }
  };

  useEffect(() => {
    loadCards();
    loadFavorites();
    // Lưu trạng thái trang Learn
    setPageState('learn', `/learn-cards?level=${level}&topic=${topic}`);
  }, [level, topic, setPageState]);

  // Load settings mỗi khi component mount hoặc user quay lại trang
  useEffect(() => {
    loadUserSettings();
    
    // Reload settings khi window focus (user quay lại tab)
    const handleFocus = () => {
      loadUserSettings();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadUserSettings = async () => {
    try {
      const res = await API.get('/user/profile');
      setUserSettings(res.data.settings);
      loadVoices(); // Load voices
    } catch (err) {
      console.error('Lỗi tải cài đặt:', err);
    }
  };

  // Đánh dấu thẻ đầu tiên đã xem khi load xong
  useEffect(() => {
    if (cards.length > 0 && currentIndex === 0 && viewedCards.size === 0) {
      const firstCard = cards[0];
      setViewedCards(new Set([firstCard._id]));
      
      // Lưu lịch sử
      API.post('/learning/history', {
        flashcardId: firstCard._id,
        level,
        topic,
        activityType: 'view'
      }).catch(err => console.error('Lỗi lưu lịch sử:', err));
    }
  }, [cards, currentIndex, viewedCards.size, level, topic]);

  // Lưu vị trí flashcard hiện tại vào localStorage
  useEffect(() => {
    if (cards.length > 0) {
      const storageKey = `flashcard_position_${level}_${topic}`;
      localStorage.setItem(storageKey, JSON.stringify({
        currentIndex,
        isFlipped,
        viewedCards: Array.from(viewedCards)
      }));
    }
  }, [currentIndex, isFlipped, viewedCards, level, topic, cards.length]);

  const loadCards = async () => {
    try {
      // Nếu topic đã có prefix level (ví dụ: intermediate-food), dùng trực tiếp
      // Nếu không, thêm prefix level (ví dụ: colors -> basic-colors)
      const category = topic.includes('-') ? topic : `${level}-${topic}`;
      const res = await axios.get(`http://localhost:5000/api/flashcards?category=${category}`);
      setCards(res.data);
      
      // Khôi phục vị trí flashcard từ localStorage
      const storageKey = `flashcard_position_${level}_${topic}`;
      const savedPosition = localStorage.getItem(storageKey);
      
      if (savedPosition) {
        try {
          const { currentIndex: savedIndex, isFlipped: savedFlipped, viewedCards: savedViewed } = JSON.parse(savedPosition);
          // Chỉ khôi phục nếu index hợp lệ
          if (savedIndex >= 0 && savedIndex < res.data.length) {
            setCurrentIndex(savedIndex);
            setIsFlipped(savedFlipped);
            setViewedCards(new Set(savedViewed));
          } else {
            setCurrentIndex(0);
            setIsFlipped(false);
            setViewedCards(new Set());
          }
        } catch (err) {
          console.error('Lỗi khôi phục vị trí flashcard:', err);
          setCurrentIndex(0);
          setIsFlipped(false);
          setViewedCards(new Set());
        }
      } else {
        setCurrentIndex(0);
        setIsFlipped(false);
        setViewedCards(new Set());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadFavorites = async () => {
    try {
      const res = await API.get('/user/favorites');
      setFavorites(res.data.map(f => f._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    // Đánh dấu thẻ hiện tại đã xem
    if (cards[currentIndex]) {
      const newViewedCards = new Set([...viewedCards, cards[currentIndex]._id]);
      setViewedCards(newViewedCards);
      
      // Lưu lịch sử
      API.post('/learning/history', {
        flashcardId: cards[currentIndex]._id,
        level,
        topic,
        activityType: 'view'
      }).catch(err => console.error('Lỗi lưu lịch sử:', err));
    }
    
    // Chuyển sang thẻ tiếp theo
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleSpeak = (word) => {
    speakWithSettings(word, userSettings);
  };

  const handleToggleFavorite = async (cardId) => {
    try {
      if (favorites.includes(cardId)) {
        await API.post('/user/favorites/remove', { flashcardId: cardId });
        setFavorites(favorites.filter(id => id !== cardId));
      } else {
        await API.post('/user/favorites/add', { flashcardId: cardId });
        setFavorites([...favorites, cardId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async () => {
    try {
      console.log('Gọi API complete-topic với:', { level, topic });
      
      // Gọi API đánh dấu hoàn thành
      const response = await API.post('/learning/complete-topic', { level, topic });
      console.log('API response:', response.data);
      
      // Xóa vị trí flashcard từ localStorage để reset về thẻ đầu tiên lần tới
      const storageKey = `flashcard_position_${level}_${topic}`;
      localStorage.removeItem(storageKey);
      
      // Hiển thị thông báo chúc mừng
      const topicName = topicInfo[topic]?.name || 'chủ đề này';
      alert(`🎉 Chúc mừng! Bạn đã hoàn thành chủ đề "${topicName}".\n\n✓ Chủ đề đã được đánh dấu hoàn thành.`);
      
      // Quay lại trang danh sách chủ đề
      navigate(`/level-topics?level=${level}`);
    } catch (err) {
      console.error('Lỗi khi hoàn thành:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      alert(`Có lỗi xảy ra khi lưu tiến độ.\n\nChi tiết: ${err.response?.data?.message || err.message}`);
    }
  };

  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;
  const allViewed = viewedCards.size === cards.length && cards.length > 0;
  
  // Debug
  console.log('Current state:', {
    currentIndex,
    totalCards: cards.length,
    viewedCount: viewedCards.size,
    allViewed,
    isLastCard: currentIndex === cards.length - 1
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-4 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-3">
          <button 
            onClick={() => {
              navigate(`/level-topics?level=${level}`);
            }}
            className="text-blue-600 hover:underline mb-1 inline-block text-sm"
          >
            ← Quay lại {levelInfo[level]?.name}
          </button>
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="text-lg font-bold text-gray-800">
                {topicInfo[topic]?.icon} {topicInfo[topic]?.name}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-600 font-semibold">
                Thẻ {currentIndex + 1} / {cards.length}
              </p>
              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {allViewed && (
                <span className="text-green-600 font-bold text-xs">✓ Đã xem hết</span>
              )}
            </div>
          </div>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-base text-gray-600">Đang tải flashcards...</p>
          </div>
        ) : (
          <>
            {/* Flashcard dạng thẻ bài với hiệu ứng 3D flip */}
            <div className="mb-4 flex justify-center perspective-1000">
              <div 
                className={`relative cursor-pointer transition-transform duration-700 transform-style-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={handleFlipCard}
                style={{ 
                  transformStyle: 'preserve-3d',
                  width: '280px',
                  height: '380px'
                }}
              >
                {/* Mặt trước - Front */}
                <div 
                  className={`absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl overflow-hidden border-2 ${levelInfo[level]?.borderColor || 'border-blue-200'}`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="relative h-full flex flex-col justify-between p-4 bg-white">
                    {/* Header với favorite */}
                    <div className="flex justify-between items-start">
                      <div className={`w-7 h-7 rounded-full ${levelInfo[level]?.bgColor || 'bg-blue-500'} flex items-center justify-center text-white font-bold text-xs`}>
                        {currentIndex + 1}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(currentCard._id);
                        }}
                        className="text-xl hover:scale-110 transition-transform"
                      >
                        {favorites.includes(currentCard._id) ? '⭐' : '☆'}
                      </button>
                    </div>

                    {/* Content chính */}
                    <div className="flex-1 flex flex-col justify-center items-center">
                      {/* Hình minh họa (nếu có và được bật) */}
                      {currentCard.image && userSettings?.showImages !== false && (
                        <div className="text-5xl mb-3 animate-bounce-slow">
                          {currentCard.image}
                        </div>
                      )}

                      {/* Từ vựng */}
                      <h2 className="text-3xl font-bold text-blue-600 mb-2 text-center">{currentCard.word}</h2>
                      
                      {/* Phiên âm */}
                      {currentCard.pronunciation && (
                        <p className="text-base text-gray-600 mb-3">/{currentCard.pronunciation}/</p>
                      )}
                    </div>
                    
                    {/* Footer với nút phát âm */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(currentCard.word);
                        }}
                        className="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-sm shadow-md transform hover:scale-105 transition-all"
                      >
                        🔊 Nghe phát âm
                      </button>
                      <p className="text-xs text-gray-400">Click thẻ để lật</p>
                    </div>
                  </div>
                </div>

                {/* Mặt sau - Back */}
                <div 
                  className={`absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl overflow-hidden border-2 ${levelInfo[level]?.borderColor || 'border-green-200'} rotate-y-180`}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="relative h-full flex flex-col justify-between p-4 bg-white">
                    {/* Header với favorite */}
                    <div className="flex justify-between items-start">
                      <div className={`w-7 h-7 rounded-full ${levelInfo[level]?.bgColor || 'bg-green-500'} flex items-center justify-center text-white font-bold text-xs`}>
                        {currentIndex + 1}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(currentCard._id);
                        }}
                        className="text-xl hover:scale-110 transition-transform"
                      >
                        {favorites.includes(currentCard._id) ? '⭐' : '☆'}
                      </button>
                    </div>

                    {/* Content chính */}
                    <div className="flex-1 flex flex-col justify-center items-center px-3">
                      {/* Nghĩa */}
                      <p className="text-2xl font-bold text-gray-800 mb-4 text-center">{currentCard.meaning}</p>
                      
                      {/* Ví dụ */}
                      {currentCard.example && (
                        <div className="bg-white bg-opacity-80 rounded-lg p-3 shadow-sm">
                          <p className="text-sm text-gray-700 italic mb-2 text-center">"{currentCard.example}"</p>
                          {currentCard.exampleTranslation && (
                            <p className="text-xs text-gray-600 text-center mb-2">"{currentCard.exampleTranslation}"</p>
                          )}
                          <div className="flex justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeak(currentCard.example);
                              }}
                              className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-xs shadow-md transform hover:scale-105 transition-all"
                            >
                              🔊 Nghe ví dụ
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Footer */}
                    <div className="flex justify-center">
                      <p className="text-xs text-gray-400">Click thẻ để lật lại</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CSS cho hiệu ứng 3D */}
            <style jsx>{`
              .perspective-1000 {
                perspective: 1000px;
              }
              .transform-style-3d {
                transform-style: preserve-3d;
              }
              .backface-hidden {
                backface-visibility: hidden;
              }
              .rotate-y-180 {
                transform: rotateY(180deg);
              }
              @keyframes bounce-slow {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              .animate-bounce-slow {
                animation: bounce-slow 2s ease-in-out infinite;
              }
            `}</style>

            {/* Navigation */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex-1 px-4 py-2.5 bg-white text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow"
              >
                ← Thẻ trước
              </button>
              
              {/* Nếu đã ở thẻ cuối → Hiển thị nút Hoàn thành */}
              {currentIndex === cards.length - 1 ? (
                <button
                  onClick={handleComplete}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 shadow transform hover:scale-105 transition-all"
                >
                  ✓ Hoàn thành
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 px-4 py-2.5 bg-white text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 shadow"
                >
                  Thẻ sau →
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
