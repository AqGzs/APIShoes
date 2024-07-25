const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Schema cho giỏ hàng
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoe', required: true },
    quantity: { type: Number, required: true },
  }],
});

const Cart = mongoose.model('Cart', cartSchema);

// Thêm sản phẩm vào giỏ hàng
router.post('/', authenticateToken, async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Nếu giỏ hàng đã tồn tại, cập nhật sản phẩm trong giỏ hàng
      const itemIndex = cart.items.findIndex(item => item.productId == productId);

      if (itemIndex > -1) {
        let productItem = cart.items[itemIndex];
        productItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    } else {
      // Nếu giỏ hàng chưa tồn tại, tạo giỏ hàng mới
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    }

    cart = await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Lấy giỏ hàng của người dùng
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/:userId/:productId', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId == req.params.productId);

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      cart = await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
