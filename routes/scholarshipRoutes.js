const express = require('express');
const {
  applyForScholarship,
  getAllScholarships,
  getScholarshipById,
  getScholarshipByRollNumber,
  updateScholarshipStatus,
  deleteScholarship,
} = require('../controllers/scholarshipController');
const { scholarshipValidation, updateStatusValidation } = require('../middleware/scholarshipValidators');
const uploadScholarshipImage = require('../middleware/scholarshipUpload');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (no auth required)
router.post('/apply', uploadScholarshipImage, scholarshipValidation, applyForScholarship);
router.get('/check/:rollNumber', getScholarshipByRollNumber);

// Protected routes (require authentication)
router.use(authMiddleware);

// Get all scholarships (admin)
router.get('/', getAllScholarships);

// Get scholarship by ID
router.get('/:id', getScholarshipById);

// Update scholarship status (admin)
router.put('/:id/status', updateStatusValidation, updateScholarshipStatus);

// Delete scholarship (admin)
router.delete('/:id', deleteScholarship);

module.exports = router; 