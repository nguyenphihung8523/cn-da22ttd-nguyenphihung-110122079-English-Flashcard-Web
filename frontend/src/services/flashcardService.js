import API from './api';

export const getFlashcards = async () => {
  const res = await API.get('/flashcards');
  return res.data;
};
