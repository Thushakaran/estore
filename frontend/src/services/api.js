import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    // Get OIDC login URL
    getLoginUrl: (params = {}) => api.get('/auth/login', { params }),

    // Traditional registration
    register: (userData) => api.post('/auth/register', userData),

    // Traditional login
    login: (credentials) => api.post('/auth/login-traditional', credentials),

    // Verify token
    verifyToken: () => api.get('/auth/verify'),

    // Get user profile
    getProfile: () => api.get('/auth/profile'),

    // Update profile
    updateProfile: (data) => api.put('/auth/profile', data),

    // Logout
    logout: () => api.get('/auth/logout'),
};

// Order API
export const orderAPI = {
    // Create new order
    createOrder: (orderData) => api.post('/orders/create', orderData),

    // Get user's orders
    getMyOrders: () => api.get('/orders/my-orders'),

    // Get single order
    getOrderById: (id) => api.get(`/orders/${id}`),

    // Update order
    updateOrder: (id, data) => api.put(`/orders/${id}`, data),

    // Cancel order
    cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),

    // Get order statistics
    getOrderStats: () => api.get('/orders/stats/overview'),

    // Get available delivery times
    getAvailableDeliveryTimes: (date) => api.get(`/orders/delivery-times/available?date=${date}`),
};

// Product API (keeping existing functionality)
export const productAPI = {
    getProducts: () => api.get('/products'),
    getProduct: (id) => api.get(`/products/${id}`),
    createProduct: (data) => api.post('/products', data),
    updateProduct: (id, data) => api.put(`/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default api;