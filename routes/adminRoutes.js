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

const router = express.Router();

router.get('/users', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.get('/blogs', authenticateToken, authorizeRoles('admin'), getAllBlogsAdmin);
router.get('/categories', authenticateToken, authorizeRoles('admin'), getAllCategoriesAdmin);
router.get('/tags', authenticateToken, authorizeRoles('admin'), getAllTagsAdmin);
router.put('/update-role', authenticateToken, authorizeRoles('admin'), updateUserRole);

module.exports = router;
