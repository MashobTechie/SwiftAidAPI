const jwt = require("jsonwebtoken");
const {
  createNewUser,
  getUserByEmail,
  updateUserById,
} = require("../repositories/user");
const User = require("../models/usermodel"); // Ensure this path is correct

const {
  validateUserLogin,
  validateUserSignup,
} = require("../validations/user");
const { signJWTToken } = require("../utils/jwt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { compareEncryptedString } = require("../utils/encryption");
const {
  createVerificationTokenAndSendToEmail,
} = require("../utils/createVerificationToken");

// Signup function
const signup = catchAsync(async (req, res, next) => {
  const { firstname, lastname, phoneNumber, email, password } = req.body;

  // Validating the request body
  const validation = validateUserSignup({
    firstname,
    lastname,
    email,
    password,
    phoneNumber,
  });
  if (validation.error) {
    return next(new AppError(validation.error.message, 400)); // Use 400 for bad requests
  }

  // Check if the user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return next(
      new AppError("User with the specified email address already exists", 400)
    );
  }

  // Create new user
  const newUser = await createNewUser({
    firstname,
    lastname,
    phoneNumber,
    email,
    password,
  });
  if (!newUser) {
    return next(new AppError("Failed to create new user", 500)); // Use 500 for server errors
  }

  // Create verification token and send email
  const hashedVerificationToken = await createVerificationTokenAndSendToEmail(
    req,
    newUser
  );
  await updateUserById(newUser._id, {
    verificationToken: hashedVerificationToken,
  });

  // Generate JWT token and send response
  const token = signJWTToken(newUser._id);
  res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    })
    .status(201)
    .json({
      status: "success",
      data: newUser,
    });
});

// Login function
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find the user by email and select the password field
  const user = await User.findOne({ email }).select("+password");

  // Check if the user exists and if the password is correct
  if (!user || !(await user.confirmPassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // Generate a new JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Set the token as a cookie in the response
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  // Send response with success status and token
  res.status(200).json({
    status: "success",
    token,
  });
  console.log("User:", user); // Debug user
});

// Resend Verification email
const resendEmailVerificationToken = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Check if user exists
  const user = await getUserByEmail(email).select("+verificationToken");
  if (!user) {
    return next(
      new AppError("User with the specified email address does not exist", 404)
    );
  }

  if (user.emailVerified) {
    return next(new AppError("User has already been verified", 400)); // Use 400 for bad requests
  }

  // Send verification email and update token
  const hashedVerificationToken = await createVerificationTokenAndSendToEmail(
    req,
    user
  );
  await updateUserById(user._id, {
    verificationToken: hashedVerificationToken,
  });

  res.status(200).json({
    status: "success",
    message: "Verification link has been resent to your email address",
  });
});

// Verify User Email
const verifyUserEmail = catchAsync(async (req, res, next) => {
  const { email, verification_token } = req.params;

  // Check if user exists
  const user = await getUserByEmail(email).select("+verificationToken");
  if (!user) {
    return next(
      new AppError("User with the specified email address does not exist", 404)
    );
  }

  if (user.emailVerified) {
    return next(new AppError("User has already been verified", 400)); // Use 400 for bad requests
  }

  // Verify the token
  if (
    !(await compareEncryptedString(verification_token, user.verificationToken))
  ) {
    return next(new AppError("Invalid verification token", 400)); // Use 400 for bad requests
  }

  // Update verification status
  const verifiedUser = await updateUserById(
    user._id,
    {
      emailVerified: true,
      verificationToken: null,
    },
    { new: true }
  );

  // Check if profile is complete
  if (!verifiedUser.profileCompleted) {
    // Redirect to the profile completion page
    return res.redirect("/complete-profile"); // Replace with the appropriate frontend URL if needed
  }

  res.status(200).json({
    status: "success",
    message: "User's email verified successfully",
    user: verifiedUser,
  });
});

// Complete User Profile
const completeProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // This assumes `authenticateUser` middleware is used
  const { emergencyContact, medicalCondition } = req.body;

  // Find and update the user profile
  const user = await updateUserById(
    userId,
    {
      emergencyContact,
      medicalCondition,
      profileCompleted: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Profile completed successfully",
    data: {
      user,
    },
  });
});

// Logout function
const logout = async (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Successfully logged out" });
};

module.exports = {
  signup,
  login,
  resendEmailVerificationToken,
  verifyUserEmail,
  logout,
  completeProfile,
};
