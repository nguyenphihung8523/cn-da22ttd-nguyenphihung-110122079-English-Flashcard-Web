const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Lấy thông tin user
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật thông tin user
const updateProfile = async (req, res) => {
  try {
    const { username, gender, birthDate, avatar, selectedSpecialization } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, gender, birthDate, avatar, selectedSpecialization },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật' });
  }
};

// Cập nhật cài đặt
const updateSettings = async (req, res) => {
  try {
    const { voiceGender, voiceAccent, showImages } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        settings: {
          voiceGender,
          voiceAccent,
          showImages
        }
      },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật cài đặt' });
  }
};

// Đăng xuất tất cả thiết bị (giả lập - trong thực tế cần token blacklist)
const logoutAll = async (req, res) => {
  try {
    // Trong thực tế, bạn cần implement token blacklist hoặc refresh token
    // Ở đây chỉ trả về success để client xóa token
    res.json({ message: 'Đã đăng xuất khỏi tất cả thiết bị' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đổi mật khẩu
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Thêm từ yêu thích
const addFavorite = async (req, res) => {
  try {
    const { flashcardId } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user.favoriteWords.includes(flashcardId)) {
      user.favoriteWords.push(flashcardId);
      await user.save();
    }
    
    res.json({ message: 'Đã thêm vào yêu thích' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa từ yêu thích
const removeFavorite = async (req, res) => {
  try {
    const { flashcardId } = req.body;
    const user = await User.findById(req.user.id);
    
    user.favoriteWords = user.favoriteWords.filter(id => id.toString() !== flashcardId);
    await user.save();
    
    res.json({ message: 'Đã xóa khỏi yêu thích' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách từ yêu thích
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoriteWords');
    res.json(user.favoriteWords);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Thêm flashcard tự tạo
const addCustomFlashcard = async (req, res) => {
  try {
    const { word, pronunciation, image, meaning, example, exampleTranslation } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Limit image size to prevent MongoDB document size issues
    let processedImage = image;
    if (image && image.startsWith('data:')) {
      // If image is base64, keep it but warn if too large
      if (image.length > 500000) { // ~500KB limit
        return res.status(400).json({ message: 'Ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn' });
      }
    }
    
    const newCard = {
      _id: new Date().getTime().toString(),
      word: word.trim(),
      pronunciation: pronunciation.trim(),
      image: processedImage,
      meaning: meaning.trim(),
      example: example.trim(),
      exampleTranslation: exampleTranslation.trim(),
      createdAt: new Date()
    };
    
    if (!user.customFlashcards) {
      user.customFlashcards = [];
    }
    
    user.customFlashcards.push(newCard);
    await user.save();
    
    res.json(newCard);
  } catch (err) {
    console.error('Lỗi thêm flashcard:', err);
    res.status(500).json({ message: 'Lỗi thêm flashcard: ' + err.message });
  }
};

// Lấy danh sách flashcard tự tạo
const getCustomFlashcards = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.customFlashcards || []);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa flashcard tự tạo
const deleteCustomFlashcard = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    
    user.customFlashcards = user.customFlashcards.filter(card => card._id.toString() !== id);
    await user.save();
    
    res.json({ message: 'Đã xóa flashcard' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa flashcard' });
  }
};

// Gửi phản hồi
const sendFeedback = async (req, res) => {
  try {
    const { type, subject, message } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    if (!user.feedbacks) {
      user.feedbacks = [];
    }

    const newFeedback = {
      type,
      subject,
      message,
      status: 'pending',
      createdAt: new Date()
    };

    user.feedbacks.push(newFeedback);
    await user.save();

    res.json({ message: 'Gửi phản hồi thành công', feedback: newFeedback });
  } catch (err) {
    console.error('Lỗi gửi phản hồi:', err);
    res.status(500).json({ message: 'Lỗi gửi phản hồi' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateSettings,
  changePassword,
  logoutAll,
  addFavorite,
  removeFavorite,
  getFavorites,
  addCustomFlashcard,
  getCustomFlashcards,
  deleteCustomFlashcard,
  sendFeedback
};
