// responderRoutes.js
const express = require("express");
const Responder = require("../models/responderModel");
const { isAuthenticated, isResponder } = require("../middlewares/auth");

const router = express.Router();

// Route to update responder status
router.patch("/status", isAuthenticated, isResponder, async (req, res) => {
  const { status } = req.body;

  try {
    const responder = await Responder.findOneAndUpdate(
      { user: req.user.id },
      { status },
      { new: true }
    );
    res.status(200).json({ success: true, data: responder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating status" });
  }
});

// Route to update responder location
router.patch("/location", isAuthenticated, isResponder, async (req, res) => {
  const { coordinates } = req.body;

  try {
    const responder = await Responder.findOneAndUpdate(
      { user: req.user.id },
      { location: { type: "Point", coordinates } },
      { new: true }
    );
    res.status(200).json({ success: true, data: responder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating location" });
  }
});

module.exports = router;
