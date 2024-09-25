const joi = require("joi");

// Validation schema for user signup
const validateUserSignup = (data) => {
  const schema = joi.object({
    firstname: joi.string().required().messages({
      "string.base": "First name must be a string",
      "string.empty": "First name cannot be empty",
      "any.required": "First name is required",
    }),
    lastname: joi.string().required().messages({
      "string.base": "Last name must be a string",
      "string.empty": "Last name cannot be empty",
      "any.required": "Last name is required",
    }),
    email: joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.empty": "Email cannot be empty",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    password: joi.string().min(6).required().messages({
      "string.base": "Password must be a string",
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
    phoneNumber: joi.string().required().messages({
      "string.base": "Phone number must be a string",
      "string.empty": "Phone number cannot be empty",
      "any.required": "Phone number is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

// Validation schema for user login
const validateUserLogin = (data) => {
  const schema = joi.object({
    email: joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.empty": "Email cannot be empty",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    password: joi.string().required().messages({
      "string.base": "Password must be a string",
      "string.empty": "Password cannot be empty",
      "any.required": "Password is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  validateUserSignup,
  validateUserLogin,
};
