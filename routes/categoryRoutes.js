const express = require('express');
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/', authenticateToken, createCategory); 
router.get('/', getAllCategories); 
router.put('/:id', authenticateToken, updateCategory); 
router.delete('/:id', authenticateToken, deleteCategory); 

module.exports = router;
