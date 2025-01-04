const express = require("express");
const Author = require("../models/author");
const router = express.Router();

router.post("/authors", async function (req, res) {
  try {
    const author = new Author(req.body);
    await author.save();
    res.send(author);
  } catch (err) {
    res.send(err);
  }
});

router.get("/authors", async function (req, res) {
  try {
    const authors = await Author.find().populate("posts");
    res.send(authors);
  } catch (err) {
    res.send(err);
  }
});

router.put("/authors/:id", async function (req, res) {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(author);
  } catch (err) {
    res.send(err);
  }
});

router.delete("/authors/:id", async function (req, res) {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    res.send({ message: `Author ${author.name} has been deleted!` });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
