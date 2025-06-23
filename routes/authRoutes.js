const express = require('express');
const { signup, login, forgotPassword, resetPassword, verifyEmail } = require('../controllers/authController');
// const upload = require('../middleware/upload');
const { signupValidation, loginValidation, forgotPasswordValidation } = require('../middleware/validators');
const uploadFields = require("../middleware/upload")

const router = express.Router();

// const uploadFields = upload.fields([
//   { name: 'cnicFront', maxCount: 1 },
//   { name: 'cnicBack', maxCount: 1 }
// ]);

router.post('/signup', uploadFields, signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.get('/verify-email', verifyEmail);

module.exports = router; 