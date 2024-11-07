



const getInitiatedEmergencies = async (req, res) => {
    try {
      const emergencies = await Emergency.find({ status: 'initiated' }).populate('victim');
  
      res.status(200).json({
        message: "Initiated emergencies fetched successfully",
        emergencies
      });
    } catch (error) {
      console.error("Error fetching initiated emergencies:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const updateEmergencyStatus = async (req, res) => {
    try {
      const { emergencyId } = req.body;
  
      const emergency = await Emergency.findById(emergencyId);
      if (!emergency || emergency.status !== 'initiated') {
        return res.status(404).json({ message: "Emergency not found or already being handled" });
      }
  
      emergency.status = 'active';
      await emergency.save();
  
      // Here we could add a function to notify the hospital once the status is updated.
      await notifyHospital(emergency);
  
      res.status(200).json({ message: "Emergency status updated to active and hospital notified", emergency });
    } catch (error) {
      console.error("Error updating emergency status:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  