import React, { createContext, useState, useCallback } from 'react';

export const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  // Lưu trạng thái của các trang chính
  const [lastPageState, setLastPageState] = useState({
    learn: null,        // Lưu URL của trang Learn (ví dụ: /level-topics?level=basic)
    quiz: null,         // Lưu URL của trang Quiz
    speaking: null,     // Lưu URL của trang Speaking
    favorites: null,    // Lưu URL của trang Favorites
    mistakes: null,     // Lưu URL của trang Mistakes
  });

  // Hàm cập nhật trạng thái trang
  const setPageState = useCallback((page, url) => {
    setLastPageState(prev => ({
      ...prev,
      [page]: url
    }));
  }, []);

  // Hàm lấy URL của trang
  const getPageState = useCallback((page) => {
    return lastPageState[page];
  }, [lastPageState]);

  // Hàm xóa trạng thái trang
  const clearPageState = useCallback((page) => {
    setLastPageState(prev => ({
      ...prev,
      [page]: null
    }));
  }, []);

  return (
    <NavigationContext.Provider value={{
      lastPageState,
      setPageState,
      getPageState,
      clearPageState
    }}>
      {children}
    </NavigationContext.Provider>
  );
}
