const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrder,
    cancelOrder,
    getOrderStats,
    getAvailableDeliveryTimes
} = require('../controllers/orderController');
const { isAuthenticated } = require('../middlewares/oidcMiddleware');
const {
    orderValidationRules,
    handleValidationErrors,
    sanitizeInput
} = require('../middlewares/securityMiddleware');

// All routes require JWT authentication
router.use(isAuthenticated);

// Create new order
router.post('/create',
    sanitizeInput,
    orderValidationRules,
    handleValidationErrors,
    createOrder
);

// Get order statistics
router.get('/stats/overview', getOrderStats);

// Get available delivery times for a date
router.get('/delivery-times/available', getAvailableDeliveryTimes);

// Get all orders for authenticated user
router.get('/my-orders', getMyOrders);

// Cancel order
router.patch('/:id/cancel', cancelOrder);

// Get single order by ID
router.get('/:id', getOrderById);

// Update order
router.put('/:id',
    sanitizeInput,
    updateOrder
);

module.exports = router;
