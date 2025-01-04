require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const redisClient = redis.createClient();

const app = express();
const PORT = 3000;

const authorRoutes = require("./routes/authors");
const postRoutes = require("./routes/posts");

app.use(express.json());

//Attach redisClient to the request object
app.use(function (req, res, next) {
  req.redisClient = redisClient;
  next();
});

app.use(authorRoutes);
app.use(postRoutes);

app.get("/", function (req, res) {
  res.send("Welcome to Eternal Blogs");
});

const dbUrl = process.env.DBURL;

//Redis Connection
redisClient
  .connect()
  .then(function () {
    console.log("Redis connected successfully!");
  })
  .catch(function (err) {
    console.log("Error in connecting to Redis", err);
  });

//DB Connection
mongoose
  .connect(dbUrl)
  .then(function () {
    console.log("DB connected successfully!");
  })
  .catch(function (err) {
    console.log("Error in connecting to DB", err);
  });

app.listen(PORT, function () {
  console.log(`Server is running on https://localhost:${PORT}`);
});
