const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem', required: true }], // Danh sách các OrderItem
  total: { type: Number, required: true }, // Tổng số tiền của đơn hàng
  dateOrder: { type: Date, required: true, default: Date.now }, // Ngày đặt hàng
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed' }, // Trạng thái của đơn hàng
  paymentMethod: { type: String, enum: ['paypal', 'zalopay', 'cod'], required: true }, // Phương thức thanh toán
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], required: true, default: 'completed' }, // Trạng thái thanh toán
  createdAt: { type: Date, default: Date.now }
});

// Middleware để cập nhật trường 'updated_at' trước khi lưu
orderSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
