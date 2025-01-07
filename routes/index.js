const express = require("express");
const authorRoute = require("./authors");
const postRoute = require("./posts");

const router = express.Router();

router.use(postRoute);
router.use(authorRoute);

module.exports = router;
