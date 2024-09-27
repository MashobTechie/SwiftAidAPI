// app.js
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errormiddleware");
const AppError = require("./utils/AppError");
const authRoutes = require("./routes/authroute");
const userRoutes = require("./routes/userroute");
const emergencyContactRoutes = require("./routes/emergencyContactRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoute"); // Import medical record routes
const { cloudinaryConfig } = require("./utils/cloudinary");

const app = express();
const appName = "SwiftAid";

// Middleware stack
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("*", cloudinaryConfig);

// Default welcome route
app.get("/", (req, res) => {
  res.json({
    message: `Welcome to ${appName}`,
  });
});

// Base API route
app.get("/api/v1", (req, res) => {
  res.json({
    message: `Welcome to ${appName} API`,
  });
});

// Routes for authentication, users, emergency contacts, and medical records
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emergency", emergencyContactRoutes);
app.use("/api/v1/medicalRecords", medicalRecordRoutes); // Add medical record routes

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} using HTTP method ${req.method} on this server. Route not defined.`,
      404
    )
  );
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
