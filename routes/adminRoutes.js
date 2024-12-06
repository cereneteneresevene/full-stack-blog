const express = require('express');
const {
  getAllUsers,
  getAllBlogsAdmin,
  getAllCategoriesAdmin,
  getAllTagsAdmin,
  updateUserRole,
} = require('../controllers/adminController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const isAdmin = require("../middleware/isAdmin");
const { updateBlog } = require('../controllers/blogController');

const router = express.Router();

router.get("/dashboard", isAdmin, (req, res) => {
  res.status(200).json({ message: "Welcome to the Admin Panel" });
});

router.get('/users', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.get('/blogs', authenticateToken, authorizeRoles('admin'), getAllBlogsAdmin);
router.get('/categories', authenticateToken, authorizeRoles('admin'), getAllCategoriesAdmin);
router.get('/tags', authenticateToken, authorizeRoles('admin'), getAllTagsAdmin);
router.put('/update-role', authenticateToken, authorizeRoles('admin'), updateUserRole);
router.put('/api/blogs/:id', authenticateToken, authorizeRoles('admin'), updateBlog);

module.exports = router;
