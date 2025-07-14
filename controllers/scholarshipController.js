const Scholarship = require("../models/Scholarship");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const getScholarshipSubmissionEmailHtml = require("../emailTemplates/getScholarshipSubmissionEmailHtml");

// Add scholarship application
exports.applyForScholarship = async (req, res) => {
  try {
    const {
      fullName,
      cnic,
      rollNumber,
      email,
      mobileNumber,
      challanNumber,
    } = req.body;

    const userId = req.user._id;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Get image path from uploaded file
    const imagePath = `/uploads/${req.file.filename}`;

    // Check if user exists with the provided roll number
    const user = await User.findOne({ rollNumber });
    if (!user) {
      return res.status(400).json({ message: "User with this roll number not found" });
    }

    // Verify that the provided data matches the user's data
    if (user.email !== email || user.cnic !== cnic || user.fullName !== fullName) {
      return res.status(400).json({ message: "User data does not match with registered user" });
    }

    // Check if scholarship application already exists for this CNIC
    const existingApplication = await Scholarship.findOne({ cnic });
    if (existingApplication) {
      return res.status(400).json({ message: "Scholarship application already exists for this CNIC" });
    }

    // Check if scholarship application already exists for this roll number
    const existingRollNumberApplication = await Scholarship.findOne({ rollNumber });
    if (existingRollNumberApplication) {
      return res.status(400).json({ message: "Scholarship application already exists for this roll number" });
    }

    // Create new scholarship application
    const scholarship = new Scholarship({
      userId,
      fullName,
      cnic,
      rollNumber,
      email,
      mobileNumber,
      challanNumber,
      imagePath,
    });

    await scholarship.save();

    // Send scholarship submission confirmation email
    try {
      const scholarshipHtml = getScholarshipSubmissionEmailHtml({
        userName: user.fullName,
        rollNumber: user.rollNumber,
        scholarshipId: scholarship._id,
        submissionTime: new Date().toLocaleString(),
      });

      await sendEmail({
        email: user.email,
        subject: "Scholarship Application Submitted Successfully!",
        html: scholarshipHtml,
      });
    } catch (emailError) {
      console.error("Scholarship submission email error:", emailError);
      // Don't fail the application if email fails
    }

    res.status(201).json({
      message: "Scholarship application submitted successfully",
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
    res.status(500).json({ message: error.message });
  }
};

// Get all scholarship applications (admin only)
exports.getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find()
      .select('-__v')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      message: "Scholarship applications retrieved successfully",
      scholarships,
    });
  } catch (error) {
    console.error("Get scholarships error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get scholarship application by ID
exports.getScholarshipById = async (req, res) => {
  try {
    const { id } = req.params;

    const scholarship = await Scholarship.findById(id);
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship application not found" });
    }

    res.status(200).json({
      message: "Scholarship application retrieved successfully",
      scholarship,
    });
  } catch (error) {
    console.error("Get scholarship by ID error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get scholarship application by roll number
exports.getScholarshipByRollNumber = async (req, res) => {
  try {
    const { rollNumber } = req.params;

    const scholarship = await Scholarship.findOne({ rollNumber });
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship application not found for this roll number" });
    }

    res.status(200).json({
      message: "Scholarship application retrieved successfully",
      scholarship,
    });
  } catch (error) {
    console.error("Get scholarship by roll number error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update scholarship status (admin only)
exports.updateScholarshipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be pending, approved, or rejected" });
    }

    const scholarship = await Scholarship.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship application not found" });
    }

    res.status(200).json({
      message: "Scholarship status updated successfully",
      scholarship,
    });
  } catch (error) {
    console.error("Update scholarship status error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete scholarship application (admin only)
exports.deleteScholarship = async (req, res) => {
  try {
    const { id } = req.params;

    const scholarship = await Scholarship.findByIdAndDelete(id);
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship application not found" });
    }

    res.status(200).json({
      message: "Scholarship application deleted successfully",
    });
  } catch (error) {
    console.error("Delete scholarship error:", error);
    res.status(500).json({ message: error.message });
  }
}; 