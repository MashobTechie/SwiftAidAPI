const mongoose = require("mongoose");
const User = require("../models/usermodel"); // Adjust the path as necessary

const medicalRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  sex: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  previousSurgeries: [
    {
      surgeryName: { type: String, required: true },
      reasonForSurgery: { type: String, required: true },
      date: { type: Date, required: true },
    },
  ],
  allergies: {
    type: [String],
  },
  medications: {
    type: [String],
  },
  chronicConditions: {
    type: [String],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);

module.exports = MedicalRecord;
