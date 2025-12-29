import { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { loadVoices } from '../utils/speechHelper';
import { NavigationContext } from '../context/NavigationContext';

export default function SpeakingFlashcard() {
  const [searchParams] = useSearchParams();
  const { setPageState } = useContext(NavigationContext);
  const flashcardId = searchParams.get('id');

  const [flashcard, setFlashcard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [pronunciationScore, setPronunciationScore] = useState(0);
  const [currentSession, setCurrentSession] = useState(null);
  const [userSettings, setUserSettings] = useState(null);

  useEffect(() => {
    if (flashcardId) {
      loadFlashcard();
    }
    loadUserSettings();
    setPageState('speaking-flashcard', `/speaking-flashcard?id=${flashcardId}`);
  }, [flashcardId, setPageState]);

  const loadFlashcard = async () => {
    try {
      const response = await API.get(`/flashcards/${flashcardId}`);
      setFlashcard(response.data);
    } catch (error) {
      console.error('Lỗi tải flashcard:', error);
    }
  };

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
        level: 'basic',
        topic: 'flashcard-practice',
        scenario: 'flashcard'
      });
      setCurrentSession(response.data.sessionId);
    } catch (error) {
      console.error('Lỗi bắt đầu phiên luyện nói:', error);
    }
  };

  const saveSpeakingResult = async (spokenText, accuracy, pronunciationScore) => {
    if (!currentSession || !flashcard) return;

    try {
      await API.post('/speaking/save-result', {
        sessionId: currentSession,
        itemId: flashcard._id,
        text: flashcard.word,
        meaning: flashcard.meaning,
        spokenText,
        accuracy,
        pronunciationScore
      });
    } catch (error) {
      console.error('Lỗi lưu kết quả:', error);
    }
  };

  const calculateAccuracy = async (userText) => {
    if (!flashcard) return;

    const targetWords = flashcard.word.toLowerCase().split(/\s+/);
    const userWords = userText.toLowerCase().split(/\s+/);

    let correctWords = 0;
    targetWords.forEach(word => {
      if (userWords.some(uWord => uWord.includes(word) || word.includes(uWord))) {
        correctWords++;
      }
    });

    const acc = Math.round((correctWords / targetWords.length) * 100);
    const pronunciationScore = calculatePronunciationScore(flashcard.word, userText);

    setAccuracy(acc);
    setPronunciationScore(pronunciationScore);

    if (currentSession) {
      await saveSpeakingResult(userText, acc, pronunciationScore);
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

  const speakWord = (text) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!flashcard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải flashcard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🗣️ Luyện nói với Flashcard</h1>
          <p className="text-gray-600">Học từ vựng và luyện phát âm cùng lúc</p>
        </div>

        {/* Flashcard */}
        <div className="flex justify-center mb-8">
          <div className="perspective-1000">
            <div
              className={`relative cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ width: '320px', height: '420px' }}
            >
              {/* Front */}
              <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-400">
                <div className="relative h-full flex flex-col justify-between p-6 bg-gradient-to-br from-purple-50 to-white">
                  <div className="text-center flex-1 flex flex-col justify-center">
                    <h2 className="text-4xl font-bold text-purple-600 mb-4">{flashcard.word}</h2>
                    {flashcard.pronunciation && (
                      <p className="text-xl text-gray-600 mb-4">/{flashcard.pronunciation}/</p>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(flashcard.word);
                      }}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium shadow-md transform hover:scale-105 transition-all"
                    >
                      🔊 Phát âm
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Nhấn để lật thẻ</p>
                  </div>
                </div>
              </div>

              {/* Back */}
              <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-pink-400 rotate-y-180">
                <div className="relative h-full flex flex-col justify-between p-6 bg-gradient-to-br from-pink-50 to-white">
                  <div className="text-center flex-1 flex flex-col justify-center">
                    <p className="text-3xl font-bold text-gray-800 mb-4">{flashcard.meaning}</p>
                    {flashcard.example && (
                      <div className="bg-white bg-opacity-80 rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-700 italic mb-2">"{flashcard.example}"</p>
                        <div className="flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakWord(flashcard.example);
                            }}
                            className="px-3 py-1.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium text-sm shadow-md transform hover:scale-105 transition-all"
                          >
                            🔊 Nghe ví dụ
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Nhấn để lật thẻ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Speaking Practice */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">🎤 Luyện phát âm từ vựng</h2>

          {!currentSession && (
            <div className="text-center mb-6">
              <button
                onClick={startSpeakingSession}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                🎯 Bắt đầu luyện nói
              </button>
            </div>
          )}

          <div className="flex justify-center mb-4">
            <button
              onClick={startListening}
              disabled={isListening}
              className={`px-8 py-4 rounded-lg font-medium text-white text-lg ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isListening ? '🎙️ Đang nghe...' : '🎙️ Nói từ này'}
            </button>
          </div>

          {showResult && (
            <div className="max-w-md mx-auto space-y-4">
              {/* User Speech */}
              <div>
                <p className="text-sm text-gray-600 mb-1 text-center">Bạn nói:</p>
                <div className="bg-gray-50 rounded p-3 text-center">
                  <p className="text-lg text-gray-800">{transcript}</p>
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
              <div className={`p-3 rounded text-center ${
                accuracy >= 80 ? 'bg-green-50 text-green-700' :
                accuracy >= 60 ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
              }`}>
                {accuracy >= 80 ? '🎉 Xuất sắc! Phát âm rất chuẩn.' :
                 accuracy >= 60 ? '👍 Khá tốt! Cố gắng thêm chút nữa.' :
                 '💪 Cần luyện tập nhiều hơn.'}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="text-center space-x-4">
          <Link
            to="/learn-cards"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 inline-block"
          >
            ← Quay lại học Flashcard
          </Link>
          <Link
            to="/speaking"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
          >
            Luyện nói khác →
          </Link>
        </div>
      </div>
    </div>
  );
}