const catchAsync = require("../utils/catchAsync");
const User = require("../models/usermodel");
const AppError = require("../utils/AppError");
const mongoose = require("mongoose");

// Add emergency contact
const addEmergencyContact = catchAsync(async (req, res, next) => {
  const userId = req.user?.id;
  const { name, relationship, contactNumber } = req.body;

  if (!userId) {
    return next(new AppError("User not authenticated", 401));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Add the new emergency contact to the user's emergencyContacts array
  user.emergencyContacts.push({ name, relationship, contactNumber });
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Emergency contact added successfully",
    data: user.emergencyContacts,
  });
});

 
// Update emergency contact
const updateEmergencyContact = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Get the user ID from the authenticated user
  const { name, relationship, contactNumber } = req.body; // Extract fields from the request body
  const { contactId } = req.params; // Get the contactId from the URL parameters

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404)); // Handle user not found
  }

  // Find the index of the emergency contact in the user's emergency contacts array
  const contactIndex = user.emergencyContacts.findIndex(
    (contact) => contact._id.toString() === contactId
  );

  // If the contact is not found, return an error
  if (contactIndex === -1) {
    return next(new AppError("Emergency contact not found", 404));
  }

  // Update the contact's details
  user.emergencyContacts[contactIndex] = {
    name,
    relationship,
    contactNumber,
  };

  // Save the updated user document
  await user.save();

  // Send a success response
  res.status(200).json({
    status: "success",
    message: "Emergency contact updated successfully",
    data: user.emergencyContacts, // Return updated emergency contacts
  });

  console.log("Contact ID:", contactId); // Log the contact ID for debugging
});

// Delete an emergency contact
const deleteEmergencyContact = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Get the user ID from the authenticated user
  const { contactId } = req.params; // Get the contactId from the URL parameters

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404)); // Handle user not found
  }

  // Filter out the contact that needs to be deleted
  const updatedContacts = user.emergencyContacts.filter(
    (contact) => contact._id.toString() !== contactId
  );

  // Check if the contact was found and removed
  if (updatedContacts.length === user.emergencyContacts.length) {
    return next(new AppError("Emergency contact not found", 404));
  }

  // Update the user's emergency contacts array
  user.emergencyContacts = updatedContacts;

  // Save the updated user document
  await user.save();

  // Send a success response
  res.status(200).json({
    status: "success",
    message: "Emergency contact deleted successfully",
    data: {
      emergencyContacts: user.emergencyContacts, // Return the remaining emergency contacts
    },
  });
});

// Get all emergency contacts
const getEmergencyContacts = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select("emergencyContacts");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: user.emergencyContacts,
  });
});
module.exports = {
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts,
};
