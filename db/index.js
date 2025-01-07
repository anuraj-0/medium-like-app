const mongoose = require("mongoose");
const redis = require("redis");
const redisClient = redis.createClient();

const connectDB = async function () {
  try {
    const dbUrl = process.env.DBURL;
    await mongoose.connect(dbUrl);
    console.log("DB connected successfully!");
  } catch (err) {
    console.log("Error in connecting to DB", err);
  }
};

const connectRedis = async function () {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully!");
  } catch (err) {
    console.log("Error in connecting to Redis", err);
  }
};

module.exports = { connectDB, connectRedis, redisClient };
