const express = require('express');
const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

// User routes (protected)
router.post('/create', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);

// Admin routes (protected + admin only)
router.get('/all', authMiddleware, adminMiddleware, getAllOrders);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
