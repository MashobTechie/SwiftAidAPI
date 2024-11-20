const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const responderSchema = new Schema(
  {
    // Organization Details
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    organizationEmail: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
      trim: true,
    },
    organizationContact: {
      type: String,
      required: true,
      unique: true,
    },

    // Location Information
    location: {
      address: {
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

    // Responder-Specific Fields
    responderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "onDuty", "inactive", "on-call"],
      default: "available",
    },

    // Emergency Handling
    currentEmergency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emergency",
      default: null,
    },
    assignedEmergencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Emergency",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Responder", responderSchema);
