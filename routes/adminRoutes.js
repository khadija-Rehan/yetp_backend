const express = require('express');
const { adminGenerateAndSendPDF } = require('../controllers/userController');
const adminApiKeyMiddleware = require('../middleware/adminApiKeyMiddleware');

const router = express.Router();

// Apply admin API key middleware to all admin routes
router.use(adminApiKeyMiddleware);

// Admin PDF generation route
router.post('/generate-pdf', adminGenerateAndSendPDF);

module.exports = router;
