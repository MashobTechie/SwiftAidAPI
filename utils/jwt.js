const jwt = require("jsonwebtoken");

// Function to sign JWT Token
const signJWTToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Function to send JWT token in response
const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("jwt", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = { signJWTToken, sendToken };
