import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { NavigationContext } from '../context/NavigationContext';
import { speakWithSettings, loadVoices } from '../utils/speechHelper';

export default function Favorites() {
  const { setPageState } = useContext(NavigationContext);
  const [favorites, setFavorites] = useState([]);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [userSettings, setUserSettings] = useState(null);

  useEffect(() => {
    loadFavorites();
    loadUserSettings();
    // Lưu trạng thái trang Favorites
    setPageState('favorites', '/favorites');
  }, [setPageState]);

  const loadFavorites = async () => {
    try {
      const res = await API.get('/user/favorites');
      setFavorites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUserSettings = async () => {
    try {
      const res = await API.get('/user/profile');
      setUserSettings(res.data);
      loadVoices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await API.post('/user/favorites/remove', { flashcardId: id });
      setFavorites(favorites.filter(f => f._id !== id));
      // Remove from flipped cards if it was flipped
      setFlippedCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err) {
      console.error(err);
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

  const handleSpeak = (word) => {
    speakWithSettings(word, userSettings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Từ yêu thích ⭐</h2>
          {favorites.length > 0 && (
            <p className="text-gray-600">Tổng cộng {favorites.length} từ</p>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">Bạn chưa có từ yêu thích nào</p>
            <Link to="/learn" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block">
              Bắt đầu học
            </Link>
          </div>
        ) : (
          <>
            {/* Flashcards Grid - Hiển thị ngang */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              {favorites.map((card, index) => {
                const isFlipped = flippedCards.has(card._id);
                return (
                  <div key={card._id} className="flex justify-center perspective-1000">
                    <div 
                      className={`relative cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
                        isFlipped ? 'rotate-y-180' : ''
                      }`}
                      onClick={() => handleFlipCard(card._id)}
                      style={{ 
                        width: '240px',
                        height: '320px'
                      }}
                    >
                      {/* Mặt trước - Front */}
                      <div 
                        className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-400"
                      >
                        <div className="relative h-full flex flex-col justify-between p-4 bg-gradient-to-br from-blue-50 to-white">
                          {/* Header với số thứ tự và nút xóa */}
                          <div className="flex justify-between items-start">
                            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(card._id);
                              }}
                              className="text-red-500 hover:text-red-700 text-xl hover:scale-110 transition-transform"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Content chính */}
                          <div className="flex-1 flex flex-col justify-center items-center">
                            <h3 className="text-3xl font-bold text-blue-600 mb-3 text-center">{card.word}</h3>
                            {card.pronunciation && (
                              <p className="text-lg text-gray-600 mb-3">/{card.pronunciation}/</p>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeak(card.word);
                              }}
                              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium shadow-md transform hover:scale-105 transition-all"
                            >
                              🔊 Phát âm
                            </button>
                          </div>

                          {/* Footer */}
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Nhấn để lật thẻ</p>
                          </div>
                        </div>
                      </div>

                      {/* Mặt sau - Back */}
                      <div 
                        className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-400 rotate-y-180"
                      >
                        <div className="relative h-full flex flex-col justify-between p-4 bg-gradient-to-br from-cyan-50 to-white">
                          {/* Header với số thứ tự */}
                          <div className="flex justify-between items-start">
                            <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(card._id);
                              }}
                              className="text-red-500 hover:text-red-700 text-xl hover:scale-110 transition-transform"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Content chính */}
                          <div className="flex-1 flex flex-col justify-center items-center px-3">
                            <p className="text-2xl font-bold text-gray-800 mb-4 text-center">{card.meaning}</p>
                            
                            {card.example && (
                              <div className="bg-white bg-opacity-80 rounded-lg p-3 shadow-sm w-full">
                                <p className="text-sm text-gray-700 italic mb-2 text-center">"{card.example}"</p>
                                <div className="flex justify-center">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSpeak(card.example);
                                    }}
                                    className="px-3 py-1.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium text-sm shadow-md transform hover:scale-105 transition-all"
                                  >
                                    🔊 Nghe ví dụ
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Nhấn để lật thẻ</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
