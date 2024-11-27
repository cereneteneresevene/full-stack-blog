const express = require('express');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  updateComment,
  deleteComment
} = require('../controllers/blogController');
const authenticateToken = require('../middleware/authenticateToken'); 
const upload = require('../middleware/uploadImage');

const router = express.Router();

// CRUD operasyonları
router.post('/', authenticateToken, upload.single('image'), createBlog);
router.get('/', getAllBlogs); 
router.get('/:id', getBlogById);
router.put('/:id', authenticateToken, upload.single('image'), updateBlog);
router.delete('/:id', authenticateToken, deleteBlog); 

// Beğeni işlemleri
router.post('/:id/like', authenticateToken, likeBlog); 

//Yorum işlemleri
router.post('/:id/comments', authenticateToken, addComment); 
router.put('/:id/comments/:commentId', authenticateToken, updateComment);
router.delete('/:id/comments/:commentId', authenticateToken, deleteComment);

module.exports = router;
