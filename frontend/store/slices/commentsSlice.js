import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Yorum ekleme işlemi
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ blogId, text, replyTo }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState(); // Kullanıcının token'ını al
      const response = await axios.post(
        `http://localhost:5000/api/blogs/${blogId}/comments`,
        { text, replyTo },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Token ekleniyor
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Yorum eklenirken bir hata oluştu."
      );
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Yorum ekleme
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload); // Yorum state'e ekleniyor
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commentSlice.reducer;
