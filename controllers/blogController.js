const Blog = require('../models/blog');
const Category = require('../models/category');
const Tag = require('../models/tag');


const createBlog = async (req, res) => {
  const { title, content, categoryNames, tagNames } = req.body; 

  try {
    if (!['writer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only writers and admins can create blogs' });
    }

    const categories = await Promise.all(
      categoryNames.map(async (name) => {
        let category = await Category.findOne({ name });
        if (!category) {
          category = await Category.create({ name, description: `${name} category` });
        }
        return category._id; 
      })
    );

    const tags = await Promise.all(
      tagNames.map(async (name) => {
        let tag = await Tag.findOne({ name });
        if (!tag) {
          tag = await Tag.create({ name });
        }
        return tag._id; 
      })
    );

    const newBlog = new Blog({
      title,
      content,
      author: req.user.id,
      categories,
      tags,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username email')
      .populate('categories', 'name description')
      .populate('tags', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
};


const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username email')
      .populate('categories', 'name description') 
      .populate('tags', 'name');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.views += 1;
    await blog.save();

    const groupComments = (comments) => {
      const map = {};
      const roots = [];

      comments.forEach(comment => {
        map[comment._id] = { ...comment.toObject(), replies: [] };
      });

      comments.forEach(comment => {
        if (comment.replyTo) {
          map[comment.replyTo]?.replies.push(map[comment._id]);
        } else {
          roots.push(map[comment._id]);
        }
      });

      return roots;
    };

    const groupedComments = groupComments(blog.comments);

    res.status(200).json({
      ...blog.toObject(),
      comments: groupedComments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
};

const updateBlog = async (req, res) => {
  const { title, content, categoryNames = [], tagNames = [] } = req.body; 

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    const categories = await Promise.all(
      categoryNames.map(async (name) => {
        let category = await Category.findOne({ name });
        if (!category) {
          category = await Category.create({ name, description: `${name} category` });
        }
        return category._id;
      })
    );

    const tags = await Promise.all(
      tagNames.map(async (name) => {
        let tag = await Tag.findOne({ name });
        if (!tag) {
          tag = await Tag.create({ name });
        }
        return tag._id;
      })
    );

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    if (categories.length > 0) blog.categories = categories;
    if (tags.length > 0) blog.tags = tags;

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    await Blog.deleteOne({ _id: blog._id });

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
};

const likeBlog = async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      if (blog.likes.includes(req.user.id)) {
        blog.likes = blog.likes.filter((userId) => userId.toString() !== req.user.id);
        await blog.save();
        return res.status(200).json({ message: 'Like removed', likes: blog.likes.length });
      }
  
      blog.likes.push(req.user.id);
      await blog.save();
      res.status(200).json({ message: 'Blog liked', likes: blog.likes.length });
    } catch (error) {
      res.status(500).json({ message: 'Error toggling like', error });
    }
};

const addComment = async (req, res) => {
  const { text, replyTo } = req.body; 

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (replyTo) {
      const parentComment = blog.comments.find(comment => comment._id.toString() === replyTo);
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
    }

    const comment = {
      user: req.user.id,
      text,
      replyTo: replyTo || null, 
    };

    blog.comments.push(comment);
    await blog.save();

    res.status(201).json(blog.comments);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

const updateComment = async (req, res) => {
  const { text } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update comments on this blog' });
    }

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.text = text || comment.text;
    await blog.save();

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete comments on this blog' });
    }

    blog.comments = blog.comments.filter(c => c._id.toString() !== req.params.commentId);
    await blog.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  updateComment,
  deleteComment
};
