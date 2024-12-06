import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slices/blogSlice';
import categoryReducer from './slices/categorySlice';
import authReducer from "./slices/authSlice";
import commentsReducer from "./slices/commentsSlice"; 

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    categories: categoryReducer,
    auth: authReducer,
    comments: commentsReducer,
  },
});

export default store;