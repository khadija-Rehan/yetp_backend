const { body, validationResult } = require("express-validator");

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Signup validation rules
const signupValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters long"),

  body("fatherName")
    .notEmpty()
    .withMessage("Father name is required")
    .isLength({ min: 2 })
    .withMessage("Father name must be at least 2 characters long"),

  body("cnic")
    .notEmpty()
    .withMessage("CNIC is required")
    .matches(/^[0-9]{13}$/)
    .withMessage("CNIC must be 13 digits"),

  body("mobile")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9]{11}$/)
    .withMessage("Phone number must be 11 digits"),

  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("Date must be in YYYY-MM-DD format"),

  body("maritalStatus")
    .notEmpty()
    .withMessage("Marital status is required")
    .isIn(["single", "married"])
    .withMessage("Invalid marital status"),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female"])
    .withMessage("Invalid gender"),

  body("qualification").notEmpty().withMessage("Qualification is required"),

  body("institute").notEmpty().withMessage("Institute name is required"),

  body("yearOfCompletion")
    .notEmpty()
    .withMessage("Year of completion is required")
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Invalid year of completion"),

  body("courses")
    .customSanitizer((value) => {
      try {
        return typeof value === "string" ? JSON.parse(value) : value;
      } catch {
        return [];
      }
    })
    .isArray({ min: 1 })
    .withMessage("Courses must be a non-empty array")
    .custom((arr) =>
      arr.every((item) => typeof item === "string" && item.trim() !== "")
    )
    .withMessage("Each course must be a non-empty string"),

  body("internetAccess")
    .notEmpty()
    .withMessage("Permanent address is required"),

  body("currentAddress").notEmpty().withMessage("Current address is required"),

  body("city").notEmpty().withMessage("City is required"),

  body("employmentStatus")
    .isBoolean()
    .withMessage("Employed must be a boolean value"),

  // Add file validation
  body("lastDegree").custom((value, { req }) => {
    if (!req.files || !req.files["degreeDocument"]) {
      throw new Error("Last degree document is required");
    }
    return true;
  }),

  body("document").custom((value, { req }) => {
    if (!req.files || !req.files["residencyDocument"]) {
      throw new Error("Document is required");
    }
    return true;
  }),

  validate,
];

// Login validation rules
const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  validate,
];

// Forgot password validation rules
const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  validate,
];

module.exports = {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
};
