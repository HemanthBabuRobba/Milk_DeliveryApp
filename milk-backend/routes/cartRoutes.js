const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.saveCart);
router.get('/:userId', cartController.getCart);
router.delete('/:userId', cartController.clearCart);

module.exports = router;