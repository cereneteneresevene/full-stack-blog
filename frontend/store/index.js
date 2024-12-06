import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slices/blogSlice';
import categoryReducer from './slices/categorySlice';
import authReducer from "./slices/authSlice";
import commentsReducer from "./slices/commentsSlice"; 
import tagsReducer from "./slices/tagsSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    categories: categoryReducer,
    auth: authReducer,
    comments: commentsReducer,
    tags: tagsReducer, 
    users: userReducer,
  },
});

export default store;
