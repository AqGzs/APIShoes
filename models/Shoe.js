// shoe.js
const mongoose = require('mongoose');
const Stock = require('./Stock'); // Import the Stock model

const shoeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  stocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stock' }], 
  colors: { type: [String], required: true },
  imageUrl: { type: String, required: true }
});

module.exports = mongoose.model('Shoe', shoeSchema);
