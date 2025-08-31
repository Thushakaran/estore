const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sanitizeHtml = require('sanitize-html');
const { body, validationResult } = require('express-validator');

// Rate limiting middleware
const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs: windowMs,
        max: max,
        message: {
            error: message || 'Too many requests from this IP, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// General rate limiter
const generalRateLimiter = createRateLimiter(
    parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    'Too many requests from this IP, please try again later.'
);

// Auth rate limiter (more strict)
const authRateLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts
    'Too many authentication attempts, please try again later.'
);

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeHtml(req.body[key], {
                    allowedTags: [],
                    allowedAttributes: {}
                });
            }
        });
    }

    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = sanitizeHtml(req.query[key], {
                    allowedTags: [],
                    allowedAttributes: {}
                });
            }
        });
    }

    next();
};

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))
        });
    }
    next();
};

// Order validation rules
const orderValidationRules = [
    body('purchaseDate').isISO8601().withMessage('Valid purchase date is required'),
    body('deliveryTime').isIn(['10 AM', '11 AM', '12 PM']).withMessage('Valid delivery time is required'),
    body('deliveryLocation').trim().notEmpty().withMessage('Delivery location is required'),
    body('productName').trim().notEmpty().withMessage('Product name is required'),
    body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
    body('message').optional().isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters')
];

// User validation rules
const userValidationRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('contactNumber').matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Valid contact number is required'),
    body('country').trim().notEmpty().withMessage('Country is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Security headers configuration
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

module.exports = {
    generalRateLimiter,
    authRateLimiter,
    sanitizeInput,
    handleValidationErrors,
    orderValidationRules,
    userValidationRules,
    corsOptions,
    securityHeaders
};
