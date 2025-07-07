const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array() 
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
    .withMessage("Full name must be between 2 and 100 characters"),

  body("cnic")
    .notEmpty()
    .withMessage("CNIC is required")
    .matches(/^[0-9]{13}$/)
    .withMessage("CNIC must be 13 digits"),

  body("rollNumber")
    .notEmpty()
    .withMessage("Roll number is required")
    .matches(/^HM-\d{4}-\d{4}$/)
    .withMessage("Roll number must be in format HM-YYYY-XXXX"),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("mobileNumber")
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^[0-9]{11}$/)
    .withMessage("Mobile number must be 11 digits"),

  body("challanNumber")
    .notEmpty()
    .withMessage("Challan number is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Challan number must be between 1 and 50 characters"),

  validate,
];

// Update status validation rules
const updateStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage("Status must be pending, approved, or rejected"),

  validate,
];

module.exports = {
  scholarshipValidation,
  updateStatusValidation,
}; 