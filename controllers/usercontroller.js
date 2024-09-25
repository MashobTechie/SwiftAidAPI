const { updateUserById, getUserById } = require("../repositories/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { dataUri } = require("../utils/multer");
const { uploader } = require("../utils/cloudinary");
const filterObj = require("../utils/filterObj");
const bcrypt = require("bcryptjs");

// Handler to update the profile picture
const updateProfilePicture = catchAsync(async (req, res, next) => {
  const userID = req.user._id;

  // Ensure file is uploaded
  if (!req.file) {
    return next(new AppError("Please upload an image", 400)); // 400 Bad Request
  }

  const file = dataUri(req).content; // Convert the uploaded file to a format Cloudinary accepts

  try {
    // Upload image to Cloudinary
    const result = await uploader.upload(file, {
      folder: "SWIFTAID",
      use_filename: true,
    });

    const image = result.url; // Get the URL from Cloudinary response
    const user = await updateUserById(userID, { profileImage: image }); // Update the user profile with the new image URL

    return res.status(200).json({
      message: "Your image has been uploaded successfully to Cloudinary",
      data: { user },
    });
  } catch (err) {
    return next(
      new AppError("Something went wrong while uploading the image", 500)
    );
  }
});

// Handler to get user profile
const getProfile = catchAsync(async (req, res, next) => {
  const user = req.user; // Assume `req.user` is populated by auth middleware

  res.status(200).json({
    status: "success",
    message: "User details retrieved successfully",
    data: { user },
  });
});

// Handler to update user profile details
// Handler to update user profile details
const updateProfile = catchAsync(async (req, res, next) => {
  const userID = req.user._id;

  // Ensure that fields are provided
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Please provide fields to update", 400));
  }

  // Get the user from the database
  const user = await getUserById(userID); // Ensure to include the password field

  // Log the user object for debugging
  console.log("Fetched User:", user);

  // Ensure user exists
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Initialize an object to hold the fields to be updated
  const updates = {};

  // Check if updating password
  if (req.body.newPassword) {
    const { currentPassword, newPassword } = req.body;

    // Ensure both current and new passwords are provided
    if (!currentPassword || !newPassword) {
      return next(
        new AppError("Please provide both current and new passwords", 400)
      );
    }

    // Log the length of the new password
    console.log("New Password Length:", newPassword.length);

    // Check password length (minimum 6 characters and maximum 12 characters)
    if (newPassword.length < 6) {
      return next(new AppError("Password must be more than 6 characters", 400));
    }

    // Check if the provided current password is correct
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return next(new AppError("Current password is incorrect", 400));
    }

    // Hash the new password
    updates.password = await bcrypt.hash(newPassword, 12);
  }

  // Prevent updating the password in the request body directly
  delete req.body.password;

  // Allow only specific fields to be updated
  const allowedFields = filterObj(
    req.body,
    "firstname",
    "lastname",
    "phoneNumber"
  );

  // Merge allowed fields into updates object
  Object.assign(updates, allowedFields);

  // Update the user in the database
  const updatedUser = await updateUserById(userID, { ...updates });

  if (!updatedUser) {
    return next(new AppError("Failed to update user details", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User details updated successfully",
    data: { user: updatedUser },
  });
});

// Handler to update the user password (moved to updateProfile)
const updatePassword = catchAsync(async (req, res, next) => {
  return next(
    new AppError("Use the update profile route to change your password", 400)
  );
});

module.exports = {
  updateProfilePicture,
  getProfile,
  updateProfile,
  updatePassword,
  // Include any other exported functions here
};
