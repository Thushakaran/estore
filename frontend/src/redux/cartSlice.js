import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/cart');
        return res.data.cart;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
    }
});

export const addToCartBackend = createAsyncThunk('cart/addToCartBackend', async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const res = await api.post('/cart', { productId, quantity });
        return res.data.cart;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
    }
});

export const removeFromCartBackend = createAsyncThunk('cart/removeFromCartBackend', async (productId, { rejectWithValue }) => {
    try {
        const res = await api.delete(`/cart/${productId}`);
        return res.data.cart;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to remove from cart');
    }
});

export const updateQuantityBackend = createAsyncThunk('cart/updateQuantityBackend', async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/cart/${productId}`, { quantity });
        return res.data.cart;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update quantity');
    }
});

export const clearCartBackend = createAsyncThunk('cart/clearCartBackend', async (_, { rejectWithValue }) => {
    try {
        const res = await api.delete('/cart');
        return res.data.cart;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        setCart(state, action) {
            state.items = action.payload;
        },
        addToCart(state, action) {
            const item = state.items.find(i => i.product._id === action.payload.product._id);
            if (item) {
                item.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        removeFromCart(state, action) {
            state.items = state.items.filter(i => i.product._id !== action.payload);
        },
        updateQuantity(state, action) {
            const item = state.items.find(i => i.product._id === action.payload.productId);
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },
        clearCart(state) {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToCartBackend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCartBackend.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(addToCartBackend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeFromCartBackend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCartBackend.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(removeFromCartBackend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateQuantityBackend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateQuantityBackend.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(updateQuantityBackend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(clearCartBackend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCartBackend.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(clearCartBackend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setCart, clearCart, addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer; 