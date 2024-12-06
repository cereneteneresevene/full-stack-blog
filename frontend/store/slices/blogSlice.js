import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Blogları listelemek için API çağrısı
export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
  const response = await axios.get('http://localhost:5000/api/blogs');
  return response.data;
});

// Blog detayını almak için API çağrısı
export const fetchBlogDetail = createAsyncThunk(
  'blogs/fetchBlogDetail',
  async (id) => {
    const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
    return response.data;
  }
);

// Yeni blog oluşturmak için API çağrısı
export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [], // Tüm blogların listesi
    blogDetail: null, // Tek bir blogun detayları
    loading: false, // Yüklenme durumu
    error: null, // Hata durumu
    searchQuery: '', // Arama sorgusu
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload; // Arama sorgusunu güncelle
    },
  },
  extraReducers: (builder) => {
    builder
      // Blog listeleme
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Blog detay
      .addCase(fetchBlogDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.blogDetail = action.payload; // Blog detayı (yorumlarla birlikte) kaydedilir
      })
      .addCase(fetchBlogDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Blog oluşturma
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.push(action.payload.blog);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Blog oluşturulamadı.";
      });
  },
});

// Actions
export const { setSearchQuery } = blogSlice.actions;

// Reducer
export default blogSlice.reducer;
