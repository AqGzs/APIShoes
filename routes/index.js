const express = require('express');
const router = express.Router();

const shoesRoutes = require('./shoes');
const authRoutes = require('./auth');
const favoritesRoutes = require('./favorites');
const userRoutes = require('./users');
<<<<<<< HEAD
const cartRoutes = require('./cart');
=======
>>>>>>> ceca45fc7873fd67d74e1c8fb5065f47d502c095
router.use('/shoes', shoesRoutes);
router.use('/auth', authRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/users',userRoutes);
<<<<<<< HEAD
router.use('/cart', cartRoutes);
=======
>>>>>>> ceca45fc7873fd67d74e1c8fb5065f47d502c095

module.exports = router;

