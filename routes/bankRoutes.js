const express = require('express');
const { inquery, postPay } = require('../controllers/bankController');
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');
const { validateInquery, validatePostPay, validateReversal } = require('../middleware/bankValidation');

const router = express.Router();

// Apply API key middleware to all bank routes
router.use(apiKeyMiddleware);

// Bank routes with validations
router.post('/inquery', validateInquery, inquery);
router.post('/post-pay', validatePostPay, postPay);
// router.post('/reversal', validateReversal(), reversal);

module.exports = router; 