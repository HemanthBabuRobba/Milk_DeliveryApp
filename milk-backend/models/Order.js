const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
      unit: String
    }
  ],
  totalAmount: Number,
  userInfo: {
    name: String,
    mobile: String,
    address: String,
    landmark: String
  },
  delivery: {
    date: String,
    slot: String
  },
  notes: String,
  paymentMethod: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', orderSchema);