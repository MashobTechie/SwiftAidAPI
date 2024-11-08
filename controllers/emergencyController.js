const Emergency = require("../models/emergencyModel");
const MedicalRecord = require("../models/usermedicalrecord");
const User = require("../models/usermodel");

// Initiating Emergency
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
      user: userId, // Correct the field name to 'user'
      status: "initiated",
      location: location,
    });

    await emergency.save();

    // Find the user's medical record
    const medicalRecord = await MedicalRecord.findOne({ user: userId });

    // Return success response
    return res.status(201).json({
      message:
        "Emergency has been initiated, sit tight for the responder is on their way",
      emergencyId: emergency._id,
      medicalRecord: medicalRecord || "No medical record found",
    });
  } catch (error) {
    console.error("Error initiating emergency:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getInitiatedEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find({ status: "initiated" })
      .populate("user", "firstname lastname location")
      .exec();
    res.status(200).json({ message: "Initiated emergencies fetched", emergencies });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const acceptEmergency = async (req, res) => {
  try {
    const { responderId, emergencyId } = req.body;

    // Find the responder and update their status to "onDuty"
    const responder = await Responder.findByIdAndUpdate(
      responderId,
      { status: "onDuty", currentEmergency: emergencyId },
      { new: true }
    );

    if (!responder) return res.status(404).json({ message: "Responder not found" });

    // Update the emergency status to "active"
    const emergency = await Emergency.findByIdAndUpdate(
      emergencyId,
      { status: "active" },
      { new: true }
    ).populate("user");

    if (!emergency) return res.status(404).json({ message: "Emergency not found" });

    // Respond with updated emergency
    res.status(200).json({ message: "Emergency accepted", emergency });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Notify Hospital with Medical Record
const notifyHospital = async (req, res) => {
  try {
    const { emergencyId } = req.body;

    // Find the emergency and populate user details
    const emergency = await Emergency.findById(emergencyId).populate("user");
    if (!emergency) return res.status(404).json({ message: "Emergency not found" });

    // Fetch the medical record of the user
    const medicalRecord = await MedicalRecord.findOne({ user: emergency.user._id });
    if (!medicalRecord) return res.status(404).json({ message: "Medical record not found" });

    // Example of sending a notification to the hospital
    console.log("Hospital notified about emergency:", emergencyId);
    console.log("User's medical record:", medicalRecord);

    // Respond with success message including emergency details and medical record
    res.status(200).json({
      message: "Hospital notified successfully",
      emergency: {
        id: emergency._id,
        status: emergency.status,
        location: emergency.location,
        user: emergency.user,
      },
      medicalRecord: medicalRecord
    });
  } catch (error) {
    console.error("Error notifying hospital:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 

 



module.exports = {
  initiateEmergency,
  getInitiatedEmergencies,
  acceptEmergency,
  notifyHospital
};

  
