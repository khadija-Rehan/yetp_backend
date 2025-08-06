const { body, validationResult } = require("express-validator");

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Convert validation errors to a more user-friendly format
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({
      message: errorMessages.join(", "),
      errors: errors.array(), // Keep original format for debugging
    });
  }
  next();
};

// Scholarship application validation rules
const scholarshipValidation = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Full name should only contain letters and spaces"),

  body("cnic")
    .notEmpty()
    .withMessage("CNIC is required")
    .customSanitizer((value) => value.replace(/[^\d]/g, ""))
    .matches(/^[0-9]{13}$/)
    .withMessage("CNIC must be 13 digits"),

  body("rollNumber").notEmpty().withMessage("Roll number is required"),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .isLength({ max: 254 })
    .withMessage("Email address is too long")
    .normalizeEmail(),

  body("mobileNumber")
    .notEmpty()
    .withMessage("Mobile number is required")
    .customSanitizer((value) => value.replace(/[-\s]/g, ""))
    .matches(/^03\d{9}$/)
    .withMessage("Mobile number must start with 03 and be 11 digits"),

  body("challanNumber")
    .notEmpty()
    .withMessage("Challan number is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Challan number must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9\-\s]+$/)
    .withMessage(
      "Challan number should only contain letters, numbers, hyphens, and spaces"
    ),

  validate,
];

// Update status validation rules
const updateStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "approved", "rejected"])
    .withMessage("Status must be pending, approved, or rejected"),

  validate,
];

module.exports = {
  scholarshipValidation,
  updateStatusValidation,
};
