const bcrypt = require("bcryptjs");

// compare a string with an encrypted string
const compareEncryptedString = async (string, encryptedString) => {
  return await bcrypt.compare(string, encryptedString);
};

// encrypt a string
const encryptString = (string, salt) => {
  return bcrypt.hashSync(string, salt);
};

module.exports = { compareEncryptedString, encryptString };
