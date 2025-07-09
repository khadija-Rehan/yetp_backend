const express = require('express');
const { generateAndSendPDF, updateTestScore, getUserData } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// PDF generation route
router.post('/generate-pdf', generateAndSendPDF);

// Test score update route
router.post('/test', updateTestScore);

// Get user data route
router.get('/profile', getUserData);

module.exports = router; 