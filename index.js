require("dotenv").config();
const express = require("express");
const logger = require("./utils/logger"); // Import logger

const { connectDB, connectRedis, redisClient } = require("./db/index");

const apiRoutes = require("./routes/index");

const app = express();
const PORT = 3000;

app.use(express.json());

const startServer = async function () {
  try {
    await connectDB();
    await connectRedis();

    //Attach redisClient to the request object
    app.use(function (req, res, next) {
      req.redisClient = redisClient;
      next();
    });
    app.use(apiRoutes);
    app.get("/", function (req, res) {
      res.send("Welcome to Eternal Blogs");
    });

    app.listen(PORT, function () {
      logger.info(`Server is running on https://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error("Error starting server:", err.message);
  }
};

// Start the server
startServer();
