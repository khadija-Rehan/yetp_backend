const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    cnicBack: {
      type: String, // URL to the uploaded file
      default: null,
    },
    courses: {
      type: [String],
      default: [],
    },
    physicalCourses: {
      type: [String],
      default: [],
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    cnicFront: {
      type: String, // URL to the uploaded file
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    verifyToken: {
      type: String,
      default: "",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    testScore: {
      type: Number,
      default: null,
    },
    testPassed: {
      type: Boolean,
      default: false,
    },
    referralCode: {
      type: String,
      allowNull: true,
    },
    photo: {
      type: String,
      default: null,
    },
    admissionType: {
      type: [String],
      enum: ["online", "physical"],
      default: ["online"],
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique roll number
userSchema.statics.generateRollNumber = async function () {
  const year = new Date().getFullYear();
  let attempts = 0;
  const maxAttempts = 50;

  const yearRegex = new RegExp(`^HM-${year}-\\d{3}-\\d{3}$`);
  const count = await this.countDocuments({ rollNumber: { $regex: yearRegex } });

  while (attempts < maxAttempts) {
    const sequential = String(count + attempts + 1).padStart(3, '0');
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const rollNumber = `HM-${year}-${sequential}-${randomNum}`;

    const existingUser = await this.findOne({ rollNumber });

    if (!existingUser) {
      return rollNumber;
    }
    attempts++;
  }

  throw new Error("Could not generate a unique roll number after multiple attempts. Please try again.");
};

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
