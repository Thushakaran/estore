import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        loading: false,
        error: null,
        total: 0,
        page: 1,
        totalPages: 1,
    },
    reducers: {
        setProducts(state, action) {
            state.items = action.payload.items;
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.totalPages = action.payload.totalPages;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
});

export const { setProducts, setLoading, setError } = productSlice.actions;
export default productSlice.reducer; 