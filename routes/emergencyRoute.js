const express = require("express");
const { initiateEmergency } = require("../controllers/emergencyController");
const router = express.Router();

router.post("/emergency/initiate", initiateEmergency);

module.exports = router;
