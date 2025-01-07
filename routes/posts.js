const express = require("express");
const router = express.Router();

const { postController } = require("../controllers/index");

// Defining routes and their associated controller functions
router.post("/posts", postController.createPost);
router.post("/posts/like/:id", postController.likePost);
router.get("/posts/author/:id", postController.getPostsByAuthor);
router.get("/posts", postController.getPosts);
router.put("/posts/:id", postController.updatePost);
router.delete("/posts/:id", postController.deletePost);

module.exports = router;
