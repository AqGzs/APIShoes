const express = require('express');
const router = express.Router();


const shoesRoutes = require('./shoes');
const authRoutes = require('./auth');
const favoriteRoutes = require('./favorites');
const userRoutes = require('./users');
const cartRoutes = require('./carts');
const paymentRoutes = require('./payment');
const stockRoutes = require('./stocks');
const statsRoutes = require('./stats');

router.use('/api/stocks', stockRoutes);
router.use('/api/shoes', shoesRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/favorites', favoriteRoutes);
router.use('/api/users',userRoutes);
router.use('/api/carts',cartRoutes); 
router.use('/api/stats', statsRoutes);
router.use('/',paymentRoutes)

module.exports = router;
