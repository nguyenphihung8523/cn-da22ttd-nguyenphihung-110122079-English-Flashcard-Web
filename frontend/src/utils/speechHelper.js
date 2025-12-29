// Helper function để phát âm với cài đặt user
export const speakWithSettings = (text, userSettings = null) => {
  if (!('speechSynthesis' in window)) {
    alert('Trình duyệt không hỗ trợ phát âm');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Áp dụng cài đặt giọng nói từ user settings
  if (userSettings) {
    // Chọn ngôn ngữ theo accent
    const targetLang = userSettings.voiceAccent === 'uk' ? 'en-GB' : 'en-US';
    utterance.lang = targetLang;
    
    // Lấy danh sách giọng nói có sẵn
    const voices = window.speechSynthesis.getVoices();
    
    console.log('=== Voice Selection Debug ===');
    console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
    console.log('Target settings:', { lang: targetLang, gender: userSettings.voiceGender });
    
    // Bước 1: Lọc giọng theo locale chính xác (en-US hoặc en-GB)
    let exactLangVoices = voices.filter(voice => voice.lang === targetLang);
    
    console.log(`Voices with exact locale (${targetLang}):`, exactLangVoices.map(v => ({ name: v.name, lang: v.lang })));
    
    // Bước 2: Nếu không có giọng chính xác, lấy tất cả giọng tiếng Anh
    if (exactLangVoices.length === 0) {
      exactLangVoices = voices.filter(voice => voice.lang.startsWith('en'));
      console.log('No exact match, using all English voices:', exactLangVoices.map(v => v.name));
    }
    
    // Bước 3: Tìm giọng theo giới tính trong danh sách đã lọc
    let selectedVoice = null;
    
    // Danh sách tên giọng theo giới tính và locale
    const femaleNames = ['female', 'woman', 'samantha', 'victoria', 'karen', 'zira', 'hazel', 'susan', 'kate', 'serena', 'fiona'];
    const maleNames = ['male', 'man', 'david', 'mark', 'daniel', 'alex', 'george', 'james', 'oliver', 'thomas', 'rishi'];
    
    // Ưu tiên giọng có locale chính xác
    const priorityVoices = exactLangVoices.filter(v => v.lang === targetLang);
    const fallbackVoices = exactLangVoices.filter(v => v.lang !== targetLang);
    
    if (userSettings.voiceGender === 'female') {
      // Tìm giọng nữ trong priority trước (loại trừ giọng nam)
      selectedVoice = priorityVoices.find(voice => {
        const voiceName = voice.name.toLowerCase();
        const isFemale = femaleNames.some(name => voiceName.includes(name));
        const isMale = maleNames.some(name => voiceName.includes(name));
        return isFemale && !isMale; // Phải là nữ và không phải nam
      });
      // Nếu không có, tìm trong fallback
      if (!selectedVoice) {
        selectedVoice = fallbackVoices.find(voice => {
          const voiceName = voice.name.toLowerCase();
          const isFemale = femaleNames.some(name => voiceName.includes(name));
          const isMale = maleNames.some(name => voiceName.includes(name));
          return isFemale && !isMale;
        });
      }
    } else {
      // Tìm giọng nam trong priority trước (loại trừ giọng nữ)
      selectedVoice = priorityVoices.find(voice => {
        const voiceName = voice.name.toLowerCase();
        const isMale = maleNames.some(name => voiceName.includes(name));
        const isFemale = femaleNames.some(name => voiceName.includes(name));
        return isMale && !isFemale; // Phải là nam và không phải nữ
      });
      // Nếu không có, tìm trong fallback
      if (!selectedVoice) {
        selectedVoice = fallbackVoices.find(voice => {
          const voiceName = voice.name.toLowerCase();
          const isMale = maleNames.some(name => voiceName.includes(name));
          const isFemale = femaleNames.some(name => voiceName.includes(name));
          return isMale && !isFemale;
        });
      }
    }
    
    // Bước 4: Nếu vẫn không tìm thấy, chọn giọng đầu tiên có locale đúng
    if (!selectedVoice && priorityVoices.length > 0) {
      selectedVoice = priorityVoices[0];
      console.log('Using first voice with correct locale');
    }
    
    // Bước 5: Fallback cuối cùng
    if (!selectedVoice && exactLangVoices.length > 0) {
      selectedVoice = exactLangVoices[0];
      console.log('Using first English voice');
    }
    
    if (selectedVoice) {
      console.log('✓ Selected voice:', { name: selectedVoice.name, lang: selectedVoice.lang });
      utterance.voice = selectedVoice;
    } else {
      console.log('✗ No suitable voice found, using browser default');
    }
    console.log('=== End Debug ===');
  } else {
    utterance.lang = 'en-US';
  }
  
  window.speechSynthesis.speak(utterance);
};

// Load voices khi app khởi động
export const loadVoices = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    // Đợi voices load xong
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
};
