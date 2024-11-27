require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());

// MongoDB Bağlantısı
connectDB();

// Test Endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Port ve Sunucu Başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
