const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const MedicalRecord = require("./usermedicalrecord");
// Define the emergency contact schema
const emergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  relationship: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
});

// Define the User schema
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please provide your first name"],
    trim: true,
  },
  lastname: {
    type: String,
    required: [true, "Please provide your last name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minlength: [6, "Password should be a minimum of 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["victim", "responder", "hospital", "admin"],
    default: "victim",
  },
  phoneNumber: {
    type: String,
    required: "Please provide a contact number",
    unique: [true, "This contact number is already in use"],
  },
  address: {
    type: String,
    required: false,
  },
  profileImage: {
    type: String,
    default: "", // Placeholder for generated initials-based image URL or initials text
  },
  passwordChangedAt: {
    type: Date,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    select: false,
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  responderStatus: {
    type: String,
    enum: ["available", "busy", "offline"],
    required: function () {
      return this.role === "responder";
    },
  },
  responderLocation: {
    lat: {
      type: Number,
      required: function () {
        return this.role === "responder";
      },
    },
    lng: {
      type: Number,
      required: function () {
        return this.role === "responder";
      },
    },
  },
  hospitalName: {
    type: String,
    required: function () {
      return this.role === "hospital";
    },
  },
  hospitalAddress: {
    type: String,
    required: function () {
      return this.role === "hospital";
    },
  },
  hospitalCapacity: {
    type: Number,
    required: function () {
      return this.role === "hospital";
    },
  },
  emergencyContacts: [emergencyContactSchema], // Emergency contacts field
  medicalRecords: [
    { type: mongoose.Schema.Types.ObjectId, ref: "MedicalRecord" },
  ], // Reference to medical records
  emergencyReports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emergency",
    },
  ],
});

// Middleware to set profile image if not provided
userSchema.pre("save", function (next) {
  if (!this.profileImage || this.profileImage === "") {
    const initials = `${this.firstname.charAt(0).toUpperCase()}${this.lastname
      .charAt(0)
      .toUpperCase()}`;

    const svgImage = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
          <rect width="100%" height="100%" fill="#C62828"/>
          <text x="50%" y="50%" font-size="40" dy=".3em" fill="#F5F5F5" text-anchor="middle">${initials}</text>
        </svg>
      `;

    const base64Image = Buffer.from(svgImage).toString("base64");
    this.profileImage = `data:image/svg+xml;base64,${base64Image}`;
  }
  next();
});

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  console.log("Hashing password..."); // Debugging line
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Middleware to update passwordChangedAt field
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 2000;
  next();
});

// Method to check if entered password matches the stored password
userSchema.methods.confirmPassword = async function (enteredPassword) {
  console.log("Entered Password:", enteredPassword); // Debugging line
  console.log("Stored Password:", this.password); // Debugging line
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if password was changed after token was issued
userSchema.methods.passwordChangedAfterTokenIssued = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;