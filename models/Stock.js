const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  size: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model('Stock', stockSchema);
