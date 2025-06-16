const express = require('express');
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController');
const upload = require('../middleware/upload');
const { signupValidation, loginValidation, forgotPasswordValidation } = require('../middleware/validators');

const router = express.Router();

const uploadFields = upload.fields([
  { name: 'degreeDocument', maxCount: 1 },
  { name: 'cnicDocument', maxCount: 1 }
]);

router.post('/signup', uploadFields, signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

module.exports = router; 