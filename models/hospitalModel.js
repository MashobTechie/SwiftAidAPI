const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    address: {
      street: String,
      city: String,
      zip: String,
      lat: Number,
      lng: Number,
    },
    capacity: { type: Number, required: true },
    currentPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  });
  
  const Hospital = mongoose.model("Hospital", hospitalSchema);
  
  module.exports = Hospital;
  