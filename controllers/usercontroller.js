const { updateUserById, getUserById } = require("../repositories/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { dataUri } = require("../utils/multer");
const { uploader } = require("../utils/cloudinary");
const filterObj = require("../utils/filterObj");
const updateProfilePicture = catchAsync(async (req, res, next) => {
  const userID = req.user._id;

  if (!req.file) {
    return next(new AppError("Please upload an image", 400)); // Changed to 400 Bad Request
  }

  const file = dataUri(req).content;

  try {
    const result = await uploader.upload(file, {
      folder: "Synconference",
      use_filename: true,
    });

    const image = result.url;
    const user = await updateUserById(userID, { profileImage: image });

    return res.status(200).json({
      message: "Your image has been uploaded successfully to Cloudinary",
      data: { user },
    });
  } catch (err) {
    return next(
      new AppError("Something went wrong while uploading image", 500)
    );
  }
});

const getProfile = catchAsync(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    status: "success",
    message: "User details retrieved successfully",
    data: { user },
  });
});

const updateProfile = catchAsync(async (req, res, next) => {
  const userID = req.user._id;

  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Please provide fields to update", 400));
  }

  if (req.body.password) {
    return next(new AppError("This route is not for password updates", 400));
  }

  const allowedFields = filterObj(
    req.body,
    "firstname",
    "lastname",
    "phoneNumber"
  );
  const user = await updateUserById(userID, allowedFields);

  if (!user) {
    return next(new AppError("Failed to update user details", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User details updated successfully",
    data: { user },
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new AppError("Please provide both current and new passwords", 400)
    );
  }

  const user = await getUserById(req.user._id).select("+password");

  if (!(await user.confirmPassword(currentPassword, user.password))) {
    return next(new AppError("Current password is incorrect", 400));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully!",
  });
});

module.exports = {
  updateProfilePicture,
  getProfile,
  updateProfile,
  updatePassword,
};
