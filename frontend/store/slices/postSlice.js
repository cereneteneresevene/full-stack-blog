import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Postları çekmek için thunk
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get("/api/posts"); // API çağrısı
  return response.data;
});

// Post silmek için thunk
export const deletePost = createAsyncThunk("posts/deletePost", async (postId) => {
  await axios.delete(`/api/posts/${postId}`); // API çağrısı
  return postId; // Silinen postun ID'sini geri döndür
});

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      });
  },
});

export default postSlice.reducer;
