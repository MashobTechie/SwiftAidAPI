const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hospitalSchema = new Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
    },

    // Location Details
    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      zip: {
        type: String,
        required: true,
        trim: true,
      },
      lat: {
        type: Number,
        required: false,
      },
      lng: {
        type: Number,
        required: false,
      },
    },

    // Capacity and Patients
    capacity: {
      type: Number,
      required: true,
      min: [0, "Capacity cannot be negative"],
    },
    availableBeds: {
      type: Number,
      required: true,
      min: [0, "Available beds cannot be negative"],
      validate: {
        validator: function (value) {
          return value <= this.capacity;
        },
        message: "Available beds cannot exceed total capacity",
      },
    },
    currentPatients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Emergency Handling
    emergencyContacts: [
      {
        name: {
          type: String,
          required: true,
        },
        contactNumber: {
          type: String,
          required: true,
        },
        relationship: {
          type: String,
          required: true,
        },
      },
    ],
    activeEmergencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Emergency",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hospital", hospitalSchema);
