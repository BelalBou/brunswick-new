import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserState, LoginCredentials, RegisterData, UpdateUserData, User } from '../../interfaces/user.interface';
import axios from 'axios';

// État initial
const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Thunks
export const login = createAsyncThunk(
  'user/login',
  async (credentials: LoginCredentials) => {
    const response = await axios.post('/api/auth/login', credentials);
    return response.data;
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (data: RegisterData) => {
    const response = await axios.post('/api/auth/register', data);
    return response.data;
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: UpdateUserData) => {
    const response = await axios.put('/api/auth/profile', data);
    return response.data;
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async () => {
    await axios.post('/api/auth/logout');
    return null;
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer; 