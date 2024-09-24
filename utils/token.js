const crypto = require("crypto");
const createToken = (encryptionMethod) => {
  // Generate verification token using crypto
  let token = crypto.randomBytes(32).toString(encryptionMethod);
  return token;
};

module.exports = { createToken };
