const express = require("express");
const emergencyController = require("../controllers/emergencyController");
const router = express.Router();

router.post("/emergency/initiate", emergencyController.initiateEmergency);
router.get('/emergency/initiated', emergencyController.getInitiatedEmergencies);
router.post('/emergency/accept', emergencyController.acceptEmergency);
router.post('/emergency/notify-hospital', emergencyController.notifyHospital);




module.exports = router;
