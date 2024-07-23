const express = require('express');
const router = express.Router();

const shoesRoutes = require('./shoes');
const authRoutes = require('./auth');
const favoriteRoutes = require('./favorites');
const userRoutes = require('./users');
const cartRoutes = require('./cart');

router.use('/shoes', shoesRoutes);
router.use('/auth', authRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/users', userRoutes);
router.use('/cart', cartRoutes);

module.exports = router;


