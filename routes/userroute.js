const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const userController = require("../controllers/usercontroller");
const { multerUploads } = require("../utils/multer");
const rateLimit = require("express-rate-limit"); // Add rate limiting import

const router = express.Router();

// Add rate limiter for profile updates
const profileUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message:
    "Too many profile update attempts from this IP, please try again later.",
});

// Apply authentication middleware
router.use(authMiddleware.protectRoute);

// Apply the rate limiter to the update profile route
router.patch("/profile", profileUpdateLimiter, userController.updateProfile);

// Route to update profile image
router.patch(
  "/profile-image",
  multerUploads,
  userController.updateProfilePicture
);

// Route to get user profile
router.get("/profile", userController.getProfile);

module.exports = router;
