const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([{ name: 'Adidas Ultraboost', brand: 'Adidas', size: [42], price: 150, stock: 5, colors: ['black', 'white'], imageUrl: 'https://example.com/image.jpg' }]);
});

router.post('/', (req, res) => {
  const { shoeId } = req.body;
  res.status(201).json({ message: 'Shoe added to favorites', shoeId });
});

module.exports = router;
