const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true
    },
    purchaseDate: {
        type: Date,
        required: [true, 'Purchase date is required'],
        validate: {
            validator: function (date) {
                // Ensure date is not Sunday and is on or after current date
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const purchaseDate = new Date(date);
                purchaseDate.setHours(0, 0, 0, 0);

                // Check if date is on or after today
                if (purchaseDate < today) {
                    return false;
                }

                // Check if date is not Sunday (0 = Sunday)
                if (purchaseDate.getDay() === 0) {
                    return false;
                }

                return true;
            },
            message: 'Purchase date must be on or after current date and cannot be Sunday'
        }
    },
    deliveryTime: {
        type: String,
        required: [true, 'Delivery time is required'],
        enum: {
            values: ['10 AM', '11 AM', '12 PM'],
            message: 'Delivery time must be 10 AM, 11 AM, or 12 PM'
        }
    },
    deliveryLocation: {
        type: String,
        required: [true, 'Delivery location is required'],
        enum: {
            values: [
                'Colombo',
                'Gampaha',
                'Kalutara',
                'Kandy',
                'Matale',
                'Nuwara Eliya',
                'Galle',
                'Matara',
                'Hambantota',
                'Jaffna',
                'Kilinochchi',
                'Mullaitivu',
                'Vavuniya',
                'Mannar',
                'Puttalam',
                'Anuradhapura',
                'Polonnaruwa',
                'Badulla',
                'Monaragala',
                'Ratnapura',
                'Kegalle',
                'Trincomalee',
                'Batticaloa',
                'Ampara'
            ],
            message: 'Please select a valid district'
        }
    },
    productName: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
        max: [10, 'Quantity cannot exceed 10']
    },
    message: {
        type: String,
        maxlength: [500, 'Message cannot exceed 500 characters'],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
