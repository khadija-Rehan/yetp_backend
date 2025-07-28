const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false, // Made optional for public applications
    },
    fullName: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    challanNumber: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
scholarshipSchema.index({ rollNumber: 1 });
scholarshipSchema.index({ cnic: 1 });
scholarshipSchema.index({ email: 1 });
scholarshipSchema.index({ status: 1 });

const Scholarship = mongoose.model("Scholarship", scholarshipSchema);

module.exports = Scholarship; 