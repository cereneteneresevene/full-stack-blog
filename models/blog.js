const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    views: { type: Number, default: 0 },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        replyTo: { type: mongoose.Schema.Types.ObjectId }, 
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Blog', blogSchema);
