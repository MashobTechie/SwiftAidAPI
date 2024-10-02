const User = require("../models/usermodel"); // Ensure this is correct
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

// Add emergency contact method
const addEmergencyContact = catchAsync(async (req, res, next) => {
  const { contact } = req.body; // Assuming contact is the emergency contact object

  if (!req.user) {
    return next(new AppError("User not authenticated", 401));
  }

  const user = req.user;
  user.emergencyContacts.push(contact);
  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const protectRoute = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser;
  next();
};

// Update emergency contact method
const updateEmergencyContact = catchAsync(async (req, res, next) => {
  const { contactId, updatedContact } = req.body;

  if (!req.user) {
    return next(new AppError("User not authenticated", 401));
  }

  const user = req.user;
  const contact = user.emergencyContacts.id(contactId);
  if (!contact) {
    return next(new AppError("Contact not found", 404));
  }

  Object.assign(contact, updatedContact);
  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// Delete emergency contact method
const deleteEmergencyContact = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;

  if (!req.user) {
    return next(new AppError("User not authenticated", 401));
  }

  const user = req.user;
  const contact = user.emergencyContacts.id(contactId);
  if (!contact) {
    return next(new AppError("Contact not found", 404));
  }

  contact.remove();
  await user.save();

  res.status(204).json({
    status: "success",
    message: "Contact deleted",
  });
});

// Get emergency contacts method
const getEmergencyContacts = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("User not authenticated", 401));
  }

  const user = req.user;
  res.status(200).json({
    status: "success",
    data: {
      emergencyContacts: user.emergencyContacts,
    },
  });
});

module.exports = {
  protectRoute,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts,
};
