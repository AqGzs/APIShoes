const express = require('express');
const router = express.Router();


const shoesRoutes = require('./shoes');
const authRoutes = require('./auth');
const favoriteRoutes = require('./favorites');
const userRoutes = require('./users');
const cartRoutes = require('./carts');
const stockRoutes = require('./stocks');
const orderRoutes = require('./orders');
const statsRoutes = require('./stats');
const cateRoutes = require('./categories');



router.use('/api/stocks', stockRoutes);
router.use('/api/shoes', shoesRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/favorites', favoriteRoutes);
router.use('/api/users',userRoutes);
router.use('/api/carts',cartRoutes); 
router.use('/api/stats', statsRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/categories', cateRoutes);

module.exports = router;
