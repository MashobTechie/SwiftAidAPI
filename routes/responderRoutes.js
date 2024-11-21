const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middlewares/authmiddleware");
const authorizeResponder = require("../middlewares/roleCheck");

// Responder-specific controllers
const {
  getInitiatedEmergencies,
  updateEmergencyStatus,
  getResponderEmergencies,
  resolveEmergency,
} = require("../controllers/responderController");

// Auth controllers (shared with users)
const {
  signup,
  login,
  resendEmailVerificationToken,
  verifyUserEmail,
  logout,
} = require("../controllers/authcontroller");

// Middleware to protect and authorize responder routes
router.use(protectRoute); // Ensure user is authenticated
router.use(authorizeResponder); // Ensure user has 'responder' role

// Responder-specific routes
router.get("/initiated", getInitiatedEmergencies); // Fetch emergencies with status 'initiated'
router.patch("/update-status", updateEmergencyStatus); // Update emergency status to 'active'
router.get("/my-emergencies", getResponderEmergencies); // Fetch emergencies assigned to the logged-in responder
router.patch("/resolve", resolveEmergency); // Mark an active emergency as resolved

// Shared auth-related routes for responders
router.post("/signup", signup); // Responder signup
router.post("/login", login); // Responder login
router.post("/resend-verification", resendEmailVerificationToken); // Resend verification email
router.get("/verify-email/:email/:verification_token", verifyUserEmail); // Verify responder email
router.post("/logout", logout); // Logout responder

// Optional dashboard endpoint
router.get("/dashboard", (req, res) => {
  res.status(200).json({ success: true, message: "Welcome to the responder dashboard!" });
});

// Fetch all responders (Admin use case or for listing responders)
router.get("/", async (req, res) => {
  try {
    const responders = await Responder.find();
    res.status(200).json({ success: true, data: responders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update responder information (Admin use case or self-update)
router.patch("/:id", async (req, res) => {
  try {
    const responder = await Responder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!responder) {
      return res.status(404).json({ success: false, message: "Responder not found" });
    }
    res.status(200).json({ success: true, data: responder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
