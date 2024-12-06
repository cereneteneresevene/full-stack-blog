import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Kayıt olma işlemi
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        registerData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Kayıt sırasında bir hata oluştu."
      );
    }
  }
);

// Giriş yapma işlemi
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        loginData
      );
      if (typeof window !== "undefined") {
        // Tarayıcı ortamında token'ı sakla
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Giriş sırasında bir hata oluştu."
      );
    }
  }
);

// SSR ve tarayıcı ortamını kontrol et
const getTokenFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: getTokenFromLocalStorage(), // Koşullu olarak localStorage'dan al
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null; // Hata durumunu temizlemek için
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token"); // Tarayıcı ortamında token'ı temizle
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Kayıt olma
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Giriş yapma
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
