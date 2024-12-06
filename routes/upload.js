const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");

// Multer Konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Görsellerin kaydedileceği klasör
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Benzersiz dosya adı oluşturma
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimum 5MB dosya boyutu sınırı
});

// Görsel Yükleme Endpoint
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Dosya yüklenemedi!" });
  }

  res.status(200).json({
    message: "Dosya başarıyla yüklendi!",
    url: `/uploads/${req.file.filename}`, // Yüklenen dosyanın URL'si
  });
});

module.exports = router;
