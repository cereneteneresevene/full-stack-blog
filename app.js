require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const tagRoutes = require('./routes/tagRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoute = require("./routes/upload");
const cors = require('cors');
const path = require("path");

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // Frontend URL'si
  credentials: true, // Gerekirse yetkilendirme için
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/admin', adminRoutes);
app.use("/api/upload", uploadRoute);

// Port ve Sunucu Başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
