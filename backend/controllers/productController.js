const Product = require('../models/productModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');

// Get all products - /api/products
exports.getProducts = catchAsyncError(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;
    const filter = {};
    if (category) {
        filter.category = category;
    }
    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).skip(skip).limit(limit);
    res.status(200).json({
        success: true,
        count: products.length,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        products
    });
});

// Get product by ID - /api/product/:id
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        product
    });
});

// Create product - /api/product
exports.createProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
});

// Update product - /api/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id); // Fixed typo: findId → findById

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        product
    });
});

// Delete product - /api/product/:id
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });
});
