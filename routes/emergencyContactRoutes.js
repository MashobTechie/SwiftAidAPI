const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const emergencyContactController = require("../controllers/emergencyContactController");
console.log(emergencyContactController);
console.log(authMiddleware);

// Use your routes here

const router = express.Router();

// Ensure you are importing and using these functions correctly
router.get(
  "/contacts",
  authMiddleware.protectRoute,
  emergencyContactController.getEmergencyContacts
);
router.post(
  "/contacts",
  authMiddleware.protectRoute,
  emergencyContactController.addEmergencyContact
);
router.patch(
  "/contacts/:contactId",
  authMiddleware.protectRoute,
  emergencyContactController.updateEmergencyContact
);
router.delete(
  "/contacts/:contactId",
  authMiddleware.protectRoute,
  emergencyContactController.deleteEmergencyContact
);

module.exports = router;
