const express = require("express");
const Post = require("../models/post");
const Author = require("../models/author");
const router = express.Router();

router.post("/posts", async function (req, res) {
  try {
    const post = new Post(req.body);
    await post.save();

    const author = await Author.findById(req.body.author);
    author.posts.push(post._id);
    await author.save();

    res.send(post);
  } catch (err) {
    res.send(err);
  }
});

router.post("/posts/like/:id", async function (req, res) {
  try {
    const likedPost = await Post.findById(req.params.id);
    likedPost.likes++;
    await likedPost.save();
    res.send(likedPost);
  } catch (err) {
    res.send(err);
  }
});

router.get("/posts/author/:id", async function (req, res) {
  try {
    const author = await Author.findById(req.params.id).populate("posts");
    res.send(author.posts);
  } catch (err) {
    res.send(err);
  }
});

router.get("/posts", async function (req, res) {
  try {
    const redisClient = req.redisClient;
    const cachedPosts = await redisClient.get("allPosts");

    if (cachedPosts) {
      res.send(JSON.parse(cachedPosts));
    } else {
      const posts = await Post.find().populate("author");
      await redisClient.setEx("allPosts", 3600, JSON.stringify(posts));
      res.send(posts);
    }
  } catch (err) {
    res.send(err);
  }
});

router.put("/posts/:id", async function (req, res) {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(updatedPost);
  } catch (err) {
    res.send(err);
  }
});

router.delete("/posts/:id", async function (req, res) {
  try {
    const deletePost = await Post.findByIdAndDelete(req.params.id);
    res.send({
      message: `Post with title ${deletePost.title} has been deleted!`,
    });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
