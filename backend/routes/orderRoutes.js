const express = require('express');
const { createOrder, getOrders, getOrderDetails } = require('../controllers/orderController');
const router = express.Router();

// Middleware to check if the user is authenticated should be added here


// Apply middleware to routes that require authentication
router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderDetails);

module.exports = router;


router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderDetails);

module.exports = router;
