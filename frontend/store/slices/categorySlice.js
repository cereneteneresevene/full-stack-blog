import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Tüm kategorileri getir
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await axios.get("http://localhost:5000/api/categories");
    return response.data;
  }
);

// Yeni kategori oluştur
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async ({ name, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/categories",
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Kategoriyi güncelle
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, name, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/categories/${id}`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Kategoriyi sil
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      });
  },
});

export default categoriesSlice.reducer;
