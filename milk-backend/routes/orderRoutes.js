const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderDetails,
  cancelOrder
} = require('../controllers/orderController');
const auth = require('../middleware/auth');

// All order routes require authentication
router.use(auth);

// Create new order
router.post('/', createOrder);

// Get user's orders
router.get('/', getUserOrders);

// Get order details
router.get('/:orderId', getOrderDetails);

// Cancel order
router.put('/:orderId/cancel', cancelOrder);

module.exports = router;