// routes/medicalRecordRoutes.js
const express = require("express");
const validateMedicalRecord = require("../middlewares/validateMedicalRecord");
const {
  createMedicalRecord,
  getMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
} = require("../controllers/medicalRecordController"); // Adjust the path as necessary

const router = express.Router();

// Create a new medical record
router.post("/", validateMedicalRecord, createMedicalRecord);

// Get all medical records for a user
router.get("/:userId", getMedicalRecords);

// Update a medical record
router.put("/:recordId", updateMedicalRecord);

// Delete a medical record
router.delete("/:recordId", deleteMedicalRecord);

module.exports = router;
