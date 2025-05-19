const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
      unit: String
    }
  ]
});
module.exports = mongoose.model('Cart', cartSchema);