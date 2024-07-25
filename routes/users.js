require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const secret = process.env.SECRET_KEY;
const authenticateToken =  require('../middlewares/authenticateToken')
  // Route to get user details
  router.get('/:id', authenticateToken, async (req, res) => {
    try {
      console.log('Fetching user details for ID:', req.params.id);
      const user = await User.findById(req.params.id);
      if (!user) {
        console.log('User not found for ID:', req.params.id);
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
// Update user details
  router.put('/:id', authenticateToken, async (req, res) => {
    try {
      const userId = req.params.id;
      const updateData = req.body;

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

module.exports = router;
