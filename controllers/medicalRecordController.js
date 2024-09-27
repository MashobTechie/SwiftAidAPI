const MedicalRecord = require("../models/usermedicalrecord");
const mongoose = require("mongoose");
const User = require("../models/usermodel");

const createMedicalRecord = async (req, res) => {
  try {
    // Extract fields from the request body
    const {
      userId,
      bloodType,
      sex,
      age,
      previousSurgeries,
      allergies,
      medications,
      chronicConditions,
      emergencyContacts,
    } = req.body;

    console.log("Received request body:", req.body);

    const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
    if (!isValidObjectId) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Normalize the sex value
    const normalizedSex =
      sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase();

    // Create a new medical record
    const medicalRecord = new MedicalRecord({
      user: user._id,
      bloodType,
      sex: normalizedSex,
      age,
      previousSurgeries,
      allergies,
      medications,
      chronicConditions,
      emergencyContacts,
    });

    console.log("Medical record to save:", medicalRecord);

    await medicalRecord.save();

    user.medicalRecords.push(medicalRecord._id);
    await user.save();

    return res.status(201).json({
      message: "Medical record created successfully",
      medicalRecord,
    });
  } catch (error) {
    console.error("Error creating medical record:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get all medical records for a user
const getMedicalRecords = async (req, res) => {
  try {
    const { userId } = req.params;

    const medicalRecords = await MedicalRecord.find({
      user: userId,
    }).populate("user");
    return res.status(200).json(medicalRecords);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Update a medical record
const updateMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const updates = req.body;

    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      recordId,
      updates,
      { new: true }
    );
    if (!updatedRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    return res
      .status(200)
      .json({ message: "Medical record updated successfully", updatedRecord });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Delete a medical record
const deleteMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;

    const deletedRecord = await MedicalRecord.findByIdAndDelete(recordId);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    // Remove the reference in the user's medicalRecords array
    await User.updateOne(
      { medicalRecords: recordId },
      { $pull: { medicalRecords: recordId } }
    );

    return res
      .status(200)
      .json({ message: "Medical record deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createMedicalRecord,
  getMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
};
