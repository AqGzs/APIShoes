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

// Cập nhật thông tin một đôi giày
router.put('/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (shoe == null) {
      return res.status(404).json({ message: 'Cannot find shoe' });
    }

    if (req.body.name != null) {
      shoe.name = req.body.name;
    }
    if (req.body.brand != null) {
      shoe.brand = req.body.brand;
    }
    if (req.body.price != null) {
      shoe.price = req.body.price;
    }
    if (req.body.stocks != null) {
      shoe.stocks = req.body.stocks;
    }
    if (req.body.colors != null) {
      shoe.colors = req.body.colors;
    }
    if (req.body.imageUrl != null) {
      shoe.imageUrl = req.body.imageUrl;
    }
    if (req.body.discriptions != null) {
      shoe.discriptions = req.body.discriptions;
    }

    const updatedShoe = await shoe.save();
    res.json(updatedShoe);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

module.exports = router;
