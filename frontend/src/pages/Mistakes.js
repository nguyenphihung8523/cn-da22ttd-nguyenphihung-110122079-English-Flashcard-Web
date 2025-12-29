import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { NavigationContext } from '../context/NavigationContext';

export default function Mistakes() {
  const { setPageState } = useContext(NavigationContext);
  const [mistakes, setMistakes] = useState([]);

  useEffect(() => {
    loadMistakes();
    // Lưu trạng thái trang Mistakes
    setPageState('mistakes', '/mistakes');
  }, [setPageState]);

  const loadMistakes = async () => {
    try {
      const res = await API.get('/learning/mistakes');
      setMistakes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Từ cần ôn lại 📝</h2>

      {mistakes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">Bạn chưa có từ nào cần ôn lại</p>
          <Link to="/learn" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block">
            Bắt đầu học
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {mistakes.map(mistake => (
            <div key={mistake._id} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-red-600 mb-2">{mistake.flashcard.word}</h3>
                {mistake.flashcard.pronunciation && (
                  <p className="text-gray-600 mb-2">/{mistake.flashcard.pronunciation}/</p>
                )}
                <p className="text-lg text-gray-800 mb-2">{mistake.flashcard.meaning}</p>
                {mistake.flashcard.example && (
                  <p className="text-sm text-gray-600 italic">Ví dụ: {mistake.flashcard.example}</p>
                )}
              </div>
              <div className="text-center ml-6">
                <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center">
                  <div>
                    <p className="text-3xl font-bold text-red-600">{mistake.mistakeCount}</p>
                    <p className="text-xs text-red-600">lần sai</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
