// shoe.js
const mongoose = require('mongoose');
const shoeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  stocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stock' }],
  colors: { type: [String], required: true },
  imageUrl: { type: String, required: true },
  descriptions: { type: String, required: true }
});

module.exports = mongoose.model('Shoe', shoeSchema);
