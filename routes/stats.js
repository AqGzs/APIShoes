// routes/stats.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Shoe = require('../models/Shoe');

// Get user registration statistics
router.get('/user-registrations', async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedStats = stats.map(stat => ({
      date: stat._id,
      count: stat.count,
    }));

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Function to get stock stats grouped by month
router.get('/stock/monthly', async (req, res) => {
  try {
    const stocks = await Shoe.aggregate([
      { $unwind: '$stocks' },
      { $lookup: { from: 'stocks', localField: 'stocks', foreignField: '_id', as: 'stockDetails' } },
      { $unwind: '$stockDetails' },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          totalQuantity: { $sum: '$stockDetails.quantity' },
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
