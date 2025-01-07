const mongoose = require("mongoose");
const Joi = require("joi");

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

// Create a Joi schema for validation
const postJoiSchema = Joi.object({
  title: Joi.string().min(3).required(), // Name must be a string, at least 3 characters
  body: Joi.string().min(100).required(),
  author: Joi.string(),
  likes: Joi.number(),
});

// Create a function to validate data before saving
const validatePost = (post) => {
  return authorJoiSchema.validate(post); // Validates the author object using Joi schema
};
postSchema.index({ title: 1 });
const Post = mongoose.model("Post", postSchema);

module.exports = { Post, validatePost };
