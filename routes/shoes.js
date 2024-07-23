const express = require('express');
const router = express.Router();
const Shoe = require('../models/Shoe');

// Tạo một đôi giày mới
router.post('/', async (req, res) => {
  try {
    const newShoe = new Shoe(req.body);
    await newShoe.save();
    res.status(201).json(newShoe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy tất cả các đôi giày
router.get('/', async (req, res) => {
  try {
    const shoes = await Shoe.find();
    res.json(shoes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy chi tiết một đôi giày theo ID
router.get('/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) return res.status(404).json({ message: 'Shoe not found' });
    res.json(shoe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật một đôi giày theo ID
router.put('/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shoe) return res.status(404).json({ message: 'Shoe not found' });
    res.json(shoe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Xóa một đôi giày theo ID
router.delete('/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndDelete(req.params.id);
    if (!shoe) return res.status(404).json({ message: 'Shoe not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { name: new RegExp(search, 'i') }; // Tìm kiếm không phân biệt chữ hoa/chữ thường
    }
    const shoes = await Shoe.find(query);
    res.json(shoes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
