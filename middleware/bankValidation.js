const { body, validationResult } = require('express-validator');

// Validation middleware for inquery route
const validateInquery = [
    body('challanId')
        .notEmpty()
        .withMessage('Challan ID is required')
        .isString()
        .withMessage('Challan ID must be a string')
        .trim(),
    
    // Validation result middleware
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validation middleware for postPay route
const validatePostPay = [
    body('challanId')
        .notEmpty()
        .withMessage('Challan ID is required')
        .isString()
        .withMessage('Challan ID must be a string')
        .trim(),
    
    body('txnId')
        .notEmpty()
        .withMessage('Transaction ID is required')
        .isString()
        .withMessage('Transaction ID must be a string')
        .trim(),
    
    body('amount')
        .notEmpty()
        .withMessage('Amount is required')
        .isString()
        .withMessage('Amount must be a string')
        .trim()
        .custom((value) => !isNaN(value) && Number(value) > 0)
        .withMessage('Amount must be a numeric string greater than 0'),
    
    body('branchCode')
        .notEmpty()
        .withMessage('Branch code is required')
        .isString()
        .withMessage('Branch code must be a string')
        .trim(),
    
    body('txnDate')
        .notEmpty()
        .withMessage('Transaction date is required')
        .isISO8601()
        .withMessage('Transaction date must be a valid date'),
    
    // Validation result middleware
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validation middleware for reversal route
const validateReversal = [
    body('challanId')
        .notEmpty()
        .withMessage('Challan ID is required')
        .isString()
        .withMessage('Challan ID must be a string')
        .trim(),
    
    body('txnId')
        .notEmpty()
        .withMessage('Transaction ID is required')
        .isString()
        .withMessage('Transaction ID must be a string')
        .trim(),
    
    body('amount')
        .notEmpty()
        .withMessage('Amount is required')
        .isNumeric()
        .withMessage('Amount must be a number')
        .custom((value) => value > 0)
        .withMessage('Amount must be greater than 0'),
    
    // Validation result middleware
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateInquery,
    validatePostPay,
    validateReversal
}; 