const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

// Load environment variables
dotenv.config({ path: 'config/config.env' });

// Import middleware
const {
    generalRateLimiter,
    securityHeaders,
    corsOptions,
    sanitizeInput
} = require('./middlewares/securityMiddleware');

const { initializePassport } = require('./middlewares/oidcMiddleware');

// Import routes
const auth = require('./routes/auth');
const product = require('./routes/product');
const order = require('./routes/order');
const cart = require('./routes/cart');

// Import error handling
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(generalRateLimiter);
app.use(sanitizeInput);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 60 * 60 // 1 day
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Initialize Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/products', product);
app.use('/api/v1/orders', order);
app.use('/api/v1/cart', cart);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use(errorMiddleware);

// Handle 404 errors
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    process.exit(1);
});

module.exports = app;