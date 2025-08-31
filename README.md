# Secure E-Commerce Web Application

This is a secure e-commerce web application developed for Assessment 2: Secure Web Application Development. The application implements OIDC authentication, OWASP Top 10 security measures, and comprehensive order management functionality.

## Features

### Authentication & Security

- **OIDC (OpenID Connect) Authentication** using Auth0
- **OWASP Top 10 Security Measures** implementation
- **HTTPS Support** for production deployment
- **Rate Limiting** and **Input Sanitization**
- **Access Control** based on user ownership
- **JWT Token Management**

### User Management

- User profile display (username, name, email, contact number, country)
- Profile editing capabilities
- Secure authentication flow

### Order Management

- Create product orders with specific requirements:
  - Purchase date (on or after current date, excluding Sundays)
  - Delivery time (10 AM, 11 AM, 12 PM)
  - Delivery location (Sri Lankan districts)
  - Product selection from predefined list
  - Quantity (1-10)
  - Optional message
- View order history
- Order status tracking
- Order cancellation (pending orders only)

## Technology Stack

### Backend

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Passport.js** for OIDC authentication
- **Helmet** for security headers
- **Express Rate Limit** for DDoS protection
- **Express Validator** for input validation
- **Sanitize HTML** for XSS prevention

### Frontend

- **React.js** with **Vite**
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **React DatePicker** for date selection

## Security Features

### OWASP Top 10 Mitigation

1. **Broken Access Control** - Implemented ownership-based access control
2. **Cryptographic Failures** - Secure JWT tokens and HTTPS
3. **Injection** - Input validation and sanitization
4. **Insecure Design** - Security-first architecture
5. **Security Misconfiguration** - Proper security headers
6. **Vulnerable Components** - Updated dependencies
7. **Authentication Failures** - OIDC implementation
8. **Software and Data Integrity** - Input validation
9. **Security Logging** - Request logging
10. **Server-Side Request Forgery** - CORS configuration

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Auth0 account (for OIDC)

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd e-store/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the `backend` directory:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_TIME=7d

   # OIDC Configuration (Auth0)
   OIDC_CLIENT_ID=your_auth0_client_id
   OIDC_CLIENT_SECRET=your_auth0_client_secret
   OIDC_DOMAIN=your_auth0_domain.auth0.com
   OIDC_CALLBACK_URL=http://localhost:3000/auth/callback
   OIDC_ISSUER=https://your_auth0_domain.auth0.com/

   # Security Configuration
   SESSION_SECRET=your_session_secret_here
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## Auth0 Configuration

1. **Create Auth0 Application**

   - Go to Auth0 Dashboard
   - Create a new Single Page Application
   - Configure Allowed Callback URLs: `http://localhost:3000/auth/callback`
   - Configure Allowed Logout URLs: `http://localhost:3000`
   - Configure Allowed Web Origins: `http://localhost:3000`

2. **Update Environment Variables**
   - Copy Client ID and Client Secret from Auth0
   - Update the backend `.env` file with your Auth0 credentials

## Database Setup

The application uses MongoDB. Create a database named `ecommerce` and the collections will be created automatically when the application starts.

### Database Collections

- `users` - User profiles and authentication data
- `orders` - Product orders with delivery information
- `products` - Product catalog (existing)

## API Endpoints

### Authentication

- `GET /api/v1/auth/login` - Get OIDC login URL
- `GET /api/v1/auth/callback` - OIDC callback handler
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile
- `GET /api/v1/auth/logout` - Logout user

### Orders

- `POST /api/v1/orders/create` - Create new order
- `GET /api/v1/orders/my-orders` - Get user's orders
- `GET /api/v1/orders/:id` - Get specific order
- `PUT /api/v1/orders/:id` - Update order
- `PATCH /api/v1/orders/:id/cancel` - Cancel order
- `GET /api/v1/orders/stats/overview` - Get order statistics
- `GET /api/v1/orders/delivery-times/available` - Get available delivery times

## Deployment

### Production Deployment

1. **Environment Setup**

   ```env
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret

   # HTTPS Configuration
   HTTPS_KEY_PATH=./ssl/private.key
   HTTPS_CERT_PATH=./ssl/certificate.crt
   ```

2. **SSL Certificate Setup**

   - Place your SSL certificate and private key in the `backend/ssl/` directory
   - Update the paths in the environment variables

3. **Build Frontend**

   ```bash
   cd frontend
   npm run build
   ```

4. **Start Production Server**
   ```bash
   cd backend
   npm start
   ```

## Security Considerations

### Implemented Security Measures

- **Input Validation**: All user inputs are validated and sanitized
- **Rate Limiting**: Prevents brute force attacks
- **CORS Configuration**: Restricts cross-origin requests
- **Security Headers**: Implemented via Helmet
- **Authentication**: OIDC with JWT tokens
- **Access Control**: Users can only access their own resources
- **HTTPS**: Enforced in production

### Configuration Security

- All sensitive data is stored in environment variables
- Database credentials are externalized
- OIDC secrets are properly managed
- Session secrets are configurable

## Testing

### Manual Testing Checklist

- [ ] OIDC Authentication flow
- [ ] User profile creation and editing
- [ ] Order creation with all required fields
- [ ] Date validation (no Sundays, future dates only)
- [ ] Delivery time validation
- [ ] District selection
- [ ] Product selection
- [ ] Quantity limits (1-10)
- [ ] Order history viewing
- [ ] Order cancellation
- [ ] Access control (users can only see their orders)
- [ ] Security headers
- [ ] Rate limiting
- [ ] Input sanitization

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check connection string in environment variables

2. **Auth0 Configuration Issues**

   - Verify callback URLs in Auth0 dashboard
   - Check client ID and secret in environment variables

3. **CORS Errors**

   - Ensure CORS_ORIGIN matches your frontend URL
   - Check browser console for specific error messages

4. **HTTPS Certificate Issues**
   - Verify certificate and key file paths
   - Ensure certificate is valid and not expired

## Contributing

This project is developed for educational purposes as part of an assessment. The codebase demonstrates secure web application development practices and OIDC implementation.

## License

This project is created for educational assessment purposes.

## Contact

For questions regarding this implementation, please refer to the assessment documentation or contact the development team.
