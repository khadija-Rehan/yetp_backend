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
    secondRollNumber: {
      type: String,
      unique: true,
      sparse: true,
      required: false,
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
    secondEnrolledCourses: {
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

// Generate unique roll number — sequential from 10001 (like challan IDs)
userSchema.statics.generateRollNumber = async function (isSecondEnroll = false) {
  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    // Find last user sorted by creation time
    const lastUser = await this.findOne({}).sort({ createdAt: -1 }).select("rollNumber");
    let nextNum = 10001;

    if (lastUser?.rollNumber) {
      const match = lastUser.rollNumber.match(/(\d+)$/);
      if (match) {
        const parsed = parseInt(match[1], 10);
        if (!isNaN(parsed) && parsed >= 10001) nextNum = parsed + 1;
      }
    }

    let rollNumber = "YETP";
    if (isSecondEnroll) rollNumber += "-B2";
    rollNumber += `-${nextNum}`;

    const existing = await this.findOne({ rollNumber });
    if (!existing) return rollNumber;

    attempts++;
  }

  throw new Error("Could not generate a unique roll number. Please try again.");
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
