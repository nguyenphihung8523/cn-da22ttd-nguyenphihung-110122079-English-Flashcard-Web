import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { NavigationContext } from '../context/NavigationContext';

export default function Speaking() {
  const { setPageState } = useContext(NavigationContext);
  const [searchParams] = useSearchParams();

  // State management
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [speakingItems, setSpeakingItems] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [listeningTimer, setListeningTimer] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [pronunciationScore, setPronunciationScore] = useState(0);
  const [wordComparison, setWordComparison] = useState([]);
  const [showMeaning, setShowMeaning] = useState(true);
  const [slowSpeed, setSlowSpeed] = useState(false);
  
  // Data from API
  const [levels, setLevels] = useState([]);
  const [topicsForLevel, setTopicsForLevel] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  // Session management
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    completedItems: 0,
    totalItems: 0,
    averageAccuracy: 0,
    pronunciationScore: 0
  });
  
  // Modal states
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showDetailedStatsModal, setShowDetailedStatsModal] = useState(false);
  const [showSessionStatsModal, setShowSessionStatsModal] = useState(false);
  const [showMistakesModal, setShowMistakesModal] = useState(false);
  
  // Progress data
  const [progressData, setProgressData] = useState(null);
  const [detailedStats, setDetailedStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [mistakeItems, setMistakeItems] = useState([]);
  const [mistakeItemIndex, setMistakeItemIndex] = useState(0);
  const [mistakeResult, setMistakeResult] = useState(null);
  const [showMistakeResult, setShowMistakeResult] = useState(false);
  
  // Speech recognition
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    setPageState('speaking', '/speaking');
    loadRecommendations();
    loadSpeakingLevels();
  }, [setPageState]);

  // Load speaking levels from API
  const loadSpeakingLevels = async () => {
    try {
      setLoadingData(true);
      const response = await API.get('/speaking/levels');
      if (response.data.success) {
        setLevels(response.data.levels);
      }
    } catch (error) {
      console.error('Lỗi tải cấp độ:', error);
      // Fallback to default levels
      setLevels([
        { id: 'basic', name: 'Cơ bản', icon: '🌱', description: 'Từ vựng đơn giản' },
        { id: 'conversation', name: 'Giao tiếp', icon: '💬', description: 'Hội thoại hàng ngày' },
        { id: 'paragraph', name: 'Đoạn văn', icon: '📝', description: 'Đoạn văn mẫu' }
      ]);
    } finally {
      setLoadingData(false);
    }
  };

  // Load topics for a level from API
  const loadTopicsForLevel = async (levelId) => {
    try {
      setLoadingData(true);
      const response = await API.get(`/speaking/topics/${levelId}`);
      if (response.data.success) {
        setTopicsForLevel(response.data.topics);
      }
    } catch (error) {
      console.error('Lỗi tải chủ đề:', error);
      setTopicsForLevel([]);
    } finally {
      setLoadingData(false);
    }
  };

  // Load speaking items for a topic from API
  const loadSpeakingItemsFromAPI = async (levelId, topicId) => {
    try {
      setLoadingData(true);
      const response = await API.get(`/speaking/items/${levelId}/${topicId}`);
      if (response.data.success) {
        return response.data.items;
      }
      return [];
    } catch (error) {
      console.error('Lỗi tải mục luyện tập:', error);
      return [];
    } finally {
      setLoadingData(false);
    }
  };


  // Level selection
  const selectLevel = async (level) => {
    setSelectedLevel(level);
    setSelectedTopic(null);
    setCurrentItemIndex(0);
    setSpeakingItems([]);
    resetSession();
    // Load topics for this level from API
    await loadTopicsForLevel(level);
  };

  // Topic selection and session start
  const selectTopic = async (topic) => {
    setSelectedTopic(topic);
    // Load items from API instead of hardcoded data
    const items = await loadSpeakingItemsFromAPI(selectedLevel, topic);
    setSpeakingItems(items);
    setCurrentItemIndex(0);
    resetSession();
    
    // Start session automatically - pass items.length directly
    await startSpeakingSession(selectedLevel, topic, items.length);
  };

  // Session management functions
  const startSpeakingSession = async (level, topic, itemCount) => {
    try {
      const response = await API.post('/speaking/start', {
        level,
        topic,
        scenario: topic
      });
      
      setCurrentSession(response.data.sessionId);
      setSessionStats({
        completedItems: 0,
        totalItems: itemCount || 0,
        averageAccuracy: 0,
        pronunciationScore: 0
      });
    } catch (error) {
      console.error('Lỗi bắt đầu phiên luyện nói:', error);
      // Vẫn tạo session local nếu API lỗi
      setCurrentSession('local-' + Date.now());
      setSessionStats({
        completedItems: 0,
        totalItems: itemCount || 0,
        averageAccuracy: 0,
        pronunciationScore: 0
      });
    }
  };

  const resetSession = () => {
    setCurrentSession(null);
    setSessionStats({
      completedItems: 0,
      totalItems: 0,
      averageAccuracy: 0,
      pronunciationScore: 0
    });
    setTranscript('');
    setShowResult(false);
    setAccuracy(0);
    setPronunciationScore(0);
    setWordComparison([]);
  };

  // Speech recognition functions
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Trình duyệt không hỗ trợ nhận dạng giọng nói');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const newRecognition = new SpeechRecognition();

    newRecognition.continuous = false;
    newRecognition.interimResults = false;
    newRecognition.lang = 'en-US';

    newRecognition.onstart = () => {
      setIsListening(true);
      setListeningTimer(0);
      
      // Start timer
      const timer = setInterval(() => {
        setListeningTimer(prev => {
          if (prev >= 10) {
            clearInterval(timer);
            newRecognition.stop();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    };

    newRecognition.onresult = (event) => {
      if (event.results && event.results.length > 0) {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        calculateAccuracy(text);
        setShowResult(true);
      }
    };

    newRecognition.onend = () => {
      setIsListening(false);
      setListeningTimer(0);
    };

    newRecognition.onerror = (e) => {
      setIsListening(false);
      setListeningTimer(0);
      
      // Always show error messages including 'no-speech'
      let errorMessage = 'Lỗi nhận dạng giọng nói: ';
      switch(e.error) {
        case 'no-speech':
          errorMessage += 'Không nhận diện được giọng nói. Vui lòng thử lại.';
          break;
        case 'audio-capture':
          errorMessage += 'Không thể truy cập microphone.';
          break;
        case 'not-allowed':
          errorMessage += 'Quyền truy cập microphone bị từ chối.';
          break;
        default:
          errorMessage += e.error;
      }
      alert(errorMessage);
    };

    setRecognition(newRecognition);
    newRecognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setIsListening(false);
    setListeningTimer(0);
  };

  // Accuracy calculation
  const calculateAccuracy = async (userText) => {
    const currentItem = speakingItems[currentItemIndex];
    if (!currentItem) return;

    const targetWords = currentItem.text.toLowerCase().split(/\s+/);
    const userWords = userText.toLowerCase().split(/\s+/);

    let correctWords = 0;
    const comparison = targetWords.slice(0, 8).map(word => {
      const isCorrect = userWords.some(uWord => 
        uWord.includes(word) || word.includes(uWord)
      );
      if (isCorrect) correctWords++;
      return { word, isCorrect };
    });

    setWordComparison(comparison);

    const acc = Math.round((correctWords / Math.min(targetWords.length, 8)) * 100);
    const pronunciationScore = calculatePronunciationScore(currentItem.text, userText);

    setAccuracy(acc);
    setPronunciationScore(pronunciationScore);

    // Save result to backend
    if (currentSession) {
      await saveSpeakingResult(currentItem, userText, acc, pronunciationScore);
    }
  };

  const calculatePronunciationScore = (targetText, spokenText) => {
    const target = targetText.toLowerCase().trim();
    const spoken = spokenText.toLowerCase().trim();

    if (spoken === target) return 100;
    if (spoken.length === 0) return 0;

    const words = target.split(' ');
    const spokenWords = spoken.split(' ');
    let correctWords = 0;

    words.forEach(word => {
      if (spokenWords.includes(word)) correctWords++;
    });

    const baseScore = (correctWords / words.length) * 100;
    return Math.min(100, Math.max(0, baseScore));
  };

  const saveSpeakingResult = async (item, spokenText, accuracy, pronunciationScore) => {
    // Cập nhật local stats trước
    setSessionStats(prev => {
      const newCompletedItems = prev.completedItems + 1;
      const newTotalAccuracy = (prev.averageAccuracy * prev.completedItems + accuracy) / newCompletedItems;
      const newTotalPronunciation = (prev.pronunciationScore * prev.completedItems + pronunciationScore) / newCompletedItems;
      
      return {
        ...prev,
        completedItems: newCompletedItems,
        averageAccuracy: Math.round(newTotalAccuracy),
        pronunciationScore: Math.round(newTotalPronunciation)
      };
    });

    // Nếu là local session, không gọi API
    if (currentSession && currentSession.toString().startsWith('local-')) {
      return;
    }

    try {
      const response = await API.post('/speaking/save-result', {
        sessionId: currentSession,
        itemId: item.id || item._id,
        text: item.text,
        meaning: item.meaning,
        spokenText,
        accuracy,
        pronunciationScore
      });
      
      // Cập nhật từ server nếu có
      if (response.data.session) {
        setSessionStats(response.data.session);
      }
    } catch (error) {
      console.error('Lỗi lưu kết quả:', error);
      // Giữ local stats đã cập nhật ở trên
    }
  };

  // Navigation functions
  const nextItem = () => {
    if (currentItemIndex < speakingItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      resetItemState();
    } else {
      completeSession();
    }
  };

  const prevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      resetItemState();
    }
  };

  const resetItemState = () => {
    setTranscript('');
    setShowResult(false);
    setAccuracy(0);
    setPronunciationScore(0);
    setWordComparison([]);
  };

  const completeSession = async () => {
    if (currentSession) {
      try {
        await API.post('/speaking/complete', {
          sessionId: currentSession
        });
        
        alert(`🎉 Hoàn thành phiên luyện tập!\n\nĐộ chính xác trung bình: ${sessionStats.averageAccuracy}%\nĐiểm phát âm: ${sessionStats.pronunciationScore}`);
        
        setSelectedTopic(null);
        setCurrentItemIndex(0);
        setSpeakingItems([]);
        resetSession();
        
        loadProgressData();
      } catch (error) {
        console.error('Lỗi hoàn thành phiên:', error);
      }
    }
  };

  // Text-to-speech
  const speakSample = (text, rate = 0.8) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Progress data loading
  const loadProgressData = async () => {
    try {
      const response = await API.get('/speaking/progress');
      if (response.data.success) {
        setProgressData(response.data.progress);
      }
    } catch (error) {
      console.error('Lỗi tải tiến độ:', error);
    }
  };

  const loadDetailedStats = async () => {
    try {
      const response = await API.get('/speaking/detailed-stats');
      if (response.data.success) {
        setDetailedStats(response.data.stats);
      }
    } catch (error) {
      console.error('Lỗi tải thống kê chi tiết:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      const response = await API.get('/speaking/recommendations');
      if (response.data.success) {
        setRecommendations(response.data.recommendations.tips || []);
      }
    } catch (error) {
      console.error('Lỗi tải gợi ý:', error);
    }
  };

  const loadMistakeItems = async () => {
    try {
      // Lấy tất cả practice results của user
      const response = await API.get('/speaking/detailed-stats');
      if (response.data.success) {
        // Lấy những items có độ chính xác < 70%
        const allResults = response.data.stats.topicPerformance || {};
        
        const mistakes = [];
        
        // Lấy items từ API cho mỗi topic có độ chính xác thấp
        for (const [key, topic] of Object.entries(allResults)) {
          // Chỉ lấy những topic đã luyện (totalItems > 0) và có độ chính xác < 70%
          if (topic.totalItems > 0 && topic.averageAccuracy < 70) {
            try {
              // Gọi API để lấy items cho topic này
              const itemsResponse = await API.get(`/speaking/items/${topic.level}/${topic.topic}`);
              if (itemsResponse.data.success) {
                const items = itemsResponse.data.items || [];
                items.forEach(item => {
                  mistakes.push({
                    id: `${topic.level}-${topic.topic}-${item.id || item._id}`,
                    text: item.text,
                    meaning: item.meaning,
                    level: topic.level,
                    topic: topic.topic,
                    accuracy: topic.averageAccuracy
                  });
                });
              }
            } catch (itemError) {
              console.error(`Lỗi tải items cho ${topic.level}/${topic.topic}:`, itemError);
            }
          }
        }
        
        setMistakeItems(mistakes);
        setMistakeItemIndex(0);
        setShowMistakeResult(false);
      }
    } catch (error) {
      console.error('Lỗi tải từ cần luyện lại:', error);
    }
  };

  const handleMistakeItemSpeak = async (userText) => {
    if (!mistakeItems[mistakeItemIndex]) return;
    
    const currentItem = mistakeItems[mistakeItemIndex];
    const targetWords = currentItem.text.toLowerCase().split(/\s+/);
    const userWords = userText.toLowerCase().split(/\s+/);

    let correctWords = 0;
    targetWords.forEach(word => {
      if (userWords.some(uWord => 
        uWord.includes(word) || word.includes(uWord)
      )) {
        correctWords++;
      }
    });

    const accuracy = Math.round((correctWords / targetWords.length) * 100);
    
    setMistakeResult({
      accuracy,
      transcript: userText,
      isCorrect: accuracy >= 70
    });
    setShowMistakeResult(true);
  };

  const confirmMistakeResult = () => {
    // Xóa item khỏi danh sách khi người dùng xác nhận
    const newMistakes = mistakeItems.filter((_, idx) => idx !== mistakeItemIndex);
    setMistakeItems(newMistakes);
    
    if (newMistakes.length === 0) {
      setShowMistakesModal(false);
    } else if (mistakeItemIndex >= newMistakes.length) {
      setMistakeItemIndex(newMistakes.length - 1);
    }
    setShowMistakeResult(false);
  };

  // Modal handlers
  const openProgressModal = () => {
    loadProgressData();
    setShowProgressModal(true);
  };

  const openDetailedStatsModal = () => {
    loadDetailedStats();
    setShowDetailedStatsModal(true);
  };

  const openSessionStatsModal = () => {
    setShowSessionStatsModal(true);
  };

  // Get current item
  const currentItem = speakingItems[currentItemIndex];

  // Get topics for level (from API data)
  const getTopicsForLevel = (level) => {
    return topicsForLevel;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎤 Luyện nói</h1>
          <p className="text-gray-600">Cải thiện kỹ năng phát âm tiếng Anh của bạn</p>
          {selectedLevel && selectedTopic && (
            <div className="mt-3 text-sm text-gray-700">
              <span className="font-semibold">Cấp độ luyện nói:</span> {levels.find(l => l.id === selectedLevel)?.name} | 
              <span className="font-semibold ml-2">Chủ đề luyện nói:</span> {getTopicsForLevel(selectedLevel).find(t => t.id === selectedTopic)?.name}
            </div>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap justify-between items-center gap-2 mb-5">
          {/* Left: Back Button */}
          <div>
            {selectedTopic && (
              <button
                onClick={() => {
                  setSelectedTopic(null);
                  setCurrentItemIndex(0);
                  setSpeakingItems([]);
                  resetSession();
                }}
                className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700"
              >
                ← Quay lại
              </button>
            )}
          </div>

          {/* Center: Progress Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={openProgressModal}
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
            >
              📈 Tiến độ
            </button>
            
            <button
              onClick={openDetailedStatsModal}
              className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700"
            >
              📊 Thống kê
            </button>
            
            <button
              onClick={() => {
                loadMistakeItems();
                setShowMistakesModal(true);
              }}
              className="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
            >
              🔄 Luyện lại
            </button>
            
            {currentSession && (
              <button
                onClick={openSessionStatsModal}
                className="px-3 py-1.5 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700"
              >
                📊 Tiến độ phiên ({sessionStats.completedItems}/{sessionStats.totalItems})
              </button>
            )}
          </div>

          {/* Right: Status Indicator */}
          <div>
            {selectedTopic && (
              <span className="text-sm text-gray-600 bg-green-100 px-2.5 py-1 rounded-full">
                ● Đang luyện tập
              </span>
            )}
          </div>
        </div>
        {/* Level Selection with Topics Below */}
        {!selectedTopic && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Chọn cấp độ luyện tập</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {levels.map((level) => (
                <div key={level.id} className="space-y-4">
                  {/* Level Card */}
                  <div
                    onClick={() => selectLevel(selectedLevel === level.id ? null : level.id)}
                    className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer border-2 ${
                      selectedLevel === level.id ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{level.icon}</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{level.name}</h3>
                      <p className="text-gray-600 text-sm">{level.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {selectedLevel === level.id ? '▼ Ẩn chủ đề' : '▶ Hiện chủ đề'}
                      </p>
                    </div>
                  </div>

                  {/* Topics Below Level */}
                  {selectedLevel === level.id && (
                    <div className="space-y-3 pl-2 border-l-4 border-blue-300">
                      {getTopicsForLevel(level.id).map((topic) => (
                        <div
                          key={topic.id}
                          onClick={() => selectTopic(topic.id)}
                          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-green-300 ml-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{topic.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800">{topic.name}</h4>
                              <p className="text-sm text-gray-600">
                                {topic.count || 0} mục luyện tập
                              </p>
                            </div>
                            <span className="text-gray-400">→</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practice Area - 2 Column Layout (60% left - 40% right) */}
        {selectedTopic && currentItem && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            {/* Left side - Practice (60% width - 3 columns) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
                {/* Header */}
                <div className="text-center mb-3">
                  <h2 className="text-lg font-bold text-gray-800 mb-1">Phát âm mẫu:</h2>
                  <p className="text-xs text-gray-500">
                    {currentItemIndex + 1}/{speakingItems.length}
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center mb-4">
                  {/* English Text */}
                  <div className="text-center mb-4">
                    <p className={`font-bold text-blue-600 mb-1 ${
                      selectedLevel === 'paragraph' ? 'text-xl' : 'text-2xl'
                    }`}>{currentItem.text}</p>
                    {showMeaning && <p className="text-gray-600 italic text-xs">{currentItem.meaning}</p>}
                  </div>

                  {/* Listen Button and Speed Toggle */}
                  <div className="flex gap-2 justify-center mb-4">
                    <button
                      onClick={() => speakSample(currentItem.text, slowSpeed ? 0.7 : 1)}
                      className="px-4 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-semibold text-sm"
                    >
                      🔊 Nghe mẫu
                    </button>
                    <button
                      onClick={() => setSlowSpeed(!slowSpeed)}
                      className={`px-3 py-1.5 rounded font-semibold text-sm transition-all ${
                        slowSpeed
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-400 text-white hover:bg-gray-500'
                      }`}
                    >
                      Tốc độ: {slowSpeed ? 'Chậm' : 'Bình thường'}
                    </button>
                    <button
                      onClick={() => setShowMeaning(!showMeaning)}
                      className={`px-3 py-1.5 rounded font-semibold text-sm transition-all ${
                        showMeaning
                          ? 'bg-purple-500 text-white hover:bg-purple-600'
                          : 'bg-gray-400 text-white hover:bg-gray-500'
                      }`}
                    >
                      Nghĩa: {showMeaning ? 'Hiện' : 'Ẩn'}
                    </button>
                  </div>

                  {/* Speaking Button */}
                  <div className="text-center">
                    <p className="text-gray-600 mb-2 text-xs">Nhấn nút để nói:</p>
                    <button
                      onClick={isListening ? stopListening : startListening}
                      disabled={isListening}
                      className={`px-6 py-2 rounded-lg font-semibold text-white text-sm transition-all ${
                        isListening 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {isListening ? `🛑 Dừng (${listeningTimer}s)` : '🎙️ Nói'}
                    </button>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-2 pt-3 border-t">
                  <button
                    onClick={prevItem}
                    disabled={currentItemIndex === 0}
                    className="flex-1 px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    ← Trước
                  </button>
                  
                  <button
                    onClick={nextItem}
                    className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm"
                  >
                    {currentItemIndex === speakingItems.length - 1 ? 'Hoàn thành' : 'Tiếp →'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right side - Results (40% width - 2 columns) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
                <h3 className="text-sm font-bold text-gray-800 mb-3">Kết quả:</h3>
                
                {showResult ? (
                  <div className="flex-1 space-y-3 overflow-y-auto">
                    {/* User Speech */}
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Bạn nói:</p>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-gray-800 text-xs">{transcript}</p>
                      </div>
                    </div>

                    {/* Word Comparison */}
                    {wordComparison.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">So sánh:</p>
                        <div className="flex flex-wrap gap-1">
                          {wordComparison.map((word, index) => (
                            <span
                              key={index}
                              className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                word.isCorrect 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {word.word}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scores */}
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-xs text-gray-600">Độ chính xác:</span>
                          <span className="text-xs font-bold">{accuracy}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              accuracy >= 80 ? 'bg-green-500' :
                              accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${accuracy}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-xs text-gray-600">Phát âm:</span>
                          <span className="text-xs font-bold">{pronunciationScore}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              pronunciationScore >= 80 ? 'bg-blue-500' :
                              pronunciationScore >= 60 ? 'bg-purple-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${pronunciationScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className={`p-2 rounded text-center text-xs ${
                      accuracy >= 80 ? 'bg-green-50 text-green-700' :
                      accuracy >= 60 ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {accuracy >= 80 ? '🎉 Xuất sắc!' :
                       accuracy >= 60 ? '👍 Khá tốt!' :
                       '💪 Cố gắng thêm!'}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <p className="text-xs mb-1">Nhấn "Nói" để bắt đầu</p>
                      <p className="text-xs">Hãy luyện tập</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Progress Modal */}
        {showProgressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">📈 Tiến độ luyện nói</h2>
                  <button
                    onClick={() => setShowProgressModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {progressData ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{progressData.totalSessions}</div>
                        <div className="text-sm text-gray-600">Tổng phiên luyện</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{progressData.completedTopics.length}</div>
                        <div className="text-sm text-gray-600">Chủ đề hoàn thành</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{Math.round(progressData.totalPracticeTime / 60)} phút</div>
                        <div className="text-sm text-gray-600">Thời gian luyện</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-700 mb-3">Mục tiêu tuần này</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-500 h-3 rounded-full transition-all"
                            style={{ width: `${Math.min(100, (progressData.totalSessions / progressData.weeklyGoal) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {progressData.totalSessions}/{progressData.weeklyGoal}
                        </span>
                      </div>
                    </div>

                    {progressData.completedTopics.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-3">Chủ đề đã hoàn thành</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {progressData.completedTopics.map((topic, index) => (
                            <div key={index} className="bg-green-50 rounded-lg p-3 border border-green-200">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-green-700">
                                  {topic.level} - {topic.topic}
                                </span>
                                <span className="text-sm text-green-600">
                                  {topic.averageScore}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải dữ liệu tiến độ...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Stats Modal */}
        {showDetailedStatsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">📊 Thống kê chi tiết</h2>
                  <button
                    onClick={() => setShowDetailedStatsModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {detailedStats ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-blue-600">{detailedStats.overview.totalSessions}</div>
                        <div className="text-xs text-gray-600">Phiên luyện</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-green-600">{detailedStats.overview.totalPracticeItems}</div>
                        <div className="text-xs text-gray-600">Mục đã luyện</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-purple-600">{detailedStats.overview.averageAccuracy}%</div>
                        <div className="text-xs text-gray-600">Độ chính xác TB</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-orange-600">{detailedStats.overview.averagePronunciation}%</div>
                        <div className="text-xs text-gray-600">Phát âm TB</div>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-indigo-600">{Math.round(detailedStats.overview.totalPracticeTime)}</div>
                        <div className="text-xs text-gray-600">Phút luyện</div>
                      </div>
                    </div>

                    {detailedStats.dailyPractice && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-700 mb-3">Luyện tập 7 ngày qua</h3>
                        <div className="flex items-end gap-2 h-32">
                          {detailedStats.dailyPractice.map((day, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div
                                className="bg-blue-500 rounded-t w-full min-h-[4px] transition-all"
                                style={{ height: `${Math.max(4, (day.itemsCount / 10) * 100)}px` }}
                              />
                              <div className="text-xs text-gray-600 mt-1">
                                {new Date(day.date).getDate()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thống kê chi tiết...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Session Stats Modal */}
        {showSessionStatsModal && currentSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">📊 Thống kê phiên luyện</h3>
                  <button
                    onClick={() => setShowSessionStatsModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {sessionStats.completedItems}/{sessionStats.totalItems}
                      </div>
                      <div className="text-sm text-gray-600">Mục đã hoàn thành</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Tiến độ phiên:</span>
                      <span className="text-sm font-medium">
                        {sessionStats.totalItems > 0 ? Math.round((sessionStats.completedItems / sessionStats.totalItems) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all"
                        style={{ width: `${sessionStats.totalItems > 0 ? (sessionStats.completedItems / sessionStats.totalItems) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{sessionStats.averageAccuracy}%</div>
                      <div className="text-xs text-gray-600">Độ chính xác TB</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">{sessionStats.pronunciationScore}</div>
                      <div className="text-xs text-gray-600">Điểm phát âm TB</div>
                    </div>
                  </div>

                  <div className={`p-3 rounded text-center text-sm ${
                    sessionStats.averageAccuracy >= 80 ? 'bg-green-50 text-green-700' :
                    sessionStats.averageAccuracy >= 60 ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {sessionStats.averageAccuracy >= 80 ? '🎉 Phiên luyện tập xuất sắc!' :
                     sessionStats.averageAccuracy >= 60 ? '👍 Phiên luyện tập tốt!' :
                     '💪 Tiếp tục cố gắng!'}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowSessionStatsModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
                    >
                      Đóng
                    </button>
                    <button
                      onClick={() => {
                        setShowSessionStatsModal(false);
                        completeSession();
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Kết thúc phiên
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mistakes Modal - Luyện lại những từ sai */}
      {showMistakesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">🔄 Luyện lại những từ cần cải thiện</h3>
                <button
                  onClick={() => setShowMistakesModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {mistakeItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-gray-600 text-lg mb-2">Tuyệt vời! Không có từ nào cần luyện lại</p>
                  <p className="text-gray-500 text-sm">Hãy tiếp tục luyện tập để cải thiện kỹ năng phát âm</p>
                  <button
                    onClick={() => setShowMistakesModal(false)}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Current Mistake Item */}
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      {mistakeItemIndex + 1}/{mistakeItems.length}
                    </p>
                    <p className="text-3xl font-bold text-red-600 mb-2">{mistakeItems[mistakeItemIndex].text}</p>
                    <p className="text-sm text-gray-600">{mistakeItems[mistakeItemIndex].meaning}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => speakSample(mistakeItems[mistakeItemIndex].text, slowSpeed ? 0.7 : 1)}
                      className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-semibold text-sm"
                    >
                      🔊 Nghe
                    </button>
                    <button
                      onClick={() => {
                        if (!isListening) {
                          // Tạo recognition mới cho modal
                          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                          const newRecognition = new SpeechRecognition();
                          newRecognition.continuous = false;
                          newRecognition.interimResults = false;
                          newRecognition.lang = 'en-US';

                          newRecognition.onstart = () => {
                            setIsListening(true);
                            setListeningTimer(0);
                            const timer = setInterval(() => {
                              setListeningTimer(prev => {
                                if (prev >= 10) {
                                  clearInterval(timer);
                                  newRecognition.stop();
                                  return prev;
                                }
                                return prev + 1;
                              });
                            }, 1000);
                          };

                          newRecognition.onresult = (event) => {
                            if (event.results && event.results.length > 0) {
                              const text = event.results[0][0].transcript;
                              handleMistakeItemSpeak(text);
                            }
                          };

                          newRecognition.onend = () => {
                            setIsListening(false);
                            setListeningTimer(0);
                          };

                          newRecognition.onerror = (e) => {
                            setIsListening(false);
                            setListeningTimer(0);
                            let errorMessage = 'Lỗi nhận dạng giọng nói: ';
                            switch(e.error) {
                              case 'no-speech':
                                errorMessage += 'Không nhận diện được giọng nói. Vui lòng thử lại.';
                                break;
                              case 'audio-capture':
                                errorMessage += 'Không thể truy cập microphone.';
                                break;
                              case 'not-allowed':
                                errorMessage += 'Quyền truy cập microphone bị từ chối.';
                                break;
                              default:
                                errorMessage += e.error;
                            }
                            alert(errorMessage);
                          };

                          newRecognition.start();
                        } else {
                          stopListening();
                        }
                      }}
                      disabled={isListening}
                      className={`flex-1 px-4 py-2 rounded font-semibold text-sm transition-all ${
                        isListening 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {isListening ? `🛑 Dừng (${listeningTimer}s)` : '🎙️ Nói'}
                    </button>
                  </div>

                  {/* Result Overlay */}
                  {showMistakeResult && mistakeResult && (
                    <div className={`p-4 rounded-lg border-2 ${
                      mistakeResult.isCorrect 
                        ? 'bg-green-50 border-green-300' 
                        : 'bg-yellow-50 border-yellow-300'
                    }`}>
                      <div className="text-center mb-3">
                        <p className={`text-2xl font-bold mb-2 ${
                          mistakeResult.isCorrect ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {mistakeResult.isCorrect ? '✓ Tuyệt vời!' : '○ Cần cải thiện'}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">Bạn nói:</p>
                        <p className="text-gray-800 font-medium text-sm mb-3">{mistakeResult.transcript}</p>
                      </div>
                      <div className="text-center mb-4">
                        <p className="text-xs text-gray-600 mb-1">Độ chính xác:</p>
                        <div className="flex items-center gap-2 justify-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                mistakeResult.accuracy >= 70 ? 'bg-green-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${mistakeResult.accuracy}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold">{mistakeResult.accuracy}%</span>
                        </div>
                      </div>
                      <button
                        onClick={confirmMistakeResult}
                        className={`w-full px-4 py-2 rounded font-semibold text-sm text-white transition-all ${
                          mistakeResult.isCorrect
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-yellow-500 hover:bg-yellow-600'
                        }`}
                      >
                        {mistakeResult.isCorrect ? '✓ Xác nhận' : 'Thử lại'}
                      </button>
                    </div>
                  )}

                  {/* Navigation */}
                  {!showMistakeResult && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setMistakeItemIndex(Math.max(0, mistakeItemIndex - 1))}
                        disabled={mistakeItemIndex === 0}
                        className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        ← Trước
                      </button>
                      <button
                        onClick={() => setMistakeItemIndex(Math.min(mistakeItems.length - 1, mistakeItemIndex + 1))}
                        disabled={mistakeItemIndex === mistakeItems.length - 1}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Tiếp →
                      </button>
                    </div>
                  )}

                  {/* Close Button */}
                  {!showMistakeResult && (
                    <button
                      onClick={() => setShowMistakesModal(false)}
                      className="w-full px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 font-medium text-sm"
                    >
                      Đóng
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}