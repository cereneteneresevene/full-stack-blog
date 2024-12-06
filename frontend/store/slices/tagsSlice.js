import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Tüm etiketleri getir
export const fetchTags = createAsyncThunk("tags/fetchTags", async () => {
  const response = await axios.get("http://localhost:5000/api/tags");
  return response.data;
});

// Yeni etiket oluştur
export const createTag = createAsyncThunk(
  "tags/createTag",
  async ({ name, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/tags",
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

// Etiketi güncelle
export const updateTag = createAsyncThunk(
  "tags/updateTag",
  async ({ id, name, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tags/${id}`,
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

// Etiketi sil
export const deleteTag = createAsyncThunk(
  "tags/deleteTag",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/tags/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    tags: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTag.fulfilled, (state, action) => {
        state.tags.push(action.payload);
      })

      .addCase(deleteTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter((tag) => tag._id !== action.payload);
      })

      .addCase(updateTag.fulfilled, (state, action) => {
        const index = state.tags.findIndex((tag) => tag._id === action.payload._id);
        if (index !== -1) {
          state.tags[index] = action.payload;
        }
      });
  },
});

export default tagsSlice.reducer;
