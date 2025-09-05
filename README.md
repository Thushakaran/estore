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

