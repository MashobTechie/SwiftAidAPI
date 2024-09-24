const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const userController = require("../controllers/usercontroller");
const { multerUploads } = require("../utils/multer");
const User = require("../models/usermodel"); // Adjust the path as necessary

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware.protectRoute);

// Route to update profile image
router.patch(
  "/profile-image",
  multerUploads,
  userController.updateProfilePicture
);

// Route to get and update user profile
router
  .route("/profile")
  .get(userController.getProfile)
  .patch(userController.updateProfile);

// Route to update user password
router.patch("/update-password", userController.updatePassword);

module.exports = router;
