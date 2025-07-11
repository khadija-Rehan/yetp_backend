const User = require("../models/User");
const generatePDF = require("../utils/generatePDF");
const sendEmail = require("../utils/sendEmail");
const fs = require("fs");
const Challan = require("../models/Challan");
const Scholarship = require("../models/Scholarship");
const getTestPassedEmailHtml = require("../emailTemplates/getTestPassedEmailHtml");

exports.generateAndSendPDF = async (req, res) => {
  try {
    const { userCourses } = req.body;
    const user = req.user;

    const amount = 2800;
    
    const { filePath, fileName, challanNumber } = await generatePDF(
      user,
      amount,
      userCourses
    );

    // Save challan details to database
    const challan = new Challan({
      userId: user._id,
      challanId: challanNumber,
      amount: amount,
      path: filePath,
    });
    await challan.save();

    // Send email with PDF
    await sendEmail({
      email: user.email,
      subject: "Your Challan is Ready",
      message:
        "Please pay the challan amount to the following Challan number: challanNumber",
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
      data: { fileName }, // Only send this
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

      await sendEmail({
        email: updatedUser.email,
        subject:
          "Congratulations! You Have Passed the Admission Test – Now You Are Eligible For Hunarmand Punjab Scholarship Card",
        message: testPassedHtml,
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
        permanentAddress: userData.permanentAddress,
        city: userData.city,
        isVerified: userData.isVerified,
        referralCode: userData.referralCode,
        testScore: userData.testScore,
        testPassed: userData.testPassed,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
      challans: {
        total: challans.length,
        totalAmount: totalChallanAmount,
        paidAmount: totalPaidAmount,
        unpaidAmount: totalUnpaidAmount,
        challans: challans.map((challan) => ({
          challanId: challan.challanId,
          amount: challan.amount,
          paid: challan.paid,
          branchCode: challan.branchCode,
          txnId: challan.txnId,
          txnDate: challan.txnDate,
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
