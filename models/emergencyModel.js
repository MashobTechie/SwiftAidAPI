const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["initiated", "ongoing", "completed"],
    default: "initiated",
    required: true,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  EmergencyCreatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Emergency = mongoose.model("Emergency", emergencySchema);

module.exports = Emergency;
