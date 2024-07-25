const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  shoeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoe', required: true },
  stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true }, // Một Stock cho mỗi OrderItem
  quantity: { type: Number, required: true }, // Thêm trường quantity để biết số lượng mỗi mặt hàng
  priceShoe: { type: Number, required: true }
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
