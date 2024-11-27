const express = require('express');
const {
  createTag,
  getAllTags,
  updateTag,
  deleteTag,
} = require('../controllers/tagController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/', authenticateToken, createTag); 
router.get('/', getAllTags); 
router.put('/:id', authenticateToken, updateTag); 
router.delete('/:id', authenticateToken, deleteTag); 

module.exports = router;
