require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const tagRoutes = require('./routes/tagRoutes');

const app = express();

// Middleware
app.use(express.json());

// MongoDB Bağlantısı
connectDB();

// Test Endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);

// Port ve Sunucu Başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
