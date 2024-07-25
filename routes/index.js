const express = require('express');
const router = express.Router();

const shoesRoutes = require('./shoes');
const authRoutes = require('./auth');
const favoriteRoutes = require('./favorites');
const userRoutes = require('./users');
const cartRoutes = require('./carts');
const paymentRoutes = require('./payment');
const stockRoutes = require('./stocks');

router.use('/stocks', stockRoutes);
router.use('/api/shoes', shoesRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/favorites', favoritesRoutes);
router.use('/api/users',userRoutes);
router.use('/api/carts',cartRoutes); 
router.use('/',paymentRoutes)

module.exports = router;
