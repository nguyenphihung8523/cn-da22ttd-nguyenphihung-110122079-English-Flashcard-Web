import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

// Câu hỏi đánh giá trình độ
const assessmentQuestions = [
  {
    id: 1,
    question: 'What is the meaning of "Hello"?',
    options: ['Tạm biệt', 'Xin chào', 'Cảm ơn', 'Xin lỗi'],
    correct: 1,
    level: 'basic'
  },
  {
    id: 2,
    question: 'Choose the correct word: "I ___ a student."',
    options: ['is', 'am', 'are', 'be'],
    correct: 1,
    level: 'basic'
  },
  {
    id: 3,
    question: 'What color is the sky?',
    options: ['Red', 'Green', 'Blue', 'Yellow'],
    correct: 2,
    level: 'basic'
  },
  {
    id: 4,
    question: 'Choose the correct sentence:',
    options: [
      'She go to school every day.',
      'She goes to school every day.',
      'She going to school every day.',
      'She gone to school every day.'
    ],
    correct: 1,
    level: 'intermediate'
  },
  {
    id: 5,
    question: 'What is the past tense of "eat"?',
    options: ['eated', 'ate', 'eaten', 'eating'],
    correct: 1,
    level: 'intermediate'
  },
  {
    id: 6,
    question: 'Choose the correct preposition: "I am interested ___ learning English."',
    options: ['on', 'at', 'in', 'for'],
    correct: 2,
    level: 'intermediate'
  },
  {
    id: 7,
    question: 'What does "ubiquitous" mean?',
    options: ['Rare', 'Present everywhere', 'Expensive', 'Beautiful'],
    correct: 1,
    level: 'advanced'
  },
  {
    id: 8,
    question: 'Choose the correct form: "If I ___ rich, I would travel the world."',
    options: ['am', 'was', 'were', 'be'],
    correct: 2,
    level: 'advanced'
  },
  {
    id: 9,
    question: 'What is the synonym of "meticulous"?',
    options: ['Careless', 'Thorough', 'Quick', 'Lazy'],
    correct: 1,
    level: 'advanced'
  },
  {
    id: 10,
    question: 'Choose the correct sentence:',
    options: [
      'Neither the students nor the teacher were present.',
      'Neither the students nor the teacher was present.',
      'Neither the students nor the teacher are present.',
      'Neither the students nor the teacher is present.'
    ],
    correct: 1,
    level: 'advanced'
  }
];

export default function AssessmentTest() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [determinedLevel, setDeterminedLevel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    assessmentQuestions.forEach(q => {
      if (answers[q.id] === q.correct) {
        correct++;
      }
    });
    return (correct / assessmentQuestions.length) * 100;
  };

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    
    let level = 'basic';
    if (finalScore >= 80) {
      level = 'advanced';
    } else if (finalScore >= 60) {
      level = 'intermediate';
    }
    setDeterminedLevel(level);

    setIsSubmitting(true);
    try {
      await API.post('/user/assessment/save', {
        score: finalScore,
        answers: answers
      });
      setShowResult(true);
    } catch (error) {
      console.error('Lỗi lưu kết quả:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (window.confirm('Bạn có chắc muốn bỏ qua? Bạn sẽ bắt đầu từ cấp độ Cơ bản.')) {
      try {
        await API.post('/user/assessment/skip');
        navigate('/dashboard');
      } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra');
      }
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  const currentQ = assessmentQuestions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / assessmentQuestions.length) * 100;

  if (showResult) {
    const levelInfo = {
      basic: { name: 'Cơ bản', icon: '🌱', color: 'blue', description: 'Bạn sẽ bắt đầu với từ vựng cơ bản' },
      intermediate: { name: 'Trung cấp', icon: '📚', color: 'green', description: 'Bạn đã mở khóa cấp độ Cơ bản và Trung cấp' },
      advanced: { name: 'Nâng cao', icon: '🎓', color: 'purple', description: 'Bạn đã mở khóa cấp độ Cơ bản, Trung cấp và Nâng cao' }
    };
    const info = levelInfo[determinedLevel];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">{info.icon}</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Kết quả đánh giá</h1>
          
          <div className="my-6">
            <div className="text-5xl font-bold text-blue-600 mb-2">{Math.round(score)}%</div>
            <p className="text-gray-600">Điểm số của bạn</p>
          </div>

          <div className={`bg-${info.color}-50 rounded-xl p-4 mb-6`}>
            <p className="text-sm text-gray-600 mb-1">Trình độ được xác định:</p>
            <p className={`text-2xl font-bold text-${info.color}-600`}>{info.name}</p>
            <p className="text-sm text-gray-600 mt-2">{info.description}</p>
          </div>

          <button
            onClick={handleContinue}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Bắt đầu học ngay →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">📝 Đánh giá trình độ</h1>
          <p className="text-blue-100">Trả lời các câu hỏi để xác định cấp độ phù hợp</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-3 mb-6">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-white text-sm mb-6">
          Đã trả lời: {answeredCount}/{assessmentQuestions.length}
        </p>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">Câu {currentQuestion + 1}/{assessmentQuestions.length}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              currentQ.level === 'basic' ? 'bg-blue-100 text-blue-700' :
              currentQ.level === 'intermediate' ? 'bg-green-100 text-green-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {currentQ.level === 'basic' ? 'Cơ bản' : 
               currentQ.level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
            </span>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-6">{currentQ.question}</h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQ.id, index)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  answers[currentQ.id] === index
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="flex-1 px-4 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Trước
          </button>
          
          {currentQuestion === assessmentQuestions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={answeredCount < assessmentQuestions.length || isSubmitting}
              className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Hoàn thành ✓'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Tiếp →
            </button>
          )}
        </div>

        {/* Skip Button */}
        <div className="text-center mt-6">
          <button
            onClick={handleSkip}
            className="text-white/70 hover:text-white text-sm underline"
          >
            Bỏ qua, bắt đầu từ cấp độ Cơ bản
          </button>
        </div>
      </div>
    </div>
  );
}
