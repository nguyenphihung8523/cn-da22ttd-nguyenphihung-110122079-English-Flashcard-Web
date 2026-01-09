const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if(!username || !email || !password) return res.status(400).json({message: 'Vui lòng điền đầy đủ thông tin'});

    // Kiểm tra email đã tồn tại
    const existEmail = await User.findOne({ email });
    if(existEmail) return res.status(400).json({message: 'Email đã được sử dụng'});

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hash });
    await newUser.save();

    res.status(201).json({message: 'Đăng ký thành công'});
  } catch (err) {
    console.error('Register error:', err);
    // Xử lý lỗi duplicate key từ MongoDB
    if (err.code === 11000) {
      return res.status(400).json({message: 'Email đã được sử dụng'});
    }
    res.status(500).json({message: 'Lỗi server: ' + err.message});
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: '***' });
    
    if(!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({message: 'Vui lòng nhập email và mật khẩu'});
    }

    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if(!user) {
      console.log('User not found:', email);
      return res.status(400).json({message: 'Người dùng không tồn tại'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    if(!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({message: 'Mật khẩu không đúng'});
    }

    const token = jwt.sign({ 
      id: user._id, 
      username: user.username,
      role: user.role 
    }, process.env.JWT_SECRET || 'secretkey123', { expiresIn: '7d' });
    console.log('Login successful for:', email, 'Role:', user.role);
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email,
        role: user.role,
        hasCompletedAssessment: user.hasCompletedAssessment || false
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({message: 'Lỗi server: ' + err.message});
  }
};

module.exports = { register, login };
