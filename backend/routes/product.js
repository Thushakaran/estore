const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/oidcMiddleware');
const {
    getProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

router.route('/').get(getProducts);
router.route('/:id').get(getSingleProduct);
router.route('/').post(isAuthenticated, createProduct);
router.route('/:id').put(isAuthenticated, updateProduct).delete(isAuthenticated, deleteProduct);

module.exports = router;