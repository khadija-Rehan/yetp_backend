const express = require('express');
const { generateAndSendPDF } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// PDF generation route
router.post('/generate-pdf', generateAndSendPDF);

module.exports = router; 