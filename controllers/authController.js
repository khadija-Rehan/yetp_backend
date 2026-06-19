const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");
const Challan = require("../models/Challan");
const getEmailVerificationHtml = require("../emailTemplates/getEmailVerificationHtml");
const getUserLoginEmailHtml = require("../emailTemplates/getUserLoginEmailHtml");
const getEmailVerifiedHtml = require("../emailTemplates/getEmailVerifiedHtml");
const getForgotPasswordEmailHtml = require("../emailTemplates/getForgotPasswordEmailHtml");
const getPasswordChangedEmailHtml = require("../emailTemplates/getPasswordChangedEmailHtml");
const config = require("../config/config");

// Signup function
exports.signup = async (req, res) => {
  try {
    console.log("Signup request body:", req.body);

    const {
      email,
      password,
      fullName,
      fatherName,
      cnic,
      mobile,
      dateOfBirth,
      gender,
      qualification,
      permanentAddress,
      city,
      firstCourse,
      secondCourse,
      referralCode,
      form = "signup", // Form type: "signup" or "admission"
    } = req.body;

    // Determine admission type based on form
    const admissionType = form === "admission" ? "physical" : "online";

    // Check if user already exists
    let existingUser = await User.findOne({ email });

    // Get file URLs from uploaded files
    const cnicFront = req.files["cnicFront"]
      ? `/uploads/${req.files["cnicFront"][0].filename}`
      : null;
    const cnicBack = req.files["cnicBack"]
      ? `/uploads/${req.files["cnicBack"][0].filename}`
      : null;
    const photo = req.files["photo"]
      ? `/uploads/${req.files["photo"][0].filename}`
      : null;

    console.log("cnicFront", cnicFront);
    // For "physical" admission, cnic is required (along with cnicFront and cnicBack files)
    if (admissionType === "online") {
      if (!cnicFront || !cnicBack) {
        return res
          .status(400)
          .json({ message: "Both cnicFront and cnicBack files are required" });
      }
    }

    // For "online" admission, photo is required; CNIC is not required at this point
    if (admissionType === "physical" && !photo) {
      return res.status(400).json({ message: "Photo file is required" });
    }

    // If user exists, update their admission type array and password
    if (existingUser) {
      if (existingUser.admissionType.length === 2) {
        return res
          .status(400)
          .json({ message: "User already registered in both admission!" });
      }

      console.log("admissionType", admissionType);
      console.log("existingUser.admissionType", existingUser.admissionType);

      // Check if admission type is not already in the array
      if (!existingUser.admissionType.includes(admissionType)) {
        existingUser.admissionType.push(admissionType);
      }

      // Update courses based on form type and existing admission types
      if (form === "signup" && admissionType === "online") {
        // User is adding online courses
        existingUser.courses = [firstCourse, secondCourse].filter(Boolean);
        existingUser.cnicBack = cnicBack || null;
        existingUser.cnicFront = cnicFront || null;
        if (photo) existingUser.photo = photo;
      } else if (form === "admission" && admissionType === "physical") {
        // User is adding physical courses
        existingUser.physicalCourses = [firstCourse, secondCourse].filter(Boolean);
        existingUser.photo = photo || null;
      }

      existingUser.password = password;
      existingUser.markModified("password");

      await existingUser.save();

      return res.status(200).json({
        message: "User updated successfully",
        user: {
          rollNumber: existingUser.rollNumber,
          email: existingUser.email,
          fullName: existingUser.fullName,
          admissionType: existingUser.admissionType,

          isNewUser: false,
        },
      });
    }

    // Check for existing CNIC or mobile if user doesn't exist
    const existingCnic = await User.findOne({ cnic });
    if (existingCnic) {
      return res.status(400).json({ message: "CNIC already registered" });
    }

    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res
        .status(400)
        .json({ message: "Mobile number already registered" });
    }

    // Validate required fields
    if (!firstCourse) {
      return res.status(400).json({
        message: "firstCourse is required",
      });
    }

    // Generate unique roll number
    const rollNumber = await User.generateRollNumber(true);

    // Make courses arrays based on form type
    const courses =
      form === "admission" ? undefined : [firstCourse, secondCourse].filter(Boolean);
    const physicalCourses =
      form === "admission" ? [firstCourse, secondCourse].filter(Boolean) : undefined;

    // Create new user with all fields
    const user = new User({
      rollNumber,
      email,
      password, // Password will be hashed by the pre-save middleware
      fullName,
      fatherName,
      cnic,
      mobile,
      dateOfBirth,
      gender,
      qualification,
      cnicFront: cnicFront || null,
      courses: courses || [],
      physicalCourses: physicalCourses || [],
      permanentAddress,
      city,
      cnicBack: cnicBack || null,
      referralCode,
      photo: photo || null,
      admissionType: [admissionType], // Set based on form type
    });

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.verifyToken = verifyToken;
    user.isVerified = true;

    await user.save();

    // Send verification email
    // const verifyUrl = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/auth/verify-email?token=${verifyToken}`;
    // const html = getEmailVerificationHtml({
    //   userName: user.fullName,
    //   verifyLink: verifyUrl,
    // });

    // const emailResult = await sendEmail({
    //   email: user.email,
    //   subject: "Email Verification",
    //   html: html,
    //   emailType: 'verification',
    // });

    // console.log(verifyUrl);

    // if (!emailResult.success) {
    //   // User created but email failed - still return success but with warning
    //   return res.status(201).json({
    //     message: "User created successfully, but verification email could not be sent. Please contact support.",
    //     emailSent: false,
    //     emailError: emailResult.error,
    //     user: {
    //       rollNumber: user.rollNumber,
    //       email: user.email,
    //       fullName: user.fullName,
    //       courses: user.courses,
    //       referralCode: user.referralCode,
    //     },
    //   });
    // }

    res.status(201).json({
      message: "User created successfully. You can login now.",
      emailSent: true,
      user: {
        rollNumber: user.rollNumber,
        email: user.email,
        fullName: user.fullName,
        courses: user.courses,
        referralCode: user.referralCode,
        admissionType: user.admissionType,
        isNewUser: true,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle different types of errors
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

// Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("req.body", req.body.email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message:
          "User email is not verified. Check you email for verification link",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Get challan data for this user
    let challanData = null;
    try {
      challanData = await Challan.find({ userId: user._id });
    } catch (err) {
      console.error("Error fetching challan data:", err);
      challanData = [];
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const html = getUserLoginEmailHtml({
      userName: user.fullName,
      loginTime: new Date().toLocaleString(),
      dashboardUrl: "https://yetp.pk/candidate-login",
    });

    // Remove login email - as per requirements, don't send email on login
    // const emailResult = await sendEmail({
    //   email: user.email,
    //   subject: "Welcome back to Hunarmand!",
    //   html: html,
    //   emailType: 'contact',
    // });

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        rollNumber: user.rollNumber,
        email: user.email,
        fullName: user.fullName,
        testPassed: user.testPassed,
      },
      challan: challanData,
    });
  } catch (error) {
    console.error("Login error:", error);

    // Handle different types of errors
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
        message: "Invalid data format provided",
      });
    }

    res.status(500).json({
      message: "Server error occurred. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "There is no user with that email" });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `https://yetp.pk/reset-password/${resetToken}`;

    // No SMTP configured yet (dev mode) — skip sending and return the link
    // directly so the reset flow is still testable end-to-end.
    if (!config.smtp.host) {
      return res.status(200).json({
        message: "Email not sent (dev mode — SMTP not configured). Use this link:",
        resetUrl,
      });
    }

    const html = getForgotPasswordEmailHtml({
      userName: user.fullName,
      resetUrl: resetUrl,
    });

    const emailResult = await sendEmail({
      email: user.email,
      subject: "Password Reset Request - YETP",
      html: html,
      emailType: "contact",
    });

    if (!emailResult.success) {
      // Clean up the reset token since email failed
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(200).json({
        message: "Password reset email could not be sent. Use this link:",
        resetUrl,
        emailError: emailResult.error,
      });
    }

    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send password change confirmation email (skip if SMTP isn't configured)
    if (!config.smtp.host) {
      return res.status(200).json({
        message: "Password reset successful",
        emailSent: false,
      });
    }

    const html = getPasswordChangedEmailHtml({
      userName: user.fullName,
      changeTime: new Date().toLocaleString(),
    });

    const emailResult = await sendEmail({
      email: user.email,
      subject: "Password Changed Successfully - YETP",
      html: html,
      emailType: "contact",
    });

    res.status(200).json({
      message: "Password reset successful",
      emailSent: emailResult.success,
      emailError: emailResult.success ? null : emailResult.error,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Email verification function
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }
    const user = await User.findOne({ verifyToken: token });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }
    user.isVerified = true;
    user.verifyToken = "";
    await user.save();

    // Confirmation email is intentionally not sent (SMTP not configured yet).
    // Verification itself still succeeds below regardless of email status.

    return res.redirect("https://yetp.pk/candidate-login");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
