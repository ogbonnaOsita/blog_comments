const Comment = require("../models/commentModel");
const Blog = require("../models/blogModel");

exports.getAllComments = async (req, res) => {
  try {
    let filter = {};
    if (req.params.blogId) filter = { blog: req.params.blogId };
    const comments = await Comment.find(filter);
    res.status(200).json({
      status: "success",
      result: comments.length,
      data: {
        comments,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.getComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        comment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.createComment = async (req, res) => {
  try {
    //Allow nested routes
    if (!req.body.blog) req.body.blog = req.params.blogId;
    const newComment = await Comment.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        comment: newComment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        comment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "Deleted successfully",
      data: {
        comment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
