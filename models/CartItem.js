const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  cartId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Cart' },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Shoe' },
  stock: {
    size: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  quantity: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('CartItem', cartItemSchema);
