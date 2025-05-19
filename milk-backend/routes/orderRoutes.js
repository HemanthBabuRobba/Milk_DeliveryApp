const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.placeOrder);
router.get('/:userId', orderController.getUserOrders);
router.get('/', orderController.getAllOrders); // For admin

module.exports = router;