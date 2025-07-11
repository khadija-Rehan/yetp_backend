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
      required: true,
    },
    courses: {
      type: [String],
      required: true,
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
      required: true,
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
  },
  {
    timestamps: true,
  }
);

// Generate unique roll number
userSchema.statics.generateRollNumber = async function () {
  let rollNumber;
  let isUnique = false;

  while (!isUnique) {
    // Generate roll number with format: HM-YYYY-XXXX (HM for Hunarmand, YYYY for year, XXXX for sequential number)
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9000) + 1000; // 4-digit random number
    rollNumber = `HM-${year}-${randomNum}`;

    // Check if this roll number already exists
    const existingUser = await this.findOne({ rollNumber });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return rollNumber;
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
