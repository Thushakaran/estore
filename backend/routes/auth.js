const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/oidcMiddleware');
const { authRateLimiter, sanitizeInput } = require('../middlewares/securityMiddleware');
const User = require('../models/userModel');

// Helper function to create OIDC user
const createOidcUser = async (userInfo, tokenData) => {
    return new User({
        oidcId: userInfo.sub,
        oidcProvider: 'auth0',
        name: userInfo.name || userInfo.nickname || 'User',
        email: userInfo.email || '',
        username: userInfo.nickname || userInfo.email?.split('@')[0] || `user_${userInfo.sub.slice(-8)}`,
        contactNumber: '',
        country: 'Sri Lanka',
        password: Math.random().toString(36).slice(-8),
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiry: new Date(Date.now() + (tokenData.expires_in * 1000))
    });
};

// OIDC Authentication Routes

// Initiate OIDC login
router.get('/login', (req, res) => {
    const { screen_hint } = req.query;
    // Generate state with signup intent
    const baseState = Math.random().toString(36).substring(7);
    const state = screen_hint === 'signup' ? `${baseState}_signup` : baseState;

    let authUrl = `https://${process.env.OIDC_DOMAIN}/authorize?` +
        `response_type=code&` +
        `client_id=${process.env.OIDC_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(process.env.OIDC_CALLBACK_URL)}&` +
        `scope=openid profile email&` +
        `state=${state}`;

    // Add screen_hint for signup flow
    if (screen_hint === 'signup') {
        authUrl += '&screen_hint=signup&prompt=login&max_age=0';
    }

    res.json({
        success: true,
        authUrl: authUrl
    });
});

// Exchange authorization code for tokens
router.get('/exchange', async (req, res) => {
    try {
        console.log('Exchange endpoint called');
        const { code } = req.query;
        console.log('Authorization code received:', code ? 'Yes' : 'No');

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Authorization code is required'
            });
        }

        // Exchange code for tokens using Auth0
        console.log('Exchanging code for tokens with Auth0...');
        const tokenResponse = await fetch(`https://${process.env.OIDC_DOMAIN}/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.OIDC_CLIENT_ID,
                client_secret: process.env.OIDC_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.OIDC_CALLBACK_URL
            })
        });

        console.log('Auth0 token response status:', tokenResponse.status);
        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Auth0 token exchange failed:', errorText);
            throw new Error('Failed to exchange code for tokens: ' + tokenResponse.status);
        }

        const tokenData = await tokenResponse.json();

        // Get user info using the access token
        const userInfoResponse = await fetch(`https://${process.env.OIDC_DOMAIN}/userinfo`, {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            }
        });

        if (!userInfoResponse.ok) {
            throw new Error('Failed to get user info');
        }

        const userInfo = await userInfoResponse.json();

        // Find or create user
        let user = await User.findOne({ oidcId: userInfo.sub });

        if (!user) {
            // Create new user
            user = await createOidcUser(userInfo, tokenData);
            await user.save();
        } else {
            // Update existing user's tokens
            user.accessToken = tokenData.access_token;
            user.refreshToken = tokenData.refresh_token;
            user.tokenExpiry = new Date(Date.now() + (tokenData.expires_in * 1000));
            await user.save();
        }

        // Generate JWT token
        const token = user.getJwtToken();

        res.json({
            success: true,
            message: 'Authentication successful',
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                contactNumber: user.contactNumber,
                country: user.country
            },
            token: token
        });
    } catch (error) {
        console.error('Token exchange error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
});

// OIDC callback (backend callback)
router.get('/callback', async (req, res) => {
    try {
        const { code, error, state } = req.query;

        if (error) {
            return res.redirect(`http://localhost:5173/login?error=${encodeURIComponent(error)}`);
        }

        if (!code) {
            return res.redirect('http://localhost:5173/login?error=no_code');
        }

        // Exchange code for tokens using Auth0
        const tokenResponse = await fetch(`https://${process.env.OIDC_DOMAIN}/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.OIDC_CLIENT_ID,
                client_secret: process.env.OIDC_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.OIDC_CALLBACK_URL
            })
        });

        if (!tokenResponse.ok) {
            return res.redirect('http://localhost:5173/login?error=token_exchange_failed');
        }

        const tokenData = await tokenResponse.json();

        // Get user info using the access token
        const userInfoResponse = await fetch(`https://${process.env.OIDC_DOMAIN}/userinfo`, {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            }
        });

        if (!userInfoResponse.ok) {
            return res.redirect('http://localhost:5173/login?error=userinfo_failed');
        }

        const userInfo = await userInfoResponse.json();

        // Find or create user
        let user = await User.findOne({ oidcId: userInfo.sub });
        let isNewUser = false;

        if (!user) {
            // Create new user
            user = await createOidcUser(userInfo, tokenData);
            await user.save();
            isNewUser = true;
        } else {
            // Check if this is a signup flow for an existing user
            // If user already exists and came from signup, redirect to login with message
            const isFromSignup = state && state.includes('_signup');
            if (isFromSignup) {
                return res.redirect('http://localhost:5173/login?error=user_already_exists&email=' + encodeURIComponent(userInfo.email));
            }

            // Update existing user's tokens
            user.accessToken = tokenData.access_token;
            user.refreshToken = tokenData.refresh_token;
            user.tokenExpiry = new Date(Date.now() + (tokenData.expires_in * 1000));
            await user.save();
        }

        // Generate JWT token
        const token = user.getJwtToken();

        // Redirect to frontend with token
        const userData = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            contactNumber: user.contactNumber,
            country: user.country
        };

        const redirectUrl = `http://localhost:5173/callback?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userData))}&isNewUser=${isNewUser}`;
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Callback error:', error);
        res.redirect('http://localhost:5173/login?error=callback_failed');
    }
});

// Logout
router.get('/logout', isAuthenticated, (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error during logout'
            });
        }

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    });
});

// Get current user profile
router.get('/profile', isAuthenticated, (req, res) => {
    console.log('Profile endpoint called');
    console.log('User from middleware:', req.user);
    console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not set');

    res.json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            username: req.user.username,
            email: req.user.email,
            contactNumber: req.user.contactNumber,
            country: req.user.country,
            avatar: req.user.avatar
        }
    });
});

// Update user profile
router.put('/profile',
    isAuthenticated,
    sanitizeInput,
    async (req, res) => {
        try {
            console.log('Profile update endpoint called');
            console.log('Request body:', req.body);
            console.log('User ID from JWT:', req.user._id);
            console.log('User object from middleware:', req.user);

            const { name, contactNumber, country } = req.body;

            const user = await User.findById(req.user._id);
            console.log('User found in database:', user ? 'Yes' : 'No');
            if (user) {
                console.log('User details:', {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    oidcId: user.oidcId
                });
            }

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (name) user.name = name;
            if (contactNumber) user.contactNumber = contactNumber;
            if (country) user.country = country;

            console.log('About to save user with data:', {
                name: user.name,
                contactNumber: user.contactNumber,
                country: user.country
            });

            await user.save();
            console.log('User saved successfully');

            res.json({
                success: true,
                message: 'Profile updated successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    contactNumber: user.contactNumber,
                    country: user.country,
                    avatar: user.avatar
                }
            });
        } catch (error) {
            console.error('Profile update error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating profile: ' + error.message
            });
        }
    }
);

// Verify token
router.get('/verify', isAuthenticated, (req, res) => {
    res.json({
        success: true,
        message: 'Token is valid',
        user: {
            id: req.user._id,
            name: req.user.name,
            username: req.user.username,
            email: req.user.email
        }
    });
});

// Traditional Registration (Alternative to OIDC)
router.post('/register',
    authRateLimiter,
    sanitizeInput,
    async (req, res) => {
        try {
            const { name, email, password, contactNumber, country } = req.body;

            // Validate required fields
            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Name, email, and password are required'
                });
            }

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [{ email }, { username: email.split('@')[0] }]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            // Create new user
            const user = new User({
                name,
                email,
                username: email.split('@')[0],
                password, // Will be hashed by the model
                contactNumber: contactNumber || undefined, // Use undefined instead of empty string
                country: country || 'Sri Lanka',
                oidcProvider: 'local'
            });

            await user.save();

            // Generate JWT token
            const token = user.getJwtToken();

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    contactNumber: user.contactNumber,
                    country: user.country
                },
                token: token
            });
        } catch (error) {
            console.error('Registration error:', error);

            // Check if it's a MongoDB connection error
            if (error.name === 'MongoNetworkError' || error.message.includes('ECONNREFUSED')) {
                return res.status(503).json({
                    success: false,
                    message: 'Database connection failed. Please check if MongoDB is running or use MongoDB Atlas.'
                });
            }

            // Check if it's a validation error
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed: ' + validationErrors.join(', ')
                });
            }

            // Check if it's a duplicate key error
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Registration failed: ' + error.message
            });
        }
    }
);

// Traditional Login (Alternative to OIDC)
router.post('/login-traditional',
    authRateLimiter,
    sanitizeInput,
    async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            // Find user by email
            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Check password
            const isPasswordMatch = await user.isValidPassword(password);
            if (!isPasswordMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Generate JWT token
            const token = user.getJwtToken();

            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    contactNumber: user.contactNumber,
                    country: user.country
                },
                token: token
            });
        } catch (error) {
            console.error('Login error:', error);

            // Check if it's a MongoDB connection error
            if (error.name === 'MongoNetworkError' || error.message.includes('ECONNREFUSED')) {
                return res.status(503).json({
                    success: false,
                    message: 'Database connection failed. Please check if MongoDB is running or use MongoDB Atlas.'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Login failed: ' + error.message
            });
        }
    }
);

module.exports = router;
