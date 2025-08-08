const Scholarship = require("../models/Scholarship");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const getScholarshipSubmissionEmailHtml = require("../emailTemplates/getScholarshipSubmissionEmailHtml");
const Challan = require("../models/Challan");

// Add scholarship application
exports.applyForScholarship = async (req, res) => {
  try {
    const { fullName, cnic, rollNumber, email, mobileNumber, challanNumber } =
      req.body;



    // If challanNumber includes "267200309", remove it
    let processedChallanNumber = challanNumber;
    if (typeof challanNumber === "string" && challanNumber.includes("267200309")) {
      processedChallanNumber = challanNumber.replace("267200309", "");
    }



      
    // For public scholarship application, we don't require user authentication
    // const userId = req.user._id;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Get image path from uploaded file
    const imagePath = `/uploads/${req.file.filename}`;

    // Check if user exists with the provided roll number
    const user = await User.findOne({ cnic });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this CNIC not found" });
    }

    if (user.email !== email) {
      return res
        .status(400)
        .json({ message: "Email does not match with registered user" });
    }

    const userChallan = await Challan.findOne({ challanId: processedChallanNumber });

    if (!userChallan) {
      return res.status(400).json({ message: "Challan not found against this user" });
    }

    // if (userChallan.challanId !== challanNumber) {
    //   return res
    //     .status(400)
    //     .json({
    //       message: "Challan number does not match with registered user",
    //     });
    // }

    const existingApplication = await Scholarship.findOne({ cnic });
    if (existingApplication) {
      return res
        .status(400)
        .json({
          message: "Scholarship application already exists for this CNIC",
        });
    }

    // Check if scholarship application already exists for this roll number
    // const existingRollNumberApplication = await Scholarship.findOne({
    //   rollNumber,
    // });
    // if (existingRollNumberApplication) {
    //   return res
    //     .status(400)
    //     .json({
    //       message:
    //         "Scholarship application already exists for this roll number",
    //     });
    // }

    // Create new scholarship application
    const scholarship = new Scholarship({
      // userId, // Not required for public applications
      fullName,
      cnic,
      rollNumber,
      email,
      mobileNumber,
      challanNumber: processedChallanNumber,
      imagePath,
    });

    await scholarship.save();

    // Send scholarship submission confirmation email
    const scholarshipHtml = getScholarshipSubmissionEmailHtml({
      userName: user.fullName,
      rollNumber: user.rollNumber,
      scholarshipId: scholarship._id,
      submissionTime: new Date().toLocaleString(),
    });

    // const emailResult = await sendEmail({
    //   email: user.email,
    //   subject: "Scholarship Application Submitted Successfully!",
    //   html: scholarshipHtml,
    //   emailType: 'contact',
    // });

    res.status(201).json({
      message: "Scholarship application submitted successfully",
      // emailSent: emailResult.success,
      // emailError: emailResult.success ? null : emailResult.error,
      scholarship: {
        id: scholarship._id,
        fullName: scholarship.fullName,
        rollNumber: scholarship.rollNumber,
        email: scholarship.email,
        status: scholarship.status,
        appliedAt: scholarship.appliedAt,
      },
    });
  } catch (error) {
    console.error("Scholarship application error:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: validationErrors.join(", "),
        errors: validationErrors,
      });
    }

    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      return res.status(400).json({
        message: `${fieldName} already exists`,
        field: field,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid data format provided",
      });
    }

    res.status(500).json({
      message: "Server error occurred. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all scholarship applications (admin only)
exports.getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find()
      .select("-__v")
      .sort({ appliedAt: -1 });

    res.status(200).json({
      message: "Scholarship applications retrieved successfully",
      scholarships,
    });
  } catch (error) {
    console.error("Get scholarships error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid data format provided",
      });
    }

    res.status(500).json({
      message: "Server error occurred. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get scholarship application by ID
exports.getScholarshipById = async (req, res) => {
  try {
    const { id } = req.params;

    const scholarship = await Scholarship.findById(id);
    if (!scholarship) {
      return res
        .status(404)
        .json({ message: "Scholarship application not found" });
    }

    res.status(200).json({
      message: "Scholarship application retrieved successfully",
      scholarship,
    });
  } catch (error) {
    console.error("Get scholarship by ID error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid scholarship ID format",
      });
    }

    res.status(500).json({
      message: "Server error occurred. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get scholarship application by roll number
exports.getScholarshipByRollNumber = async (req, res) => {
  try {
    const { rollNumber } = req.params;

    const scholarship = await Scholarship.findOne({ rollNumber });
    if (!scholarship) {
      return res
        .status(404)
        .json({
          message: "Scholarship application not found for this roll number",
        });
    }

    res.status(200).json({
      message: "Scholarship application retrieved successfully",
      scholarship,
    });
  } catch (error) {
    console.error("Get scholarship by roll number error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid roll number format",
      });
    }

    res.status(500).json({
      message: "Server error occurred. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update scholarship status (admin only)
exports.updateScholarshipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({
          message: "Invalid status. Must be pending, approved, or rejected",
        });
    }

    const scholarship = await Scholarship.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!scholarship) {
      return res
        .status(404)
        .json({ message: "Scholarship application not found" });
    }

    res.status(200).json({
      message: "Scholarship status updated successfully",
      scholarship,
    });
  } catch (error) {
    console.error("Update scholarship status error:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: validationErrors.join(", "),
        errors: validationErrors,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid scholarship ID format",
      });
    }

    res.status(500).json({
      message: "Server error occurred. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete scholarship application (admin only)
exports.deleteScholarship = async (req, res) => {
  try {
    const { id } = req.params;

    const scholarship = await Scholarship.findByIdAndDelete(id);
    if (!scholarship) {
      return res
        .status(404)
        .json({ message: "Scholarship application not found" });
    }

    res.status(200).json({
      message: "Scholarship application deleted successfully",
    });
  } catch (error) {
    console.error("Delete scholarship error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid scholarship ID format",
      });
    }

    res.status(500).json({
      message: "Server error occurred. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
