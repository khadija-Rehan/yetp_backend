const express = require('express');
const { contactUs } = require('../controllers/contactController');
const webApiKeyMiddleware = require('../middleware/webApiKeyMiddleware');

const router = express.Router();

router.use(webApiKeyMiddleware);

// Contact us route
router.post('/contact', contactUs);

module.exports = router; 