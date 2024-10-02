const { createToken } = require("./token");
const sendEmail = require("./email");
const { encryptString } = require("./encryption");

// Function that creates an email verification token and sends it to the user's email.
// FUnction params: the request object, and the user object
// returns the hashed verification token

const createVerificationTokenAndSendToEmail = (req, user) => {
  // Create a verification URL and send to the user's email for verification
  const verificationToken = createToken("hex");
  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/verify/${user.email}/${verificationToken}`;

  sendEmail({
    email: user.email,
    subject: "Email Verification",
    message: `
    Welcome to SwiftAid.
    Please click on the link below to verify your email address: \n\n ${verificationUrl}`,
  });

  // Hash the verification token and save to the user data in the database
  const hashedVerificationToken = encryptString(verificationToken, 10);
  return hashedVerificationToken;
};

module.exports = { createVerificationTokenAndSendToEmail };
