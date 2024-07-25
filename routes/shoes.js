const express = require('express');
const router = express.Router();
const Shoe = require('../models/Shoe');
const Stock = require('../models/Stock');

// Tạo một đôi giày mới
router.post('/', async (req, res) => {
  try {
    const stockData = req.body.stocks;
    const stocks = await Stock.insertMany(stockData.map(stock => ({
      size: stock.size,
      quantity: stock.quantity
    })));
    const stockIds = stocks.map(stock => stock._id);
    const newShoe = new Shoe({ ...req.body, stocks: stockIds });
    await newShoe.save();
    res.status(201).json(newShoe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cập nhật thông tin một đôi giày
router.put('/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) {
      return res.status(404).json({ message: 'Cannot find shoe' });
    }

    const stockData = req.body.stocks;
    const stocks = await Stock.insertMany(stockData);
    const stockIds = stocks.map(stock => stock._id);

    shoe.name = req.body.name;
    shoe.brand = req.body.brand;
    shoe.price = req.body.price;
    shoe.stocks = stockIds;
    shoe.colors = req.body.colors;
    shoe.imageUrl = req.body.imageUrl;
    shoe.discriptions = req.body.discriptions;

    const updatedShoe = await shoe.save();
    res.json(updatedShoe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Get all shoes
router.get('/', async (req, res) => {
  try {
    const shoes = await Shoe.find().populate('stocks');
    res.json(shoes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get shoe by ID
router.get('/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id).populate('stocks');
    if (!shoe) return res.status(404).json({ message: 'Shoe not found' });
    const totalStock = shoe.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
    res.json({ ...shoe.toObject(), totalStock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete shoe by ID
router.delete('/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndDelete(req.params.id);
    if (!shoe) return res.status(404).json({ message: 'Shoe not found' });
    // Optionally, delete associated stocks
    await Stock.deleteMany({ _id: { $in: shoe.stocks } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
