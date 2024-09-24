const AppError = require("../utils/AppError");

// Handle CastError (e.g., invalid ObjectId)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handle Duplicate Value Error (e.g., unique field constraint violation)
const handleDuplicateValueErrorDB = (err) => {
  const dupKey = Object.keys(err.keyValue)[0];
  const dupValue = Object.values(err.keyValue)[0];
  const message = `${dupKey} with value "${dupValue}" already exists.`;
  return new AppError(message, 400);
};

// Handle Validation Error (e.g., Mongoose validation errors)
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((ele) => ele.message);
  const message = `Invalid Input Data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Handle JWT Errors
const handleJWTError = () =>
  new AppError("Invalid token, please login again", 401);
const handleJWTExpiredError = () =>
  new AppError("Token has expired. Please login again", 401);

// Send Error in Development Mode
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Send Error in Production Mode
const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Log the error to the console (ensure sensitive info is not exposed)
    console.error("ERROR ", err);

    // Send generic message to client
    res.status(500).json({
      status: "error",
      message: "Something went wrong.",
    });
  }
};

const errorHandler = (err, req, res, next) => {
  // Set default status code and message
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Handle error based on environment
  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err }; // Clone error to avoid mutation
    if (err.name === "CastError") error = handleCastErrorDB(err);
    else if (err.code === 11000) error = handleDuplicateValueErrorDB(err);
    else if (err.name === "ValidationError")
      error = handleValidationErrorDB(err);
    else if (err.name === "JsonWebTokenError") error = handleJWTError();
    else if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendProdError(error, res);
  }

  // Pass control to the next middleware (if any)
  next();
};

module.exports = errorHandler;
