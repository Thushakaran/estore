const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// JWT Strategy for token validation
const jwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
        try {
            const user = await User.findById(payload.id).select('-password');
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    }
);

// OAuth2 Strategy for OIDC
const oauth2Strategy = new OAuth2Strategy(
    {
        authorizationURL: `https://${process.env.OIDC_DOMAIN}/authorize`,
        tokenURL: `https://${process.env.OIDC_DOMAIN}/oauth/token`,
        clientID: process.env.OIDC_CLIENT_ID,
        clientSecret: process.env.OIDC_CLIENT_SECRET,
        callbackURL: process.env.OIDC_CALLBACK_URL,
        scope: 'openid profile email'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Extract user info from OIDC profile
            const userInfo = {
                oidcId: profile.id,
                oidcProvider: 'auth0',
                name: profile.displayName || profile.name?.givenName + ' ' + profile.name?.familyName,
                email: profile.emails?.[0]?.value,
                username: profile.username || profile.emails?.[0]?.value?.split('@')[0],
                accessToken: accessToken,
                refreshToken: refreshToken,
                tokenExpiry: new Date(Date.now() + 3600000) // 1 hour
            };

            // Find or create user
            let user = await User.findOne({ oidcId: profile.id });

            if (!user) {
                // Create new user if doesn't exist
                user = new User({
                    ...userInfo,
                    contactNumber: '',
                    country: 'Sri Lanka',
                    password: Math.random().toString(36).slice(-8) // Temporary password
                });
                await user.save();
            } else {
                // Update existing user's tokens
                user.accessToken = accessToken;
                user.refreshToken = refreshToken;
                user.tokenExpiry = userInfo.tokenExpiry;
                await user.save();
            }

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
);

// Middleware to verify OIDC token
const verifyOidcToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const token = authHeader.substring(7);

        // Verify token with OIDC provider
        const response = await fetch(`https://${process.env.OIDC_DOMAIN}/userinfo`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            return res.status(401).json({
                success: false,
                message: 'Invalid access token'
            });
        }

        const userInfo = await response.json();

        // Find user by OIDC ID
        const user = await User.findOne({ oidcId: userInfo.sub });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token verification failed'
        });
    }
};

// Middleware to check if user is authenticated using JWT
const isAuthenticated = async (req, res, next) => {
    try {
        console.log('isAuthenticated middleware called');
        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('No Bearer token found');
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const token = authHeader.substring(7);
        console.log('Token extracted:', token.substring(0, 20) + '...');

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', decoded);

        // Find user
        const user = await User.findById(decoded.id).select('-password');
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('User not found in database');
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        console.log('User attached to request');
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// Middleware to check if user owns the resource
const checkOwnership = (resourceModel) => {
    return async (req, res, next) => {
        try {
            const resource = await resourceModel.findById(req.params.id);
            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: 'Resource not found'
                });
            }

            // Check if user owns the resource
            if (resource.username !== req.user.username) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You can only access your own resources.'
                });
            }

            req.resource = resource;
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error checking resource ownership'
            });
        }
    };
};

// Initialize passport
const initializePassport = () => {
    passport.use('jwt', jwtStrategy);
    passport.use('oauth2', oauth2Strategy);

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

module.exports = {
    initializePassport,
    verifyOidcToken,
    isAuthenticated,
    checkOwnership
};
