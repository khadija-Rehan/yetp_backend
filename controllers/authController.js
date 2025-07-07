const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");

// Signup function
exports.signup = async (req, res) => {
  try {
    // console.log('Files:', req.files);
    console.log(req.body);

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
      courses,
      // internetAccess,
      permanentAddress,
      city,
      // employmentStatus,
    } = req.body;

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

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

    // Get file URLs from uploaded files
    const cnicFront = req.files["cnicFront"]
      ? `/uploads/${req.files["cnicFront"][0].filename}`
      : null;
    const cnicBack = req.files["cnicBack"]
      ? `/uploads/${req.files["cnicBack"][0].filename}`
      : null;

    if (!cnicFront || !cnicBack) {
      return res
        .status(400)
        .json({ message: "Both cnicFront and cnicBack files are required" });
    }

    // Generate unique roll number
    const rollNumber = await User.generateRollNumber();

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
    });

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.verifyToken = verifyToken;
    user.isVerified = false;

    await user.save();

    // Send verification email
    const verifyUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify-email?token=${verifyToken}`;
    const message = `Please verify your email by clicking the following link: ${verifyUrl}`;
    await sendEmail({
      email: user.email,
      subject: "Verify your email",
      message,
    });

    console.log(verifyUrl);

    res.status(201).json({
      message:
        "User created successfully. Please check your email to verify your account.",
      user: {
        rollNumber: user.rollNumber,
        email: user.email,
        fullName: user.fullName,
        // Don't send sensitive information
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        rollNumber: user.rollNumber,
        email: user.email,
        fullName: user.fullName,
        rollNumber: user.rollNumber,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
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
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
      });

      res.status(200).json({ message: "Email sent" });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: "Email could not be sent" });
    }
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

    res.status(200).json({ message: "Password reset successful" });
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

    return res.redirect("https://hunarmandpunjab.pk/login");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
