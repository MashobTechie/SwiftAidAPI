const express = require('express');
const Responder = require('../models/responderModel'); // Adjust path
const router = express.Router();

const authorizeResponder = (req, res, next) => {
  if (req.user.role !== 'responder') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  next();
};
// Apply middleware to responder routes
router.use(authorizeResponder);

// Create a new responder
router.post('/responders', async (req, res) => {
  try {
    const responder = await Responder.create(req.body);
    res.status(201).json({ success: true, data: responder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all responders
router.get('/responders', async (req, res) => {
  try {
    const responders = await Responder.find();
    res.status(200).json({ success: true, data: responders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update responder status
router.patch('/responders/:id', async (req, res) => {
  try {
    const responder = await Responder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!responder) {
      return res.status(404).json({ success: false, message: 'Responder not found' });
    }
    res.status(200).json({ success: true, data: responder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/dashboard', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to the responder dashboard!' });
});

module.exports = router;
