// middlewares/verifyOrderOwnership.js
const Order = require('../models/Order');

const verifyOrderOwnership = async (req, res, next) => {
  const { userID } = req.params;
  const authenticatedUserId = req.user.id;

  if (userID !== authenticatedUserId) {
    return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
  }

  try {
    const order = await Order.findOne({ userId: userID });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== authenticatedUserId) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
    }

    next();
  } catch (error) {
    console.error('Error verifying ownership:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = verifyOrderOwnership;
