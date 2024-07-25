require('dotenv').config(); // Add this line to load environment variables
const express = require('express');
const bcrypt = require('bcryptjs'); // Sử dụng bcryptjs thay vì bcrypt
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET_KEY; 

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Logic xử lý đăng nhập
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    res.status(200).json({ token, userId: user.id }); // Changed userid to userId
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash mật khẩu
    const newUser = new User({ name, email, password: hashedPassword }); // Sử dụng mô hình User
    await newUser.save(); // Lưu người dùng mới vào cơ sở dữ liệu
    res.status(201).json(newUser); // Trả về phản hồi thành công
  } catch (error) {
    console.error('Error during user registration:', error); // Log lỗi chi tiết
    res.status(500).json({ error: 'Failed to register user', details: error.message }); // Trả về phản hồi lỗi với chi tiết
  }
});

router.post('/recover', (req, res) => {
  const { email } = req.body;
  res.status(200).json({ message: 'Recovery email sent' });
});

router.post('/reset', async (req, res) => {
  const { token, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hash mật khẩu mới
  // Logic xử lý reset mật khẩu
  res.status(200).json({ message: 'Password reset successfully' });
});

module.exports = router;
