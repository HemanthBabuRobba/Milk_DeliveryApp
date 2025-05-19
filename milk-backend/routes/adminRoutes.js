const express = require('express');
const { login, addProduct, editProduct, deleteProduct, getAllOrders, updateOrderStatus, getAllUsers } = require('../controllers/adminController');

const router = express.Router();

router.post('/login', login);
router.post('/products', addProduct);
router.put('/products/:id', editProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/users', getAllUsers);

module.exports = router; 