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

// Signup function
exports.signup = async (req, res) => {
  try {
    // console.log('Files:', req.files);
    console.log("req.boydddd",req.body);

    const {
      email,
      password,
      fullName,
      fatherName,
      cnic,
      mobile,
      dateOfBirth,
      // maritalStatus,
      gender,
      qualification,
      // fieldOfStudy,
      // institute,
      // yearOfCompletion,
      // internetAccess,
      permanentAddress,
      city,
      // employmentStatus,
      firstCourse,
      secondCourse,
      referralCode,
    } = req.body;
    console.log("req.boydddd 1");

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }
    console.log("req.boydddd 2");

    const existingCnic = await User.findOne({ cnic });
    if (existingCnic) {
      return res.status(400).json({ message: "CNIC already registered" });
    }
    console.log("req.boydddd 3");

    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res
        .status(400)
        .json({ message: "Mobile number already registered" });
    }
    console.log("req.boydddd 4");

    // Validate required fields
    if (!firstCourse) {
      return res.status(400).json({
        message: "firstCourse are required fields",
      });
    }
    console.log("req.boydddd 5");

    // Get file URLs from uploaded files
    const cnicFront = req.files["cnicFront"]
      ? `/uploads/${req.files["cnicFront"][0].filename}`
      : null;
    const cnicBack = req.files["cnicBack"]
      ? `/uploads/${req.files["cnicBack"][0].filename}`
      : null;
      console.log("req.boydddd 16");

    if (!cnicFront || !cnicBack) {
      return res
        .status(400)
        .json({ message: "Both cnicFront and cnicBack files are required" });
    }

    console.log("req.boydddd 190");
    // Generate unique roll number
    const rollNumber = await User.generateRollNumber();
    
    // Make courses array of string
    const courses = [firstCourse, secondCourse];
    
    console.log("req.boydddd 191");
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
      // maritalStatus,
      gender,
      qualification,
      // institute,
      // yearOfCompletion,
      // fieldOfStudy,
      cnicFront,
      courses,
      // internetAccess,
      permanentAddress,
      city,
      // employmentStatus,
      cnicBack,
      referralCode,
    });

    console.log("req.boydddd 192");
    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.verifyToken = verifyToken;
    user.isVerified = true;

    console.log("req.boydddd 193");
    await user.save();
    console.log("req.boydddd 194");

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
      message:
        "User created successfully. You can login now.",
      emailSent: true,
      user: {
        rollNumber: user.rollNumber,
        email: user.email,
        fullName: user.fullName,
        courses: user.courses,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle different types of errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: validationErrors.join(', '),
        errors: validationErrors
      });
    }
    
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      return res.status(400).json({ 
        message: `${fieldName} already exists`,
        field: field
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid data format provided'
      });
    }
    
    res.status(500).json({ 
      message: 'Server error occurred. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

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
      dashboardUrl: "https://hunarmandpunjab.pk/login",
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
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: validationErrors.join(', '),
        errors: validationErrors
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid data format provided'
      });
    }
    
    res.status(500).json({ 
      message: 'Server error occurred. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
    // const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const resetUrl = `https://hunarmandpunjab.pk/reset-password/${resetToken}`;

    const html = getForgotPasswordEmailHtml({
      userName: user.fullName,
      resetUrl: resetUrl,
    });

    const emailResult = await sendEmail({
      email: user.email,
      subject: "Password Reset Request - Hunarmand Punjab",
      html: html,
      emailType: 'contact',
    });

    if (!emailResult.success) {
      // Clean up the reset token since email failed
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ 
        message: "Password reset email could not be sent. Please try again later.",
        emailError: emailResult.error
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

    // Send password change confirmation email
    const html = getPasswordChangedEmailHtml({
      userName: user.fullName,
      changeTime: new Date().toLocaleString(),
    });

    const emailResult = await sendEmail({
      email: user.email,
      subject: "Password Changed Successfully - Hunarmand Punjab",
      html: html,
      emailType: 'contact',
    });

    res.status(200).json({ 
      message: "Password reset successful",
      emailSent: emailResult.success,
      emailError: emailResult.success ? null : emailResult.error
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
    const verificationHtml = getEmailVerifiedHtml({
      userName: user.fullName,
      rollNumber: user.rollNumber,
    });
    // const emailResult = await sendEmail({
    //   email: user.email,
    //   subject: "Email Verified Successfully!",
    //   html: verificationHtml,
    //   emailType: 'verification',
    // });
    
    // Even if email fails, the verification is successful, so redirect
    // but we could log the email failure for monitoring
    if (!emailResult.success) {
      console.error('Email verification confirmation failed:', emailResult.error);
    }
    
    return res.redirect("https://hunarmandpunjab.pk/login");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
