require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const secret = process.env.SECRET_KEY;

  // Middleware to authenticate token
  const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization header:', authHeader); // Log header Authorization
    
    if (!authHeader) {
      console.log('Authorization header is missing');
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Received token:', token);

    try {
      const verified = jwt.verify(token, secret);
      req.user = verified;
      console.log('Token is valid, user verified:', verified);
      next();
    } catch (error) {
      console.log('Invalid token:', error.message);
      res.status(401).json({ message: 'Invalid token', error: error.message });
    }
  };

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


  module.exports = router;
