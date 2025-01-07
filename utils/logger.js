// logger.js
const winston = require("winston");

const logger = winston.createLogger({
  level: "info", // Set the default logging level
  format: winston.format.combine(
    winston.format.colorize(), // Adds color to logs
    winston.format.timestamp(), // Adds timestamps
    winston.format.printf(
      ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: "app.log" }), // Log to file
  ],
});

module.exports = logger;
