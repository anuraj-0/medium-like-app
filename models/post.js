const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ title: 1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
