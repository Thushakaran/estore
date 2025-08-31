import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../services/api';

// Async thunks
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await orderAPI.createOrder(orderData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create order');
        }
    }
);

export const getMyOrders = createAsyncThunk(
    'order/getMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderAPI.getMyOrders();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch orders');
        }
    }
);

export const getOrderById = createAsyncThunk(
    'order/getOrderById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await orderAPI.getOrderById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch order');
        }
    }
);

export const updateOrder = createAsyncThunk(
    'order/updateOrder',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await orderAPI.updateOrder(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update order');
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'order/cancelOrder',
    async (id, { rejectWithValue }) => {
        try {
            const response = await orderAPI.cancelOrder(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to cancel order');
        }
    }
);

export const getOrderStats = createAsyncThunk(
    'order/getOrderStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderAPI.getOrderStats();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch order stats');
        }
    }
);

export const getAvailableDeliveryTimes = createAsyncThunk(
    'order/getAvailableDeliveryTimes',
    async (date, { rejectWithValue }) => {
        try {
            const response = await orderAPI.getAvailableDeliveryTimes(date);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch available times');
        }
    }
);

const initialState = {
    orders: [],
    currentOrder: null,
    stats: null,
    availableTimes: [],
    loading: false,
    error: null,
    success: false
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearAvailableTimes: (state) => {
            state.availableTimes = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders.unshift(action.payload.order);
                state.success = true;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Get My Orders
            .addCase(getMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Order By ID
            .addCase(getOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload.order;
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Order
            .addCase(updateOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.orders.findIndex(order => order._id === action.payload.order._id);
                if (index !== -1) {
                    state.orders[index] = action.payload.order;
                }
                if (state.currentOrder && state.currentOrder._id === action.payload.order._id) {
                    state.currentOrder = action.payload.order;
                }
                state.success = true;
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Cancel Order
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.orders.findIndex(order => order._id === action.payload.order._id);
                if (index !== -1) {
                    state.orders[index] = action.payload.order;
                }
                if (state.currentOrder && state.currentOrder._id === action.payload.order._id) {
                    state.currentOrder = action.payload.order;
                }
                state.success = true;
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Get Order Stats
            .addCase(getOrderStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
            })
            .addCase(getOrderStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Available Delivery Times
            .addCase(getAvailableDeliveryTimes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAvailableDeliveryTimes.fulfilled, (state, action) => {
                state.loading = false;
                state.availableTimes = action.payload.availableTimes;
            })
            .addCase(getAvailableDeliveryTimes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSuccess, clearCurrentOrder, clearAvailableTimes } = orderSlice.actions;

export default orderSlice.reducer;
