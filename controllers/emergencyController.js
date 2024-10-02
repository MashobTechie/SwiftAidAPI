const Emergency = require("../models/emergencyModel");
const MedicalRecord = require("../models/usermedicalrecord");
const User = require("../models/usermodel");
const initiateEmergency = async (req, res) => {
    try {
      const { userId, location } = req.body;
  
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Create a new emergency instance
      const emergency = new Emergency({
        user: userId,  // Correct the field name to 'user'
        status: "initiated",
        location: location,
      });
  
      await emergency.save();
  
      // Find the user's medical record
      const medicalRecord = await MedicalRecord.findOne({ user: userId });
  
      // Return success response
      return res.status(201).json({
        message: "Emergency has been initiated, sit tight for the responder is on their way",
        emergencyId: emergency._id,
        medicalRecord: medicalRecord || "No medical record found",
      });
    } catch (error) {
      console.error("Error initiating emergency:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  module.exports = {
    initiateEmergency,
  };
  
