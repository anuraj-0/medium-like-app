const mongoose = require("mongoose");
const Joi = require("joi");

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

// Create a Joi schema for validation
const authorJoiSchema = Joi.object({
  name: Joi.string().min(3).required(), // Name must be a string, at least 3 characters
  email: Joi.string().email().required(), // Email must be a valid email
  posts: Joi.array(), // Optional: Assuming you want to validate post IDs
});

// Create a function to validate data before saving
const validateAuthor = (author) => {
  return authorJoiSchema.validate(author); // Validates the author object using Joi schema
};

authorSchema.index({ name: 1 });

const Author = mongoose.model("Author", authorSchema);

module.exports = { Author, validateAuthor };
