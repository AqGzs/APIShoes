const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const Shoe = require('../models/Shoe');
const Stock = require('../models/Stock');
const CartItem = require('../models/CartItem');  
const verifyOrderOwnership = require('../middlewares/verifyOrderOwnership');

const authenticateToken = require('../middlewares/authenticateToken');

router.use(authenticateToken);
router.post('/', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { userId, paymentMethod } = req.body;

    // Đảm bảo phương thức thanh toán hợp lệ
    const validPaymentMethods = ['paypal', 'zalopay', 'cod'];
    if (!validPaymentMethods.includes(paymentMethod.toLowerCase())) {
      return res.status(400).json({ message: `Phương thức thanh toán không hợp lệ. Các phương thức hợp lệ là: ${validPaymentMethods.join(', ')}` });
    }

    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId }).populate('items');
    if (!cart) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    }

    console.log('Giỏ hàng:', cart); // Thêm ghi log để kiểm tra giỏ hàng

    // Tạo đơn hàng mới
    const order = new Order({
      userId: cart.userId,
      items: [],
      total: 0,
      status: 'completed',
      paymentMethod: paymentMethod.toLowerCase(),
      paymentStatus: 'completed'
    });

    console.log('Tạo đơn hàng:', order);

    // Tạo các mục đơn hàng từ giỏ hàng và tính tổng số tiền
    for (let cartItem of cart.items) {
      console.log('cartItem:', cartItem); // Ghi log để kiểm tra cartItem

      const shoe = await Shoe.findById(cartItem.productId);
      if (!shoe) {
        console.error(`Không tìm thấy sản phẩm với productId: ${cartItem.productId}`);
        continue;
      }

      // Kiểm tra xem cartItem có chứa size và quantity không
      if (!cartItem.stock || !cartItem.stock.size || !cartItem.stock.quantity) {
        console.error(`cartItem không có thông tin stock, size hoặc quantity: ${cartItem}`);
        continue;
      }

      const orderItem = new OrderItem({
        orderId: order._id,
        productId: cartItem.productId,
        stock: {
          size: cartItem.stock.size,
          quantity: cartItem.stock.quantity
        },
        quantity: cartItem.quantity,
        priceShoe: shoe.price
      });
      await orderItem.save();

      order.items.push(orderItem._id);
      order.total += shoe.price * cartItem.quantity;

      console.log(`Thêm OrderItem: ${orderItem._id} vào đơn hàng`);
    }

    // Lưu đơn hàng
    await order.save();
    console.log('Đơn hàng đã được lưu:', order);

    // Xóa giỏ hàng sau khi tạo đơn hàng
    await Cart.findByIdAndDelete(cart._id);
    await CartItem.deleteMany({ cartId: cart._id });

    res.status(201).json({ message: 'Đơn hàng được tạo thành công', order });
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.get('/:userID', verifyOrderOwnership, async (req, res) => {
  try {
    const { userID } = req.params;
    const orders = await Order.find({ userId: userID }).populate('items').exec();

    // Fetch additional shoe information for each order
    const ordersWithShoeDetails = await Promise.all(orders.map(async (order) => {
      const itemsWithShoeDetails = await Promise.all(order.items.map(async (item) => {
        const shoe = await Shoe.findById(item.productId).exec();
        return {
          ...item._doc,
          shoe,
        };
      }));
      return {
        ...order._doc,
        items: itemsWithShoeDetails,
      };
    }));

    res.status(200).json(ordersWithShoeDetails);
  } catch (err) {
    res.status(500).send(err);
  }
});
  
module.exports = router;
