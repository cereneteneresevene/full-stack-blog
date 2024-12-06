import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Kullanıcıları Listeleme
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:5000/api/admin/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Kullanıcı Rolü Güncelleme
export const updateUserRole = createAsyncThunk('users/updateUserRole', async ({ userId, role }, { rejectWithValue }) => {
  try {
    const response = await axios.put(
      'http://localhost:5000/api/admin/update-role',
      { userId, role },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Kullanıcıları Listeleme
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kullanıcılar yüklenemedi';
      })

      // Kullanıcı Rolü Güncelleme
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.user;
        const index = state.users.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kullanıcı rolü güncellenemedi';
      });
  },
});

export default userSlice.reducer;
