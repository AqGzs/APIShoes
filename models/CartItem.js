const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  shoeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoe', required: true },
  quantity: { type: Number, required: true }
});

module.exports = mongoose.model('CartItem', cartItemSchema);
