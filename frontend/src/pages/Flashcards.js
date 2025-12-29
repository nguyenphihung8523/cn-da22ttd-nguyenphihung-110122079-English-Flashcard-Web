import { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { NavigationContext } from '../context/NavigationContext';

export default function Flashcards() {
  const { setPageState } = useContext(NavigationContext);
  const [customCards, setCustomCards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [formData, setFormData] = useState({
    word: '',
    pronunciation: '',
    image: '',
    meaning: '',
    example: '',
    exampleTranslation: ''
  });

  useEffect(() => {
    setPageState('flashcards', '/flashcards');
    loadCustomCards();
  }, [setPageState]);

  const loadCustomCards = async () => {
    try {
      const res = await API.get('/user/custom-flashcards');
      setCustomCards(res.data || []);
    } catch (err) {
      console.error('Lỗi tải flashcard tự tạo:', err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image if it's too large
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize if image is too large
          if (width > 400 || height > 400) {
            const ratio = Math.min(400 / width, 400 / height);
            width = width * ratio;
            height = height * ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
          setImagePreview(compressedImage);
          setFormData({ ...formData, image: compressedImage });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.word || !formData.meaning) {
      alert('Vui lòng nhập từ vựng và nghĩa');
      return;
    }

    try {
      const res = await API.post('/user/custom-flashcards', formData);
      setCustomCards([...customCards, res.data]);
      
      // Reset form
      setFormData({
        word: '',
        pronunciation: '',
        image: '',
        meaning: '',
        example: '',
        exampleTranslation: ''
      });
      setImagePreview(null);
      setShowForm(false);
      
      alert('✓ Thêm flashcard thành công!');
    } catch (err) {
      console.error('Lỗi thêm flashcard:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi thêm flashcard';
      alert('Lỗi: ' + errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa flashcard này?')) {
      try {
        await API.delete(`/user/custom-flashcards/${id}`);
        setCustomCards(customCards.filter(card => card._id !== id));
        alert('✓ Xóa flashcard thành công!');
      } catch (err) {
        console.error('Lỗi xóa flashcard:', err);
        alert('Có lỗi xảy ra khi xóa flashcard');
      }
    }
  };

  const handleFlipCard = (cardId) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">📇 Flashcard của tôi</h2>
          <p className="text-gray-600">Tạo và quản lý flashcard tự tạo của bạn</p>
        </div>

        {/* Floating Add Button */}
        <button
          onClick={() => setShowForm(true)}
          className="fixed left-6 top-24 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-3xl font-bold transition-all transform hover:scale-110 z-40"
          title="Tạo flashcard mới"
        >
          +
        </button>

        {/* Custom Flashcards Grid */}
        {customCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">Bạn chưa tạo flashcard nào</p>
            <p className="text-gray-500 mb-6">Nhấn nút "+" ở góc trái để tạo flashcard mới</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {customCards.map((card, index) => {
              const isFlipped = flippedCards.has(card._id);
              return (
                <div key={card._id} className="flex justify-center perspective-1000">
                  <div 
                    className={`relative cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                    onClick={() => handleFlipCard(card._id)}
                    style={{ 
                      transformStyle: 'preserve-3d',
                      width: '240px',
                      height: '320px'
                    }}
                  >
                    {/* Front Side */}
                    <div 
                      className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-300 hover:shadow-xl transition-shadow"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-white h-full flex flex-col justify-between">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(card._id);
                            }}
                            className="text-red-500 hover:text-red-700 text-xl hover:scale-110 transition-transform"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-center items-center">
                          {card.image && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden mb-3 border-2 border-blue-300 flex items-center justify-center bg-gray-100">
                              {card.image.startsWith('data:') ? (
                                <img src={card.image} alt={card.word} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-4xl">{card.image}</span>
                              )}
                            </div>
                          )}
                          <h3 className="text-2xl font-bold text-blue-600 mb-2 text-center">{card.word}</h3>
                          {card.pronunciation && (
                            <p className="text-sm text-gray-600">/{card.pronunciation}/</p>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Nhấn để lật thẻ</p>
                        </div>
                      </div>
                    </div>

                    {/* Back Side */}
                    <div 
                      className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-cyan-300 hover:shadow-xl transition-shadow rotate-y-180"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <div className="p-4 bg-gradient-to-br from-cyan-50 to-white h-full flex flex-col justify-between">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(card._id);
                            }}
                            className="text-red-500 hover:text-red-700 text-xl hover:scale-110 transition-transform"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-center items-center px-3">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Nghĩa:</p>
                          <p className="text-lg font-bold text-gray-800 mb-3 text-center">{card.meaning}</p>
                          
                          {card.example && (
                            <div className="bg-white bg-opacity-80 rounded-lg p-3 shadow-sm w-full">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Ví dụ:</p>
                              <p className="text-sm text-gray-700 italic mb-1">"{card.example}"</p>
                              {card.exampleTranslation && (
                                <p className="text-xs text-gray-600">"{card.exampleTranslation}"</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Nhấn để lật lại</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-blue-600 text-white p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Tạo Flashcard Mới</h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setImagePreview(null);
                  setFormData({
                    word: '',
                    pronunciation: '',
                    image: '',
                    meaning: '',
                    example: '',
                    exampleTranslation: ''
                  });
                }}
                className="text-2xl hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Mặt Trước */}
              <div className="border-b-2 pb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Mặt Trước</h4>
                
                {/* Word Input */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Từ vựng *
                  </label>
                  <input
                    type="text"
                    name="word"
                    value={formData.word}
                    onChange={handleInputChange}
                    placeholder="Nhập từ vựng"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Pronunciation Input */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phiên âm
                  </label>
                  <input
                    type="text"
                    name="pronunciation"
                    value={formData.pronunciation}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: /kæt/"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh đại diện
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {imagePreview && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-blue-500 flex items-center justify-center bg-gray-100">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Chọn ảnh từ máy tính của bạn</p>
                </div>
              </div>

              {/* Mặt Sau */}
              <div className="border-b-2 pb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Mặt Sau</h4>
                
                {/* Meaning Input */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nghĩa *
                  </label>
                  <input
                    type="text"
                    name="meaning"
                    value={formData.meaning}
                    onChange={handleInputChange}
                    placeholder="Nhập nghĩa của từ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Example Input */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ví dụ
                  </label>
                  <textarea
                    name="example"
                    value={formData.example}
                    onChange={handleInputChange}
                    placeholder="Nhập ví dụ sử dụng từ này"
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Example Translation Input */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dịch ví dụ
                  </label>
                  <textarea
                    name="exampleTranslation"
                    value={formData.exampleTranslation}
                    onChange={handleInputChange}
                    placeholder="Nhập dịch của ví dụ"
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setImagePreview(null);
                    setFormData({
                      word: '',
                      pronunciation: '',
                      image: '',
                      meaning: '',
                      example: '',
                      exampleTranslation: ''
                    });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Thêm Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS for 3D flip animation */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
