const Tag = require('../models/tag');

const createTag = async (req, res) => {
  try {
    if (!['writer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only blog authors or admins can create tags' });
    }

    const { name } = req.body;
    const tag = new Tag({ name });
    const savedTag = await tag.save();

    res.status(201).json(savedTag);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tag', error: error.message });
  }
};

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error: error.message });
  }
};

const updateTag = async (req, res) => {
  try {
    if (!['writer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only blog authors or admins can update tags' });
    }

    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    const { name } = req.body;
    tag.name = name || tag.name;

    const updatedTag = await tag.save();
    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(500).json({ message: 'Error updating tag', error: error.message });
  }
};

const deleteTag = async (req, res) => {
    try {
      if (!['writer', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Only blog authors or admins can delete tags' });
      }
        const tag = await Tag.findById(req.params.id);
      if (!tag) {
        return res.status(404).json({ message: 'Tag not found' });
      }
  
      await Tag.findByIdAndDelete(req.params.id);
  
      res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting tag', error: error.message });
    }
  };
  

module.exports = {
  createTag,
  getAllTags,
  updateTag,
  deleteTag,
};
