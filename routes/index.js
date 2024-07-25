const express = require('express');
const router = express.Router();

const shoesRoutes = require('./shoes');
const authRoutes = require('./auth');
const favoriteRoutes = require('./favorites');
const userRoutes = require('./users');
const cartRoutes = require('./cart');
const stockRoutes = require('./stocks'); // Changed from stockRouter to stockRoutes for consistency

router.use('/shoes', shoesRoutes);
router.use('/auth', authRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/users', userRoutes);
router.use('/cart', cartRoutes);
router.use('/stocks', stockRoutes); // Corrected to router.use

module.exports = router;
