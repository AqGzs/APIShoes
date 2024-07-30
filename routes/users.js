require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const secret = process.env.SECRET_KEY;
const path = require('path');
const fs = require('fs');
const multer = require('multer');

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

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Use the directory created or existing
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Endpoint to update user avatar
router.put('/:userId/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const avatarPath = req.file.path;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove old avatar file if it exists
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, '..', user.avatar);
      fs.unlink(oldAvatarPath, (err) => {
        if (err) {
          console.error('Failed to remove old avatar:', err);
        }
      });
    }

    // Generate the public URL for the avatar
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user avatar', error: error.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get a user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
