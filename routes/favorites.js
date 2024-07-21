const express = require('express');
const router = express.Router();

let favorites = []; // Mảng lưu trữ các sản phẩm yêu thích

// Endpoint để lấy các sản phẩm yêu thích
router.get('/favorites', (req, res) => {
  res.json(favorites);
});

// Endpoint để thêm sản phẩm vào danh sách yêu thích
router.post('/favorite', (req, res) => {
  const { shoeId } = req.body;
  if (shoeId) {
    favorites.push(shoeId);
    res.status(201).json({ message: 'Shoe added to favorites', shoeId });
  } else {
    res.status(400).json({ message: 'Shoe ID is required' });
  }
});

// Endpoint để xóa sản phẩm khỏi danh sách yêu thích
router.delete('/favorite/:id', (req, res) => {
  const { id } = req.params;
  favorites = favorites.filter(fav => fav !== id);
  res.status(200).json({ message: 'Shoe removed from favorites', id });
});

module.exports = router;
