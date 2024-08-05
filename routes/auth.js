require('dotenv').config(); // Load environment variables
const express = require('express');
const bcrypt = require('bcryptjs'); // Use bcryptjs instead of bcrypt
const { body, validationResult } = require('express-validator'); // Import express-validator
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET_KEY; 

// Login Endpoint
router.post('/login', 
  [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Email or password is incorrect' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Email or password is incorrect' });
      }
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
      res.status(200).json({ token, userId: user.id });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Registration Endpoint
router.post('/register', 
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password
      const newUser = new User({ name, email, password: hashedPassword }); // Use User model
      await newUser.save(); // Save new user to database
      res.status(201).json(newUser); // Return success response
    } catch (error) {
      console.error('Error during user registration:', error); // Log detailed error
      res.status(500).json({ error: 'Failed to register user', details: error.message }); // Return error response with details
    }
});

router.post('/recover', (req, res) => {
  const { email } = req.body;
  res.status(200).json({ message: 'Recovery email sent' });
});

router.post('/reset', async (req, res) => {
  const { token, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hash new password
  // Logic for password reset
  res.status(200).json({ message: 'Password reset successfully' });
});

module.exports = router;
