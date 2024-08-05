const express = require('express');
const router = express.Router();
const Shoe = require('../models/Shoe');
const Stock = require('../models/Stock');

  router.post('/', async (req, res) => {
    try {
      const { name, brand, price, stocks, colors, imageUrl, descriptions } = req.body;
    const stockData = stocks.map(stock => ({
      size: stock.size,
      quantity: stock.quantity
    }));

    const stockDocuments = await Stock.insertMany(stockData);
    const stockIds = stockDocuments.map(stock => stock._id);

    const newShoe = new Shoe({
      name,
      brand,
      price,
      stocks: stockIds,
      colors,
      imageUrl,
      descriptions
    });
      await newShoe.save();
      res.status(201).json(newShoe);
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

// Get shoe details by ID
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

// Update a shoe by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, brand, price, stocks, colors, imageUrl, descriptions } = req.body;

    // Update or create stocks
    await Promise.all(stocks.map(async (stock) => {
      if (stock._id) {
        await Stock.findByIdAndUpdate(stock._id, stock);
      } else {
        const newStock = new Stock(stock);
        await newStock.save();
        stock._id = newStock._id;
      }
    }));

    const updatedShoe = await Shoe.findByIdAndUpdate(
      req.params.id,
      { name, brand, price, stocks: stocks.map(stock => stock._id), colors, imageUrl, descriptions },
      { new: true }
    ).populate('stocks');

    if (!updatedShoe) return res.status(404).json({ message: 'Shoe not found' });
    res.json(updatedShoe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a shoe by ID
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
