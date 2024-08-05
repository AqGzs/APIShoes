const express = require('express');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Shoe = require('../models/Shoe');
const Stock = require('../models/Stock');
const User = require('../models/User');
const verifyOwnership = require('../middlewares/verifyOwnership');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();
router.use(authenticateToken);

function validateInputData(userId, items) {
  if (!userId || !Array.isArray(items) || items.length === 0) {
    console.log('Validation failed: userId or items are invalid');
    return false;
  }
  for (const item of items) {
    if (!item.productId || !item.stockId || typeof item.quantity !== 'number') {
      console.log('Validation failed: missing productId, stockId or quantity');
      return false;
    }
  }
  return true;
}

// Hàm tính tổng giá
const calculateTotalPrice = async (cartItems) => {
  const totalPrice = await CartItem.aggregate([
    { $match: { _id: { $in: cartItems.map(item => item._id) } } },
    { $lookup: { from: 'stocks', localField: 'stock._id', foreignField: '_id', as: 'stock' } },
    { $unwind: '$stock' },
    { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$product.price'] } } } }
  ]);

  return totalPrice[0]?.total || 0;
};

router.post('/', async (req, res) => {
  try {
    const { userId, items, totalPrice } = req.body;
    console.log("Received request body:", req.body);

    if (!validateInputData(userId, items)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Tìm hoặc tạo mới giỏ hàng
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    // Tạo danh sách ID của các CartItem hiện có trong giỏ hàng
    const existingItemIds = cart.items.map(cartItem => cartItem._id.toString());

    // Danh sách ID của các CartItem cần giữ lại sau cập nhật
    const updatedItemIds = [];

    for (const item of items) {
      console.log("Processing item:", item);
      const stock = await Stock.findById(item.stockId);
      if (!stock) {
        return res.status(404).json({ message: 'Stock not found' });
      }

      if (stock.quantity < item.quantity) {
        return res.status(400).json({ message: 'Insufficient stock quantity' });
      }

      let existingItem = cart.items.find(cartItem => 
        cartItem.productId?.toString() === item.productId?.toString() && 
        cartItem.stock._id?.toString() === item.stockId?.toString()
      );

      if (existingItem) {
        // Cập nhật số lượng của CartItem hiện có
        existingItem.quantity += item.quantity;
        stock.quantity -= item.quantity;
        await existingItem.save();
        updatedItemIds.push(existingItem._id.toString());
      } else {
        // Tạo mới CartItem và thêm vào giỏ hàng
        const cartItem = new CartItem({
          cartId: cart._id,
          productId: item.productId,
          stock: {
            size: stock.size,
            quantity: stock.quantity - item.quantity,
          },
          quantity: item.quantity,
        });

        await cartItem.save();
        cart.items.push(cartItem);
        updatedItemIds.push(cartItem._id.toString());
        stock.quantity -= item.quantity;
      }

      await stock.save();
    }

    // Xóa các CartItem không còn cần thiết
    const itemsToRemove = existingItemIds.filter(id => !updatedItemIds.includes(id));
    if (itemsToRemove.length > 0) {
      await CartItem.deleteMany({ _id: { $in: itemsToRemove } });
      cart.items = cart.items.filter(cartItem => !itemsToRemove.includes(cartItem._id.toString()));
    }

    // Cập nhật totalPrice từ yêu cầu
    cart.totalPrice = totalPrice;

    // Lưu giỏ hàng
    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    console.error('Error creating cart:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Lấy thông tin giỏ hàng và người dùng
router.get('/:userId', verifyOwnership, async (req, res) => {
  try {
    const { userId } = req.params;

    // Lấy thông tin giỏ hàng
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items',
      populate: [
        { path: 'productId', model: 'Shoe' },
        { path: 'stock', model: 'Stock' }
      ]
    });

    if (!cart) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    }

    // Lấy thông tin người dùng
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Trả về thông tin giỏ hàng và người dùng
    res.json({ cart, user });
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng và thông tin người dùng:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật mục giỏ hàng
router.put('/item/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const cartItem = await CartItem.findById(id).populate('stock').session(session);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const stock = await Stock.findById(cartItem.stock._id).session(session);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Calculate the difference in quantity
    const quantityDifference = quantity - cartItem.quantity;

    // Ensure stock is sufficient
    if (stock.quantity < quantityDifference) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Update cart item quantity
    cartItem.quantity = quantity;
    await cartItem.save({ session });

    // Update stock quantity
    stock.quantity -= quantityDifference;
    if (stock.quantity < 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Stock quantity cannot be negative' });
    }
    await stock.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(cartItem);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error updating cart item:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Xóa mục giỏ hàng
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await CartItem.findById(id).populate('stock');
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const stock = await Stock.findById(cartItem.stock._id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Restore the stock quantity
    stock.quantity += cartItem.quantity;
    await stock.save();

    await cartItem.remove();

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting cart item:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
