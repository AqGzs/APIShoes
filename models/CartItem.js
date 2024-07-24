const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Shoe' },
  stock: {
    size: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  quantity: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('CartItem', cartItemSchema);
