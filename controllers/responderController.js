const Emergency = require("../models/emergencyModel"); // Adjust path as needed
// const { notifyHospital } = require("../services/notificationService"); // Replace with actual notification service

/**
 * Get all emergencies with status 'initiated'
 */
const getInitiatedEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find({ status: "initiated" }).populate("victim");

    res.status(200).json({
      success: true,
      message: "Initiated emergencies fetched successfully",
      data: emergencies,
    });
  } catch (error) {
    console.error("Error fetching initiated emergencies:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Update the status of an emergency
 */
const updateEmergencyStatus = async (req, res) => {
  try {
    const { emergencyId } = req.body;

    const emergency = await Emergency.findById(emergencyId);
    if (!emergency || emergency.status !== "initiated") {
      return res.status(404).json({ success: false, message: "Emergency not found or already being handled" });
    }

    // Update status and save
    emergency.status = "active";
    emergency.responder = req.user.id; // Associate the logged-in responder with this emergency
    await emergency.save();

    // Notify hospital
    await notifyHospital(emergency);

    res.status(200).json({
      success: true,
      message: "Emergency status updated to active and hospital notified",
      data: emergency,
    });
  } catch (error) {
    console.error("Error updating emergency status:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Get emergencies handled by the logged-in responder
 */
const getResponderEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find({ responder: req.user.id }).populate("victim");

    res.status(200).json({
      success: true,
      message: "Emergencies handled by the responder fetched successfully",
      data: emergencies,
    });
  } catch (error) {
    console.error("Error fetching responder emergencies:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Mark an emergency as resolved
 */
const resolveEmergency = async (req, res) => {
  try {
    const { emergencyId } = req.body;

    const emergency = await Emergency.findById(emergencyId);
    if (!emergency || emergency.status !== "active") {
      return res.status(404).json({ success: false, message: "Emergency not found or not active" });
    }

    // Update status and save
    emergency.status = "resolved";
    await emergency.save();

    res.status(200).json({
      success: true,
      message: "Emergency marked as resolved",
      data: emergency,
    });
  } catch (error) {
    console.error("Error resolving emergency:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Notify the nearest hospital (Optional Placeholder)
 * - Implement actual logic to find the nearest hospital and notify them.
 */
const notifyHospital = async (emergency) => {
  // Placeholder logic: Notify hospital logic can be implemented here.
  console.log(`Hospital notified for emergency: ${emergency._id}`);
};

module.exports = {
  getInitiatedEmergencies,
  updateEmergencyStatus,
  getResponderEmergencies,
  resolveEmergency,
};
