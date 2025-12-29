import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { loadVoices } from '../utils/speechHelper';
import { NavigationContext } from '../context/NavigationContext';

export default function SpeakingScenarios() {
  const { setPageState } = useContext(NavigationContext);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [pronunciationScore, setPronunciationScore] = useState(0);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    completedItems: 0,
    totalItems: 0,
    averageAccuracy: 0,
    pronunciationScore: 0
  });
  const [userSettings, setUserSettings] = useState(null);

  const scenarios = {
    shopping: {
      name: 'Mua sắm',
      icon: '🛒',
      description: 'Luyện nói trong cửa hàng',
      items: [
        { id: 1, text: 'How much is this shirt?', meaning: 'Cái áo này giá bao nhiêu?' },
        { id: 2, text: 'Do you have this in blue?', meaning: 'Bạn có màu xanh không?' },
        { id: 3, text: 'Can I try this on?', meaning: 'Tôi có thể thử không?' },
        { id: 4, text: 'I\'d like to return this item.', meaning: 'Tôi muốn trả lại món này.' },
        { id: 5, text: 'Where is the fitting room?', meaning: 'Phòng thử đồ ở đâu?' }
      ]
    },
    restaurant: {
      name: 'Nhà hàng',
      icon: '🍽️',
      description: 'Đặt bàn và gọi món',
      items: [
        { id: 1, text: 'A table for two, please.', meaning: 'Một bàn cho hai người.' },
        { id: 2, text: 'What do you recommend?', meaning: 'Bạn khuyên gì?' },
        { id: 3, text: 'I\'ll have the steak.', meaning: 'Tôi sẽ ăn bò steak.' },
        { id: 4, text: 'Can I have the bill?', meaning: 'Tôi có thể lấy hóa đơn không?' },
        { id: 5, text: 'The food is delicious!', meaning: 'Món ăn ngon quá!' }
      ]
    },
    interview: {
      name: 'Phỏng vấn',
      icon: '💼',
      description: 'Trả lời phỏng vấn việc làm',
      items: [
        { id: 1, text: 'Tell me about yourself.', meaning: 'Kể về bản thân bạn.' },
        { id: 2, text: 'What are your strengths?', meaning: 'Điểm mạnh của bạn là gì?' },
        { id: 3, text: 'Why do you want this job?', meaning: 'Tại sao bạn muốn công việc này?' },
        { id: 4, text: 'What is your experience?', meaning: 'Kinh nghiệm của bạn như thế nào?' },
        { id: 5, text: 'Do you have any questions?', meaning: 'Bạn có câu hỏi nào không?' }
      ]
    },
    travel: {
      name: 'Du lịch',
      icon: '✈️',
      description: 'Hỏi đường và đặt phòng',
      items: [
        { id: 1, text: 'Where is the train station?', meaning: 'Ga tàu ở đâu?' },
        { id: 2, text: 'How do I get to the airport?', meaning: 'Làm thế nào để đến sân bay?' },
        { id: 3, text: 'I\'d like to book a room.', meaning: 'Tôi muốn đặt phòng.' },
        { id: 4, text: 'What time does the bus leave?', meaning: 'Xe buýt khởi hành lúc mấy giờ?' },
        { id: 5, text: 'Can you recommend a good restaurant?', meaning: 'Bạn có thể giới thiệu một nhà hàng tốt không?' }
      ]
    },
    medical: {
      name: 'Khám bệnh',
      icon: '🏥',
      description: 'Mô tả triệu chứng và hỏi bác sĩ',
      items: [
        { id: 1, text: 'I have a headache.', meaning: 'Tôi bị đau đầu.' },
        { id: 2, text: 'How often do you exercise?', meaning: 'Bạn tập thể dục bao thường xuyên?' },
        { id: 3, text: 'Are you allergic to any medication?', meaning: 'Bạn có dị ứng với thuốc nào không?' },
        { id: 4, text: 'Please describe your symptoms.', meaning: 'Hãy mô tả triệu chứng của bạn.' },
        { id: 5, text: 'When did the pain start?', meaning: 'Đau bắt đầu từ khi nào?' }
      ]
    }
  };

  useEffect(() => {
    loadUserSettings();
    setPageState('speaking-scenarios', '/speaking-scenarios');
  }, [setPageState]);

  const loadUserSettings = async () => {
    try {
      const res = await API.get('/user/profile');
      setUserSettings(res.data.settings);
      loadVoices();
    } catch (err) {
      console.error('Lỗi tải cài đặt:', err);
    }
  };

  const startSpeakingSession = async () => {
    try {
      const response = await API.post('/speaking/start', {
        level: 'conversation',
        topic: selectedScenario,
        scenario: selectedScenario
      });
      setCurrentSession(response.data.sessionId);
      setSessionStats({
        completedItems: 0,
        totalItems: scenarios[selectedScenario].items.length,
        averageAccuracy: 0,
        pronunciationScore: 0
      });
    } catch (error) {
      console.error('Lỗi bắt đầu phiên luyện nói:', error);
    }
  };

  const saveSpeakingResult = async (itemId, text, meaning, spokenText, accuracy, pronunciationScore) => {
    if (!currentSession) return;

    try {
      const response = await API.post('/speaking/save-result', {
        sessionId: currentSession,
        itemId,
        text,
        meaning,
        spokenText,
        accuracy,
        pronunciationScore
      });
      setSessionStats(response.data.session);
    } catch (error) {
      console.error('Lỗi lưu kết quả:', error);
    }
  };

  const completeSpeakingSession = async () => {
    if (!currentSession) return;

    try {
      await API.post('/speaking/complete', {
        sessionId: currentSession
      });
      setCurrentSession(null);
      alert('Đã hoàn thành phiên luyện nói theo tình huống!');
    } catch (error) {
      console.error('Lỗi hoàn thành phiên:', error);
    }
  };

  const calculateAccuracy = async (userText) => {
    if (!currentItem) return;

    const targetWords = currentItem.text.toLowerCase().split(/\s+/);
    const userWords = userText.toLowerCase().split(/\s+/);

    let correctWords = 0;
    const comparison = targetWords.map(word => {
      const isCorrect = userWords.some(uWord =>
        uWord.includes(word) || word.includes(uWord)
      );
      if (isCorrect) correctWords++;
      return { word, isCorrect };
    });

    const acc = Math.round((correctWords / targetWords.length) * 100);
    const pronunciationScore = calculatePronunciationScore(currentItem.text, userText);

    setAccuracy(acc);
    setPronunciationScore(pronunciationScore);

    if (currentSession) {
      await saveSpeakingResult(
        currentItem.id,
        currentItem.text,
        currentItem.meaning,
        userText,
        acc,
        pronunciationScore
      );
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
    const exactBonus = spoken === target ? 20 : 0;

    return Math.min(100, Math.max(0, baseScore + exactBonus));
  };

  const getScoreLevel = (score) => {
    if (score >= 90) return { level: 'Xuất sắc', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 80) return { level: 'Tốt', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 70) return { level: 'Khá', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (score >= 60) return { level: 'Trung bình', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { level: 'Cần cải thiện', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      alert('Trình duyệt không hỗ trợ nhận dạng giọng nói');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      if (event.results && event.results.length > 0) {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        calculateAccuracy(text);
        setShowResult(true);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      alert('Lỗi nhận dạng giọng nói: ' + e.error);
    };

    recognition.start();
  };

  const speakSample = (text) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const selectScenario = (scenarioId) => {
    setSelectedScenario(scenarioId);
    setCurrentItem(scenarios[scenarioId].items[0]);
    setTranscript('');
    setShowResult(false);
    setAccuracy(0);
    setPronunciationScore(0);
  };

  const nextItem = () => {
    const items = scenarios[selectedScenario].items;
    const currentIndex = items.findIndex(item => item.id === currentItem.id);
    if (currentIndex < items.length - 1) {
      setCurrentItem(items[currentIndex + 1]);
      setTranscript('');
      setShowResult(false);
      setAccuracy(0);
      setPronunciationScore(0);
    } else {
      // End of scenario
      if (currentSession) {
        completeSpeakingSession();
      }
    }
  };

  const prevItem = () => {
    const items = scenarios[selectedScenario].items;
    const currentIndex = items.findIndex(item => item.id === currentItem.id);
    if (currentIndex > 0) {
      setCurrentItem(items[currentIndex - 1]);
      setTranscript('');
      setShowResult(false);
      setAccuracy(0);
      setPronunciationScore(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎭 Luyện nói theo tình huống</h1>
          <p className="text-gray-600">Thực hành tiếng Anh trong các tình huống thực tế</p>
        </div>

        {!selectedScenario ? (
          <>
            {/* Scenario Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {Object.entries(scenarios).map(([id, scenario]) => (
                <div
                  key={id}
                  onClick={() => selectScenario(id)}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-300"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{scenario.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{scenario.name}</h3>
                    <p className="text-gray-600 text-sm">{scenario.description}</p>
                    <div className="mt-3 text-xs text-gray-500">
                      {scenario.items.length} câu hội thoại
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Back to Speaking */}
            <div className="text-center">
              <Link
                to="/speaking"
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 inline-block"
              >
                ← Quay lại luyện nói cơ bản
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Scenario Header */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{scenarios[selectedScenario].icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{scenarios[selectedScenario].name}</h2>
                    <p className="text-gray-600 text-sm">{scenarios[selectedScenario].description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!currentSession ? (
                    <button
                      onClick={startSpeakingSession}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                    >
                      🎯 Bắt đầu phiên
                    </button>
                  ) : (
                    <div className="text-sm text-gray-600">
                      Đã hoàn thành: {sessionStats.completedItems}/{sessionStats.totalItems}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setSelectedScenario(null);
                      setCurrentSession(null);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-medium"
                  >
                    Chọn lại
                  </button>
                </div>
              </div>
            </div>

            {/* Practice Area */}
            {currentItem && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Practice */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">💬 Câu hội thoại</h3>

                  {/* Sample Text */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-xl font-bold text-blue-600 mb-2">{currentItem.text}</p>
                    <p className="text-gray-700 italic">{currentItem.meaning}</p>
                  </div>

                  {/* Controls */}
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => speakSample(currentItem.text)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
                    >
                      🔊 Nghe mẫu
                    </button>
                    <button
                      onClick={startListening}
                      disabled={isListening}
                      className={`px-4 py-2 rounded font-medium ${
                        isListening
                          ? 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isListening ? '🎙️ Đang nghe...' : '🎙️ Nói theo'}
                    </button>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <button
                      onClick={prevItem}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-medium"
                    >
                      ← Trước
                    </button>
                    <button
                      onClick={nextItem}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                    >
                      Tiếp →
                    </button>
                  </div>
                </div>

                {/* Right: Results */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Kết quả</h3>

                  {showResult ? (
                    <div className="space-y-4">
                      {/* User Speech */}
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Bạn nói:</p>
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-gray-800">{transcript}</p>
                        </div>
                      </div>

                      {/* Scores */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Độ chính xác:</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all ${
                                  accuracy >= 80 ? 'bg-green-500' :
                                  accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${accuracy}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold">{accuracy}%</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-1">Điểm phát âm:</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all ${
                                  pronunciationScore >= 80 ? 'bg-blue-500' :
                                  pronunciationScore >= 60 ? 'bg-purple-500' : 'bg-orange-500'
                                }`}
                                style={{ width: `${pronunciationScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold">{pronunciationScore}</span>
                          </div>
                          <div className={`mt-1 px-2 py-0.5 rounded text-xs font-medium ${getScoreLevel(pronunciationScore).bgColor} ${getScoreLevel(pronunciationScore).color}`}>
                            {getScoreLevel(pronunciationScore).level}
                          </div>
                        </div>
                      </div>

                      {/* Feedback */}
                      <div className={`p-3 rounded ${
                        accuracy >= 80 ? 'bg-green-50 text-green-700' :
                        accuracy >= 60 ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {accuracy >= 80 ? '🎉 Tuyệt vời! Bạn đã nói rất chuẩn.' :
                         accuracy >= 60 ? '👍 Khá tốt! Cố gắng cải thiện thêm.' :
                         '💪 Cần luyện tập nhiều hơn.'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Nhấn nút "Nói theo" để bắt đầu
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}