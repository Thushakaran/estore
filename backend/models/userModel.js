const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: function () {
            return !this.oidcId; // Only required if not OIDC user
        }
    },
    username: {
        type: String,
        required: function () {
            return !this.oidcId; // Only required if not OIDC user
        },
        unique: true,
        sparse: true,
        trim: true
    },
    email: {
        type: String,
        required: function () {
            return !this.oidcId; // Only required if not OIDC user
        },
        unique: true,
        sparse: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    contactNumber: {
        type: String,
        required: function () {
            return !this.oidcId; // Only required if not OIDC user
        },
        validate: {
            validator: function (v) {
                if (!v || v === '') return true; // Allow empty for OIDC users and optional field
                // Allow phone numbers with or without +, starting with any digit
                return /^[\+]?[\d]{7,15}$/.test(v);
            },
            message: 'Please enter a valid contact number (7-15 digits, optionally starting with +)'
        }
    },
    country: {
        type: String,
        required: [true, 'Please enter country'],
        default: 'Sri Lanka'
    },
    password: {
        type: String,
        required: function () {
            return !this.oidcId; // Only required if not OIDC user
        },
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    avatar: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'user'
    },
    // OIDC related fields
    oidcId: {
        type: String,
        unique: true,
        sparse: true
    },
    oidcProvider: {
        type: String,
        enum: ['auth0', 'okta', 'asgardeo', 'onelogin', 'local'],
        default: null
    },
    accessToken: {
        type: String,
        select: false
    },
    refreshToken: {
        type: String,
        select: false
    },
    tokenExpiry: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            }
        }
    ]
});

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare entered password with hashed password
userSchema.methods.isValidPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
}

// Generate JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;