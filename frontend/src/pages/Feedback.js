import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Feedback() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await API.get('/user/profile');
      setUser(res.data);
      setMyFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error('Error loading user:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await API.post('/user/feedback', {
        type: feedbackType,
        subject: subject.trim(),
        message: message.trim()
      });
      
      setSubject('');
      setMessage('');
      setFeedbackType('suggestion');
      loadUser(); // Reload to get updated feedbacks
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const feedbackTypes = [
    { value: 'suggestion', label: '💡 Góp ý', color: 'blue' },
    { value: 'bug', label: '🐛 Báo lỗi', color: 'red' },
    { value: 'question', label: '❓ Câu hỏi', color: 'purple' },
    { value: 'other', label: '📝 Khác', color: 'gray' }
  ];

  const getTypeLabel = (type) => {
    const found = feedbackTypes.find(t => t.value === type);
    return found ? found.label : '📝 Khác';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">⏳ Chờ xử lý</span>;
      case 'read':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">👁️ Đã xem</span>;
      case 'resolved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">✅ Đã xử lý</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">💬 Gửi phản hồi</h1>
        <p className="text-gray-600">Ý kiến của bạn giúp chúng tôi cải thiện ứng dụng tốt hơn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form gửi phản hồi */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📤 Gửi phản hồi mới</h2>
          
          {user && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Gửi từ: <span className="font-semibold">{user.username}</span></p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại phản hồi</label>
              <div className="grid grid-cols-2 gap-2">
                {feedbackTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFeedbackType(type.value)}
                    className={`p-2 rounded-lg border-2 text-sm transition-all ${
                      feedbackType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Nhập tiêu đề..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mô tả chi tiết..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">{message.length}/1000</p>
            </div>

            {error && (
              <div className="p-2 bg-red-100 text-red-700 rounded-lg text-sm">❌ {error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold text-white transition-all ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? '⏳ Đang gửi...' : '📤 Gửi phản hồi'}
            </button>
          </form>
        </div>

        {/* Lịch sử phản hồi */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Lịch sử phản hồi</h2>
          
          {myFeedbacks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-gray-500">Bạn chưa gửi phản hồi nào</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {[...myFeedbacks].reverse().map((fb, index) => (
                <div key={fb._id || index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">{getTypeLabel(fb.type)}</span>
                    {getStatusBadge(fb.status)}
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">{fb.subject}</h4>
                  <p className="text-gray-600 text-sm mb-2">{fb.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(fb.createdAt).toLocaleString('vi-VN')}
                  </p>
                  
                  {/* Admin Reply */}
                  {fb.adminReply && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-xs text-blue-600 font-semibold mb-1">💬 Phản hồi từ Admin:</p>
                      <p className="text-sm text-gray-700">{fb.adminReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
