const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    reply: {
      type: String,
      required: [true, "Please enter a reply"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    blog: {
      type: mongoose.Schema.ObjectId,
      ref: "Blog",
      required: [true, "Comment must belong to a blog"],
    },
    isParent: {
      type: Boolean,
      default: true,
    },
    comment: {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.index({ blog: 1, user: 1 }, { unique: true });

commentSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name",
  });
});

commentSchema.pre("save", async function (next) {
  if (!this.isModified("comment")) return (this.comment = null), next();
  this.isParent = false;
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
