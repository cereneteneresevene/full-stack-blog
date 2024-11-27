const Category = require('../models/category');

const createCategory = async (req, res) => {
  try {
    if (!['writer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only blog authors or admins can create categories' });
    }

    const { name, description } = req.body;
    const category = new Category({ name, description });
    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    if (!['writer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only blog authors or admins can update categories' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, description } = req.body;
    category.name = name || category.name;
    category.description = description || category.description;

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
    try {
      if (!['writer', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Only blog authors or admins can delete categories' });
      }
  
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      await Category.findByIdAndDelete(req.params.id);
  
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
  };
  

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
