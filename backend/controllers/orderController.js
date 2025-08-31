const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');

// Create new order
exports.createOrder = catchAsyncError(async (req, res, next) => {
    console.log('createOrder called with body:', req.body);
    console.log('User:', req.user);

    const {
        purchaseDate,
        deliveryTime,
        deliveryLocation,
        productName,
        quantity,
        message
    } = req.body;

    // Validate purchase date (not Sunday and on or after current date)
    const selectedDate = new Date(purchaseDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        return next(new ErrorHandler('Purchase date must be on or after current date', 400));
    }

    if (selectedDate.getDay() === 0) {
        return next(new ErrorHandler('Purchase date cannot be Sunday', 400));
    }

    // Find the product to get its actual price
    console.log('Looking for product:', productName);
    const product = await Product.findOne({ name: productName });
    console.log('Product found:', product);

    if (!product) {
        return next(new ErrorHandler(`Product '${productName}' not found`, 404));
    }

    const totalAmount = product.price * quantity;
    console.log('Total amount calculated:', totalAmount);

    console.log('Creating order with data:', {
        username: req.user.username,
        purchaseDate,
        deliveryTime,
        deliveryLocation,
        productName,
        quantity,
        message,
        totalAmount
    });

    const order = await Order.create({
        username: req.user.username,
        purchaseDate,
        deliveryTime,
        deliveryLocation,
        productName,
        quantity,
        message,
        totalAmount
    });

    console.log('Order created successfully:', order);

    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order
    });
});

// Get all orders for authenticated user
exports.getMyOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ username: req.user.username })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: orders.length,
        orders
    });
});

// Get single order by ID (with ownership check)
exports.getOrderById = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    // Check ownership
    if (order.username !== req.user.username) {
        return next(new ErrorHandler('Access denied. You can only view your own orders.', 403));
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Update order status (only for user's own orders)
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    // Check ownership
    if (order.username !== req.user.username) {
        return next(new ErrorHandler('Access denied. You can only update your own orders.', 403));
    }

    // Only allow certain fields to be updated
    const allowedUpdates = ['message'];
    const updates = {};

    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        updates,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        order: updatedOrder
    });
});

// Cancel order (only for user's own orders)
exports.cancelOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    // Check ownership
    if (order.username !== req.user.username) {
        return next(new ErrorHandler('Access denied. You can only cancel your own orders.', 403));
    }

    // Check if order can be cancelled (only pending orders)
    if (order.status !== 'pending') {
        return next(new ErrorHandler('Only pending orders can be cancelled', 400));
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        order
    });
});

// Get order statistics for user
exports.getOrderStats = catchAsyncError(async (req, res, next) => {
    const stats = await Order.aggregate([
        {
            $match: { username: req.user.username }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalAmount: { $sum: '$totalAmount' }
            }
        }
    ]);

    const totalOrders = await Order.countDocuments({ username: req.user.username });
    const totalSpent = await Order.aggregate([
        {
            $match: { username: req.user.username }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$totalAmount' }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        stats: {
            totalOrders,
            totalSpent: totalSpent[0]?.total || 0,
            statusBreakdown: stats
        }
    });
});

// Get available delivery times for a specific date
exports.getAvailableDeliveryTimes = catchAsyncError(async (req, res, next) => {
    const { date } = req.query;

    if (!date) {
        return next(new ErrorHandler('Date is required', 400));
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        return next(new ErrorHandler('Date must be on or after current date', 400));
    }

    if (selectedDate.getDay() === 0) {
        return next(new ErrorHandler('Sunday is not available for delivery', 400));
    }

    // Get existing orders for this date and time slots
    const existingOrders = await Order.find({
        purchaseDate: {
            $gte: selectedDate,
            $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
        }
    });

    const timeSlots = ['10 AM', '11 AM', '12 PM'];
    const availableTimes = timeSlots.filter(time => {
        const ordersForTime = existingOrders.filter(order => order.deliveryTime === time);
        return ordersForTime.length < 5; // Limit 5 orders per time slot
    });

    res.status(200).json({
        success: true,
        availableTimes,
        date: selectedDate.toISOString().split('T')[0]
    });
});
