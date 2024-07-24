// routes/stock.js
const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');

// Create a new stock
router.post('/', async (req, res) => {
  try {
    const newStock = new Stock(req.body);
    await newStock.save();
    res.status(201).json(newStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all stocks
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a stock by ID
router.get('/:id', async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a stock by ID
router.put('/:id', async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Cannot find stock' });

    if (req.body.size != null) {
      stock.size = req.body.size;
    }
    if (req.body.quantity != null) {
      stock.quantity = req.body.quantity;
    }

    const updatedStock = await stock.save();
    res.json(updatedStock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a stock by ID
router.delete('/:id', async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
