const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A blog must have a title"],
    unique: true,
  },
  content: {
    type: String,
    trim: true,
    required: [true, "A blog must have content"],
  },
  numComments: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
