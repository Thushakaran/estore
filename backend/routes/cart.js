const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/oidcMiddleware');
const { addToCart, getCart, removeFromCart, clearCart } = require('../controllers/userController');

// Cart routes
router.post('/', isAuthenticated, addToCart);
router.get('/', isAuthenticated, getCart);
router.delete('/:productId', isAuthenticated, removeFromCart);
router.delete('/', isAuthenticated, clearCart);

module.exports = router;
