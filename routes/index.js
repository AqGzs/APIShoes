const express = require('express');
const router = express.Router();

const shoesRoutes = require('./shoes');
const authRoutes = require('./auth');
const favoritesRoutes = require('./favorites');

router.use('/shoes', shoesRoutes);
router.use('/auth', authRoutes);
router.use('/favorites', favoritesRoutes);

module.exports = router;
