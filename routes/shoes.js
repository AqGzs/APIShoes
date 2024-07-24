const express = require('express');
const router = express.Router();
const Shoe = require('../models/Shoe');
const Stock = require('../models/Stock');

router.post('/', async (req, res) => {
  try {
    // Create new stock entries
    const stockPromises = req.body.stocks.map(stock => new Stock(stock).save());
    const stocks = await Promise.all(stockPromises);
    const stockIds = stocks.map(stock => stock._id);

    const newShoe = new Shoe({ ...req.body, stocks: stockIds });
    await newShoe.save();
    res.status(201).json(newShoe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    console.log("Received payload for update:", req.body);
    const shoe = await Shoe.findById(req.params.id);
    if (shoe == null) {
      return res.status(404).json({ message: 'Cannot find shoe' });
    }

    if (req.body.stocks != null) {
      await Stock.deleteMany({ _id: { $in: shoe.stocks } });
      const stocks = await Stock.insertMany(req.body.stocks);
      shoe.stocks = stocks.map(stock => stock._id);
    }

    for (const key in req.body) {
      if (req.body[key] != null && key !== 'stocks') {
        shoe[key] = req.body[key];
      }
    }

    const updatedShoe = await shoe.save();
    res.json(updatedShoe);
  } catch (error) {
    console.error("Error updating shoe:", error);
    res.status(400).json({ message: error.message, error });
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
