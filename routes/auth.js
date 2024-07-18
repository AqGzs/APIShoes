const express = require('express');
const bcrypt = require('bcryptjs'); // Sử dụng bcryptjs thay vì bcrypt
const router = express.Router();
const User = require('../models/User');


router.post('/login', async (req, res) => {
  const { email, password } = new auth(req.body) ;
  // Logic xử lý đăng nhập
  res.status(200).json({ token: 'dummy_token' });
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
