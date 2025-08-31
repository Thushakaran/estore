import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/api';

// Async thunks
export const getLoginUrl = createAsyncThunk(
    'user/getLoginUrl',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await authAPI.getLoginUrl(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to get login URL');
        }
    }
);

export const register = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authAPI.register(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Registration failed');
        }
    }
);

export const login = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authAPI.login(credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

export const verifyToken = createAsyncThunk(
    'user/verifyToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authAPI.verifyToken();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Token verification failed');
        }
    }
);

export const getProfile = createAsyncThunk(
    'user/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authAPI.getProfile();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to get profile');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await authAPI.updateProfile(profileData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update profile');
        }
    }
);

export const logout = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authAPI.logout();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Logout failed');
        }
    }
);

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('accessToken') || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    loading: false,
    error: null,
    loginUrl: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.error = null;

            // Store in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('accessToken', token);
        },
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            state.loginUrl = null;

            // Clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Login URL
            .addCase(getLoginUrl.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLoginUrl.fulfilled, (state, action) => {
                state.loading = false;
                state.loginUrl = action.payload.authUrl;
            })
            .addCase(getLoginUrl.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;

                // Store in localStorage
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                localStorage.setItem('accessToken', action.payload.token);
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;

                // Store in localStorage
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                localStorage.setItem('accessToken', action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Verify Token
            .addCase(verifyToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyToken.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(verifyToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            // Get Profile
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
                state.loginUrl = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setCredentials, clearCredentials, setError, clearError } = userSlice.actions;

export default userSlice.reducer;