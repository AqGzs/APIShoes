const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  gender: { type: String },
  dob: { type: Date },
  avatar: { type: String }
});

module.exports = mongoose.model('User', userSchema);
