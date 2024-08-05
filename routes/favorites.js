const express = require('express');
const router = express.Router();
const Shoe = require('../models/Shoe'); 

// Endpoint để lấy các sản phẩm yêu thích
router.get('/', async (req, res) => {
  try {
    const favorites = await Shoe.find(); // Assuming you store all shoes in Shoe collection
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint để thêm sản phẩm vào danh sách yêu thích
router.post('/', async (req, res) => {
  const { shoeId } = req.body;
  try {
    const shoe = await Shoe.findById(shoeId);
    if (shoe) {
      res.status(201).json({ message: 'Shoe added to favorites', shoe });
    } else {
      res.status(404).json({ message: 'Shoe not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
