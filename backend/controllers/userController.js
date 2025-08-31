const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt')
const crypto = require('crypto')
const Product = require('../models/productModel');

// Register User
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password
    });

    sendToken(user, 201, res);
})

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return next(new ErrorHandler('Please enter email & password', 400));

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.isValidPassword(password))) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
});

// Logout user
exports.logoutUser = (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

// Get User Profile (protected route)
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

// Update profile
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };
    if (req.file) {
        newUserData.avatar = req.file.filename;
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        user
    });
});

// Add product to cart
exports.addToCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = await User.findById(userId);
        const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

        if (cartItemIndex > -1) {
            // Update quantity if product already in cart
            user.cart[cartItemIndex].quantity += quantity || 1;
        } else {
            // Add new product to cart
            user.cart.push({ product: productId, quantity: quantity || 1 });
        }
        await user.save();
        res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (error) {
        next(error);
    }
};

// Get user's cart
exports.getCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('cart.product');
        res.status(200).json({ cart: user.cart });
    } catch (error) {
        next(error);
    }
};

// Remove product from cart
exports.removeFromCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;
        const user = await User.findById(userId);
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        await user.save();
        res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
    } catch (error) {
        next(error);
    }
};

// Clear all items from cart
exports.clearCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        user.cart = [];
        await user.save();
        res.status(200).json({ message: 'Cart cleared successfully', cart: user.cart });
    } catch (error) {
        next(error);
    }
};