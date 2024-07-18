const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem', required: true }],
  total: { type: Number, required: true },
  dateOrder: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], required: true }
});

module.exports = mongoose.model('Order', orderSchema);
