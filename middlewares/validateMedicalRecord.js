const Joi = require("joi");

const schema = Joi.object({
  userId: Joi.string().length(24).hex().required(), // Assuming userId is a MongoDB ObjectId
  bloodType: Joi.string().required(),
  sex: Joi.string().valid("male", "female", "other").required(), // Validate specific values
  age: Joi.number().integer().positive().required(),
  previousSurgeries: Joi.array().items(
    Joi.object({
      surgeryName: Joi.string().required(),
      reasonForSurgery: Joi.string().required(),
      date: Joi.date().required(),
    })
  ),
  allergies: Joi.array().items(Joi.string()),
  medications: Joi.array().items(Joi.string()),
  chronicConditions: Joi.array().items(Joi.string()),
  emergencyContacts: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      relationship: Joi.string().required(),
      phone: Joi.string().required(),
    })
  ),
});

// Middleware function to validate incoming request body
function validateMedicalRecord(req, res, next) {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next(); // Proceed to the next middleware or route handler
}

module.exports = validateMedicalRecord;
