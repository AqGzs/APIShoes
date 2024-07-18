const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  size: { type: [Number], required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  colors: { type: [String], required: true },
  imageUrl: { type: String, required: true }
});

module.exports = mongoose.model('Shoe', shoeSchema);
