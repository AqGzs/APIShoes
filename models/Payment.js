const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['credit_card', 'paypal', 'cash_on_delivery'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
  datePayment: { type: Date, required: true }
});

module.exports = mongoose.model('Payment', paymentSchema);
