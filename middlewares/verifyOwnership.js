const Cart = require('../models/Cart');

const verifyOwnership = async (req, res, next) => {
  const { userId } = req.params;
  const authenticatedUserId = req.user.id; // Giả sử bạn đã có xác thực người dùng và gán userId cho req.user

  if (userId !== authenticatedUserId) {
    return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (cart.userId.toString() !== authenticatedUserId) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
    }

    next();
  } catch (error) {
    console.error('Error verifying ownership:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = verifyOwnership;
