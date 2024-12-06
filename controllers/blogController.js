const Blog = require('../models/blog');
const Category = require('../models/category');
const Tag = require('../models/tag');
const User = require('../models/user');

const createBlog = async (req, res) => {
  try {
    console.log("Gelen Body:", req.body); // Debug: Gelen veriler
    console.log("Category Names (Raw):", req.body.categoryNames);
    console.log("Tag Names (Raw):", req.body.tagNames);

    // Gelen verilerin destructure edilmesi
    const { title, content, categoryNames, tagNames } = req.body;

    // Kullanıcı rol kontrolü
    if (!req.user || !['writer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Only writers and admins can create blogs',
      });
    }

    // **Kategori ve Etiketlerin JSON Array Formatında Olup Olmadığını Kontrol Et**
    let parsedCategoryNames = [];
    let parsedTagNames = [];
    try {
      parsedCategoryNames = JSON.parse(categoryNames || "[]");
      parsedTagNames = JSON.parse(tagNames || "[]");

      if (!Array.isArray(parsedCategoryNames) || !Array.isArray(parsedTagNames)) {
        throw new Error("Invalid format");
      }
    } catch (error) {
      return res.status(400).json({
        message: "Invalid format for categories or tags. Must be a JSON array.",
      });
    }

    // **Kategorileri ve Etiketleri İşle**
    const categories = await processCategories(parsedCategoryNames);
    const tags = await processTags(parsedTagNames);

    // **Görsel Kontrolü**
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // **Blog Oluşturma**
    const newBlog = new Blog({
      title,
      content,
      author: req.user.id,
      categories,
      tags,
      image: imageUrl,
    });

    const savedBlog = await newBlog.save();

    // **Başarılı Yanıt**
    res.status(201).json({
      message: "Blog created successfully",
      blog: savedBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error.message);
    res.status(500).json({
      message: "Error creating blog",
      error: error.message,
    });
  }
};

// **Kategorileri İşleme Fonksiyonu**
const processCategories = async (categoryNames) => {
  try {
    const categories = await Promise.all(
      categoryNames.map(async (name) => {
        if (!name.trim()) {
          throw new Error("Category name cannot be empty");
        }
        let category = await Category.findOne({ name });
        if (!category) {
          category = await Category.create({
            name,
            description: `${name} category`,
          });
        }
        return category._id;
      })
    );
    return categories;
  } catch (error) {
    throw new Error("Error processing categories: " + error.message);
  }
};

// **Etiketleri İşleme Fonksiyonu**
const processTags = async (tagNames) => {
  try {
    const tags = await Promise.all(
      tagNames.map(async (name) => {
        if (!name.trim()) {
          throw new Error("Tag name cannot be empty");
        }
        let tag = await Tag.findOne({ name });
        if (!tag) {
          tag = await Tag.create({ name });
        }
        return tag._id;
      })
    );
    return tags;
  } catch (error) {
    throw new Error("Error processing tags: " + error.message);
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

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : blog.image;

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
    blog.image = imageUrl; // Resim URL'sini güncelleyin
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

const searchBlogs = async (req, res) => {
  try {
    const { keyword, category, tags, author, sortBy, sortOrder } = req.query;

    const filter = {};

    // Başlık, içerik ve yazar ismine göre arama
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
        { 'author.username': { $regex: keyword, $options: 'i' } }, // Yazar adı eşleşmesi
      ];
    }

    // Kategori adına göre filtreleme
    if (category) {
      const categoryObjects = await Category.find({ name: { $regex: category, $options: 'i' } }, '_id');
      const categoryIds = categoryObjects.map((cat) => cat._id);
      filter.categories = { $in: categoryIds }; // Kategori ID'lerini eşleştir
    }

    // Tag adına göre filtreleme
    if (tags) {
      const tagNames = tags.split(',');
      const tagObjects = await Tag.find({ name: { $in: tagNames } }, '_id');
      const tagIds = tagObjects.map((tag) => tag._id);
      filter.tags = { $in: tagIds }; // Tag ID'lerini eşleştir
    }

    // Yazar adına göre filtreleme (tam eşleşme)
    if (author) {
      const authorObject = await User.findOne({ username: { $regex: author, $options: 'i' } }, '_id');
      if (authorObject) filter.author = authorObject._id;
    }

    // Sıralama kriterleri
    let sort = {};
    if (sortBy === 'likes') {
      sort = { likes: sortOrder === 'asc' ? 1 : -1 }; // Beğeni sayısına göre azalan/artan
    } else if (sortBy === 'views') {
      sort = { views: sortOrder === 'asc' ? 1 : -1 }; // Görüntülenme sayısına göre azalan/artan
    } else {
      sort = { createdAt: -1 }; // Varsayılan sıralama: en son eklenen
    }

    // Blogları getir
    const blogs = await Blog.find(filter)
      .populate('author', 'username email') // Yazar bilgileri
      .populate('categories', 'name description') // Kategori bilgileri
      .populate('tags', 'name') // Tag bilgileri
      .sort(sort);

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
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
  deleteComment,
  searchBlogs
};
