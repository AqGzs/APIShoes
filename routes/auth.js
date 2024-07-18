const express = require('express');
const bcrypt = require('bcryptjs'); // Sử dụng bcryptjs thay vì bcrypt
const User = require('./User'); // Import the User model
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Logic xử lý đăng nhập
  res.status(200).json({ token: 'dummy_token' });
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash mật khẩu
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save(); // Save the new user to MongoDB
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
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
