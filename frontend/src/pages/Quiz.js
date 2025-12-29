import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { NavigationContext } from '../context/NavigationContext';

export default function Quiz() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setPageState, clearPageState } = useContext(NavigationContext);
  const level = searchParams.get('level') || 'basic';
  const type = searchParams.get('type') || 'review'; // Mặc định là 'review' cho bài ôn tập
  const specialization = searchParams.get('specialization') || null; // Lấy specialization từ URL
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const levelNames = {
    basic: 'Cơ bản',
    intermediate: 'Trung cấp',
    advanced: 'Nâng cao',
    communication: 'Giao tiếp',
    specialized: 'Chuyên ngành'
  };

  useEffect(() => {
    loadQuestions();
    // Lưu trạng thái trang Learn (Quiz là trang con của Learn)
    setPageState('learn', `/quiz?level=${level}`);
  }, [level, type, setPageState]);

  useEffect(() => {
    if (questions.length > 0 && !startTime) {
      setStartTime(Date.now());
    }
  }, [questions, startTime]);

  useEffect(() => {
    let interval;
    if (startTime && !showResult && type === 'review') {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, showResult, type]);

  // Hàm xáo trộn mảng
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Hàm xáo trộn các đáp án trong câu hỏi
  const shuffleQuestionOptions = (question) => {
    if (type === 'review' && question.options) {
      return {
        ...question,
        options: shuffleArray(question.options)
      };
    }
    return question;
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      console.log(`🔄 Loading ${type} questions for level ${level}`);
      
      let res;
      let questionsData;
      
      if (type === 'review') {
        // Tải câu hỏi ôn tập từ API review
        console.log('📡 Calling review API...');
        let reviewUrl = `/review/questions?level=${level}&limit=10`;
        if (level === 'specialized' && specialization) {
          reviewUrl += `&specialization=${specialization}`;
        }
        res = await API.get(reviewUrl);
        console.log('📡 Review API response:', res.data);
        questionsData = res.data.questions || [];
      } else {
        // Tải câu hỏi flashcard từ API quiz
        console.log('📡 Calling quiz API...');
        res = await API.get(`/quiz/questions?level=${level}&topic=all`);
        console.log('📡 Quiz API response:', res.data);
        questionsData = res.data || [];
      }
      
      console.log(`📊 Loaded ${questionsData.length} questions`);
      
      // Xáo trộn các đáp án cho mỗi câu hỏi
      const shuffledQuestionsData = questionsData.map(q => shuffleQuestionOptions(q));
      
      setQuestions(shuffledQuestionsData);
      setShuffledQuestions(shuffledQuestionsData);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error loading questions:', err);
      console.error('❌ Error details:', err.response?.data);
      alert('Không thể tải câu hỏi: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null || selectedAnswer === '') {
      alert('Vui lòng chọn đáp án');
      return;
    }

    const currentQ = questions[currentQuestion];
    let correct = false;
    
    if (type === 'review') {
      // Với review quiz, selectedAnswer là index của option
      correct = currentQ.options[selectedAnswer]?.isCorrect;
    } else {
      // Với flashcard quiz, selectedAnswer là text của đáp án
      correct = selectedAnswer === currentQ?.correctAnswer;
    }

    setIsCorrect(correct);
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    const currentQ = questions[currentQuestion];
    
    const newAnswers = [...answers, {
      questionId: currentQ?._id,
      selectedAnswer: selectedAnswer,
      isCorrect: isCorrect,
      question: type === 'review' ? currentQ.question : currentQ.word,
      correctAnswer: type === 'review' 
        ? currentQ.options.find(opt => opt.isCorrect)?.text 
        : currentQ.correctAnswer
    }];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowAnswer(false);
      setIsCorrect(false);
    } else {
      submitQuiz(newAnswers, score + (isCorrect ? 1 : 0));
    }
  };

  const submitQuiz = async (finalAnswers, finalScore) => {
    try {
      if (type === 'review') {
        // Submit review result
        const finalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
        const res = await API.post('/review/submit', {
          level,
          category: 'mixed',
          score: finalScore,
          totalQuestions: questions.length,
          timeSpent: finalTimeSpent,
          specialization: specialization // Thêm specialization vào request
        });
        setTimeSpent(finalTimeSpent);
        
        // Kiểm tra nếu hoàn thành cấp độ specialized với điểm tối thiểu
        if (level === 'specialized' && finalScore >= 7) {
          alert(`🎉🎉🎉 CHÚC MỪNG! 🎉🎉🎉\n\nBạn đã hoàn thành tất cả 5 cấp độ của khóa học!\n\n✅ Cơ bản\n✅ Trung cấp\n✅ Nâng cao\n✅ Giao tiếp\n✅ Chuyên ngành\n\nBạn là một học viên xuất sắc! 🌟`);
        } else if (res.data.newLevelUnlocked && res.data.nextLevel) {
          const levelNames = {
            intermediate: 'Trung cấp',
            advanced: 'Nâng cao',
            communication: 'Giao tiếp',
            specialized: 'Chuyên ngành'
          };
          alert(`🎉 Chúc mừng! Bạn đã đạt ${res.data.percentage}% và mở khóa cấp độ ${levelNames[res.data.nextLevel]}!`);
        }
      } else {
        // Submit flashcard quiz result
        const res = await API.post('/quiz/submit', {
          level,
          topic: 'all',
          answers: finalAnswers,
          score: finalScore,
          totalQuestions: questions.length
        });
        
        if (res.data.newLevelUnlocked && res.data.nextLevel) {
          const levelNames = {
            intermediate: 'Trung cấp',
            advanced: 'Nâng cao',
            communication: 'Giao tiếp',
            specialized: 'Chuyên ngành'
          };
          alert(`🎉 Chúc mừng! Bạn đã mở khóa cấp độ ${levelNames[res.data.nextLevel]}!`);
        }
      }
      
      setShowResult(true);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu kết quả');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Đang tải câu hỏi...</p>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return 'Xuất sắc! 🌟';
    if (percentage >= 80) return 'Tốt lắm! 👍';
    if (percentage >= 70) return 'Khá tốt! 📚';
    if (percentage >= 60) return 'Cần cố gắng thêm! 💪';
    return 'Hãy ôn tập lại nhé! 📖';
  };

  if (showResult) {
    const maxScore = type === 'review' ? questions.length : questions.length * 10;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                🎉 Hoàn thành {type === 'review' ? 'bài ôn tập' : 'bài kiểm tra'}!
              </h1>
              <div className={`text-6xl font-bold mb-4 ${getScoreColor()}`}>
                {score}/{maxScore}
              </div>
              <p className="text-2xl text-gray-600 mb-2">{getScoreMessage()}</p>
              <p className="text-gray-500">
                Số câu đúng: {correctAnswers}/{questions.length}
                {type === 'review' && ` • Thời gian: ${formatTime(timeSpent)}`}
              </p>
            </div>

            {/* Kết quả chi tiết cho review */}
            {type === 'review' && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Kết quả chi tiết</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {answers.map((answer, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 ${answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                      <div className="flex items-start gap-3">
                        <span className={`text-2xl ${answer.isCorrect ? '✅' : '❌'}`}></span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 mb-1">Câu {index + 1}: {answer.question}</p>
                          {!answer.isCorrect && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Đáp án đúng:</span> {answer.correctAnswer}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Thông báo mở khóa cấp độ */}
            {(() => {
              const percentage = Math.round((correctAnswers / questions.length) * 100);
              const requiredScore = type === 'review' ? 7 : 70; // 7/10 cho review, 70/100 cho flashcard
              
              if (percentage >= 70) {
                return (
                  <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-xl text-center">
                    <p className="text-green-700 font-bold text-lg mb-2">
                      🎉 Chúc mừng! Bạn đã đạt {percentage}%
                    </p>
                    <p className="text-green-600">
                      {type === 'review' 
                        ? 'Bạn đã hoàn thành xuất sắc bài ôn tập và có thể mở khóa cấp độ tiếp theo!'
                        : 'Bạn đã vượt qua bài kiểm tra và mở khóa cấp độ tiếp theo!'
                      }
                    </p>
                  </div>
                );
              } else {
                return (
                  <div className="mb-6 p-4 bg-orange-100 border-2 border-orange-300 rounded-xl text-center">
                    <p className="text-orange-700 font-bold text-lg mb-2">
                      📚 Cần cố gắng thêm!
                    </p>
                    <p className="text-orange-600">
                      Cần đạt tối thiểu 70% (7/10 câu đúng) để mở khóa cấp độ tiếp theo. Hãy ôn tập và thử lại nhé!
                    </p>
                  </div>
                );
              }
            })()}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                🔄 Làm lại
              </button>
              <button
                onClick={() => {
                  setPageState('learn', `/level-topics?level=${level}`);
                  navigate('/dashboard');
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                🏠 Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  if (!currentQ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Không có câu hỏi nào để hiển thị</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-4 px-3">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold text-gray-800">
              {type === 'review' ? '📝 Bài ôn tập' : '🧠 Kiểm tra'} - {levelNames[level]}
            </h1>
            {type === 'review' && (
              <div className="text-right">
                <p className="text-xs text-gray-600">Thời gian</p>
                <p className="text-base font-bold text-blue-600">{formatTime(timeSpent)}</p>
              </div>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1.5">
              <span>Câu {currentQuestion + 1} / {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-5">
          {type === 'review' ? (
            // Review question format
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-800 mb-2.5">
                {currentQ.question}
              </h2>
              <p className="text-base text-gray-600 italic">
                {currentQ.questionVi}
              </p>
            </div>
          ) : (
            // Flashcard question format
            <div className="text-center mb-5">
              {currentQ?.image && (
                <div className="text-5xl mb-3">{currentQ.image}</div>
              )}
              <h3 className="text-2xl font-bold text-gray-800 mb-1.5">{currentQ?.word}</h3>
              {currentQ?.pronunciation && (
                <p className="text-base text-gray-600">/{currentQ.pronunciation}/</p>
              )}
              <p className="text-base font-semibold text-gray-700 mt-4">
                Nghĩa của từ này là gì?
              </p>
            </div>
          )}

          {/* Answer Options */}
          <div className="space-y-2.5 mb-4">
            {type === 'review' ? (
              // Review options (multiple choice)
              currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showAnswer && setSelectedAnswer(index)}
                  disabled={showAnswer}
                  className={`w-full p-3 text-left rounded-lg border-2 text-sm transition-all duration-200 ${
                    showAnswer
                      ? (option.isCorrect 
                          ? 'border-green-500 bg-green-100' 
                          : (selectedAnswer === index 
                              ? 'border-red-500 bg-red-100' 
                              : 'border-gray-200 bg-gray-50'))
                      : (selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50')
                  } ${showAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{String.fromCharCode(65 + index)}. {option.text}</p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              // Flashcard options (single correct answer)
              <button
                onClick={() => setSelectedAnswer(currentQ?.correctAnswer)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === currentQ?.correctAnswer
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <span className="text-lg">{currentQ?.correctAnswer}</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-3">
            <button
              onClick={() => {
                clearPageState('learn');
                navigate('/dashboard');
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm hover:bg-gray-500 transition-colors"
            >
              ❌ Thoát
            </button>
            
            <div className="flex gap-3">
              {!showAnswer ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedAnswer === null || selectedAnswer === ''}
                  className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    selectedAnswer !== null && selectedAnswer !== ''
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  🔍 Kiểm tra
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  {currentQuestion < questions.length - 1 ? '➡️ Câu tiếp theo' : '🏁 Hoàn thành'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
