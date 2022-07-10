const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

if (process.env.NODE_ENV != "production") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// Importing routes
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

// Using Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Using routes
app.use("/api/v1", postRoutes);
app.use("/api/v1", userRoutes);

module.exports = app;
