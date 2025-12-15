const express = require('express');
const { generateAndSendPDF, updateTestScore, getUserData, updateSecondEnrolledCourses } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { secondEnrolledCoursesValidation } = require('../middleware/validators');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// PDF generation route
router.post('/generate-pdf/:isSecondEnroll', generateAndSendPDF);

// Test score update route
router.post('/test', updateTestScore);

// Get user data route
router.get('/profile', getUserData);

// Update second enrolled courses route
router.post('/second-enrolled-courses', secondEnrolledCoursesValidation, updateSecondEnrolledCourses);

module.exports = router; 