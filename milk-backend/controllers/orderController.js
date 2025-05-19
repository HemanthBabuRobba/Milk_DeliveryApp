const Order = require('../models/Order');

exports.placeOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'Invalid order data' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};