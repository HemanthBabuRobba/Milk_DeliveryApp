const Cart = require('../models/Cart');

exports.saveCart = async (req, res) => {
  const { userId, items } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = new Cart({ userId, items });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart ? cart.items : []);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.deleteOne({ userId: req.params.userId });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};