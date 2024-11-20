const express = require("express");
const router = express.Router();
const User = require("./models/User");
const Responder = require("./models/Responder");
const Hospital = require("./models/Hospital");

// Victim sends emergency request
router.post("/send-emergency", isAuthenticated, async (req, res) => {
  const { location, medicalRecordId } = req.body;
  
  try {
    // Update user's location
    const user = await User.findById(req.user.id);
    user.location = location;
    await user.save();

    // Notify responder(s) here
    const responder = await Responder.findOne({ status: "available" }); 
    if (responder) {
      responder.currentEmergency = user._id;
      responder.status = "onDuty";
      await responder.save();
    }

    res.status(200).json({ success: true, message: "Emergency sent to responder" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Responder forwards data to hospital
router.post("/responder/send-to-hospital", isAuthenticated, isResponder, async (req, res) => {
  const { hospitalId, medicalRecordId } = req.body;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) return res.status(404).json({ success: false, message: "Hospital not found" });

    // Fetch medical record if needed
    const medicalRecord = await MedicalRecord.findById(medicalRecordId);
    
    // Send data (this might be replaced with real-time notifications in an actual application)
    hospital.currentPatients.push(req.user.id);
    await hospital.save();

    res.status(200).json({ success: true, message: "Medical record sent to hospital" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
