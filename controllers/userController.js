const User = require("../models/User");
const generatePDF = require("../utils/generatePDF");
const sendEmail = require("../utils/sendEmail");
const fs = require("fs");
const Challan = require("../models/Challan");
const Scholarship = require("../models/Scholarship");
const getTestPassedEmailHtml = require("../emailTemplates/getTestPassedEmailHtml");
const getChallanEmailHtml = require("../emailTemplates/getChallanEmailHtml");

exports.generateAndSendPDF = async (req, res) => {
  try {
    const isSecondEnroll = req.params.isSecondEnroll || false;

    console.log("isSecondEnroll", typeof isSecondEnroll, isSecondEnroll);
    const user = req.user;

    // Validate user object
    if (!user || !user._id) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user data",
      });
    }

    const amount = 3250;

    console.log(
      "user courses",
      user.courses,
      "second enrolled courses",
      user.secondEnrolledCourses
    );

    const userCourses =
      isSecondEnroll === "true" ? user.secondEnrolledCourses : user.courses;

    console.log("userCourses", userCourses);

    // Generate sequential challan ID first (same logic as generatePDF)
    // Only consider sequential IDs (5-7 digits), ignore old timestamp-based IDs
    const lastChallan = await Challan.findOne({ challanId: { $regex: /^\d{5,7}$/ } }).sort({ challanId: -1 }).select("challanId");
    let nextChallanNum = 10000;
    if (lastChallan?.challanId) {
      const parsed = parseInt(lastChallan.challanId, 10);
      if (!isNaN(parsed) && parsed >= 10000 && parsed < 10000000) nextChallanNum = parsed + 1;
    }
    const reservedChallanId = String(nextChallanNum);

    // PSID = "1000000" (7-digit prefix) + challanId padded to 8 digits = 15 digits (same as Digikhyber)
    const challanId8 = String(reservedChallanId).padStart(8, "0");
    const psid = "1000000" + challanId8;

    // Save challan to DB immediately so PSID is always available
    const challan = new Challan({
      userId: user._id,
      challanId: reservedChallanId,
      psid: psid,
      amount: amount,
      path: null,
      secondEnrollChallan: isSecondEnroll === "true" ? true : false,
    });
    await challan.save();

    // Now generate PDF (best-effort — PSID already saved above)
    let filePath = null, fileName = null, challanNumber = reservedChallanId;
    try {
      const pdfResult = await generatePDF(user, amount, userCourses);
      filePath = pdfResult.filePath;
      fileName = pdfResult.fileName;
      challanNumber = pdfResult.challanNumber;
      // Update path in DB
      challan.path = filePath;
      await challan.save();
    } catch (pdfErr) {
      console.error("PDF generation failed (challan ID already saved):", pdfErr.message);
    }

    // Send email with PDF attachment
    const html = getChallanEmailHtml({
      userName: user.fullName,
      challanNumber: challanNumber,
      amount: amount,
    });

    const emailSubject =
      isSecondEnroll === "true"
        ? "Your Second Enrollment Challan is Ready - Hunarmand Punjab"
        : "Your Challan is Ready - Hunarmand Punjab";

    const emailResult = await sendEmail({
      email: user.email,
      subject: emailSubject,
      html: html,
      emailType: "contact",
      attachments: [
        {
          filename: fileName,
          path: filePath,
        },
      ],
    });

    // Read the PDF file
    const pdfBuffer = fs.readFileSync(filePath);

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    console.log("pdfBuffer", pdfBuffer);

    return res.status(200).json({
      status: "success",
      message: "PDF generated successfully",
      emailSent: emailResult.success,
      emailError: emailResult.success ? null : emailResult.error,
      data: { fileName, challanNumber },
    });

    // return res.status(200).json({
    //   message: "Challan Created successfully",
    //   status: "success",
    //   data: { pdfBuffer },
    // });
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateTestScore = async (req, res) => {
  try {
    const { testScore, testPassed } = req.body;
    const user = req.user;

    // Validate input
    if (testScore === undefined || testPassed === undefined) {
      return res.status(400).json({
        status: "error",
        message: "testScore and testPassed are required fields",
      });
    }

    // Validate testScore is a number between 0 and 100
    if (typeof testScore !== "number" || testScore < 0 || testScore > 100) {
      return res.status(400).json({
        status: "error",
        message: "testScore must be a number between 0 and 100",
      });
    }

    // Validate testPassed is a boolean
    if (typeof testPassed !== "boolean") {
      return res.status(400).json({
        status: "error",
        message: "testPassed must be a boolean value",
      });
    }

    // Update user with test results
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        testScore,
        testPassed,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // If user passed the test, send an email
    if (updatedUser.testPassed === true) {
      const testPassedHtml = getTestPassedEmailHtml({
        userName: updatedUser.fullName,
        testScore: updatedUser.testScore,
        rollNumber: updatedUser.rollNumber,
      });

      const emailResult = await sendEmail({
        email: updatedUser.email,
        subject:
          "Congratulations! You Have Passed the Admission Test – Now You Are Eligible For Hunarmand Punjab Scholarship Card",
        html: testPassedHtml,
        emailType: "admissions",
      });

      return res.status(200).json({
        status: "success",
        message: "Test score updated successfully",
        emailSent: emailResult.success,
        emailError: emailResult.success ? null : emailResult.error,
        data: {
          testScore: updatedUser.testScore,
          testPassed: updatedUser.testPassed,
        },
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Test score updated successfully",
      data: {
        testScore: updatedUser.testScore,
        testPassed: updatedUser.testPassed,
      },
    });
  } catch (error) {
    console.error("Test score update error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const user = req.user;

    // Get user data
    const userData = await User.findById(user._id).select(
      "-password -verifyToken -resetPasswordToken -resetPasswordExpire"
    );

    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Get challans for the user
    const challans = await Challan.find({ userId: user._id.toString() }).sort({
      createdAt: -1,
    });

    // Get scholarship data for the user
    const scholarship = await Scholarship.findOne({
      $or: [
        { rollNumber: userData.rollNumber },
        { email: userData.email },
        { cnic: userData.cnic },
      ],
    });

    // Calculate total challan amount and paid amount
    const totalChallanAmount = challans.reduce(
      (sum, challan) => sum + challan.amount,
      0
    );
    const totalPaidAmount = challans
      .filter((challan) => challan.paid)
      .reduce((sum, challan) => sum + challan.amount, 0);
    const totalUnpaidAmount = totalChallanAmount - totalPaidAmount;

    // Prepare response data
    const responseData = {
      user: {
        rollNumber: userData.rollNumber,
        email: userData.email,
        fullName: userData.fullName,
        fatherName: userData.fatherName,
        cnic: userData.cnic,
        mobile: userData.mobile,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        qualification: userData.qualification,
        courses: userData.courses,
        secondEnrolledCourses: userData.secondEnrolledCourses,
        permanentAddress: userData.permanentAddress,
        city: userData.city,
        isVerified: userData.isVerified,
        referralCode: userData.referralCode,
        testScore: userData.testScore,
        testPassed: userData.testPassed,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        admissionType: userData.admissionType,
        physicalCourses: userData.physicalCourses,
      },
      challans: {
        total: challans.length,
        totalAmount: totalChallanAmount,
        paidAmount: totalPaidAmount,
        unpaidAmount: totalUnpaidAmount,
        challans: challans.map((challan) => ({
          challanId: challan.challanId,
          psid: challan.psid || null,
          amount: challan.amount,
          paid: challan.paid,
          branchCode: challan.branchCode,
          txnId: challan.txnId,
          txnDate: challan.txnDate,
          secondEnrollChallan: challan.secondEnrollChallan,
          createdAt: challan.createdAt,
          updatedAt: challan.updatedAt,
        })),
      },
      scholarship: scholarship
        ? {
            fullName: scholarship.fullName,
            cnic: scholarship.cnic,
            rollNumber: scholarship.rollNumber,
            email: scholarship.email,
            mobileNumber: scholarship.mobileNumber,
            challanNumber: scholarship.challanNumber,
            status: scholarship.status,
            appliedAt: scholarship.appliedAt,
            createdAt: scholarship.createdAt,
            updatedAt: scholarship.updatedAt,
          }
        : null,
    };

    return res.status(200).json({
      status: "success",
      message: "User data retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Get user data error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Admin function to generate PDF for any user by user ID
exports.adminGenerateAndSendPDF = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate user ID
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const amount = 3250;

    // Check if user already has a challan
    const existingChallan = await Challan.findOne({ userId: user._id });

    if (existingChallan) {
      // User already has a challan, return existing file URL
      const fileUrl = `/uploads/${existingChallan.path.split("/").pop()}`;

      return res.status(200).json({
        status: "success",
        message: "Existing challan found",
        data: {
          fileName: existingChallan.path.split("/").pop(),
          challanNumber: existingChallan.challanId,
          fileUrl: fileUrl,
          isExisting: true,
          createdAt: existingChallan.createdAt,
          userId: user._id,
          userEmail: user.email,
          userName: user.fullName,
        },
      });
    }

    // Generate new challan
    const { filePath, fileName, challanNumber } = await generatePDF(
      user,
      amount,
      user.courses
    );

    // Save challan details to database
    const challan = new Challan({
      userId: user._id,
      challanId: challanNumber,
      amount: amount,
      path: filePath,
    });
    await challan.save();

    const html = getChallanEmailHtml({
      userName: user.fullName,
      challanNumber: challanNumber,
      amount: amount,
    });

    const emailResult = await sendEmail({
      email: user.email,
      subject: "Your Challan is Ready - Hunarmand Punjab",
      html: html,
      emailType: "contact",
      attachments: [
        {
          filename: fileName,
          path: filePath,
        },
      ],
    });

    // Read the PDF file
    return res.status(200).json({
      status: "success",
      message: "Challan generated successfully",
      emailSent: emailResult.success,
      emailError: emailResult.success ? null : emailResult.error,
      data: {
        challanNumber: challanNumber,
        fileUrl: filePath,
      },
    });
  } catch (error) {
    console.error("Admin PDF generation error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update second enrolled courses
exports.updateSecondEnrolledCourses = async (req, res) => {
  try {
    const { courses } = req.body;
    const user = req.user;

    // Validate input
    if (!courses) {
      return res.status(400).json({
        status: "error",
        message: "Courses array is required",
      });
    }

    // Validate that courses is an array
    if (!Array.isArray(courses)) {
      return res.status(400).json({
        status: "error",
        message: "Courses must be an array",
      });
    }

    // Validate that all items in the array are strings
    if (
      !courses.every(
        (course) => typeof course === "string" && course.trim() !== ""
      )
    ) {
      return res.status(400).json({
        status: "error",
        message: "All courses must be non-empty strings",
      });
    }

    const rollNumber = await User.generateRollNumber(true);

    console.log("rollNumber", rollNumber);

    // Update user's secondEnrolledCourses
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        secondEnrolledCourses: courses,
        secondRollNumber: rollNumber,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Second enrolled courses updated successfully",
      data: {
        secondEnrolledCourses: updatedUser.secondEnrolledCourses,
        secondRollNumber: updatedUser.secondRollNumber,
      },
    });
  } catch (error) {
    console.error("Update second enrolled courses error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
