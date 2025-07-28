const multer = require('multer');
const path = require('path');

// Configure storage for scholarship uploads (images and pdf)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'scholarship-' + uniqueSuffix + ext);
  }
});

// File filter to allow only jpg, png, and pdf
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf'
  ];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and PDF files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  }
});

// Single file upload middleware for scholarship file (image or pdf)
const uploadScholarshipImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          message: 'File size too large. Maximum size is 20MB.' 
        });
      }
      return res.status(400).json({ 
        message: 'File upload error. Please try again.' 
      });
    } else if (err) {
      return res.status(400).json({ 
        message: err.message || 'Invalid file type. Only JPG, PNG, and PDF files are allowed.' 
      });
    }
    next();
  });
};

module.exports = uploadScholarshipImage; 