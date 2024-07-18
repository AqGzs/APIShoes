const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  shoeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoe', required: true },
  quantity: { type: Number, required: true },
  priceShoe: { type: Number, required: true }
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
