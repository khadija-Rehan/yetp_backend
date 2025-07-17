require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '24h',
  
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    password: process.env.SMTP_PASSWORD, // Same password for all emails
    fromName: process.env.FROM_NAME,
    fromEmail: process.env.FROM_EMAIL
  },
  
  // Email configurations for different notification types
  emails: {
    // Email Verification & Email Verification Successfully
    verification: {
      email: process.env.VERIFICATION_EMAIL || 'noreply@hunarmandpunjab.com',
      name: 'Hunarmand Punjab - No Reply'
    },
    
    // Admission Test Email Notification & Challan Email Notification & Certificate Notification
    admissions: {
      email: process.env.ADMISSIONS_EMAIL || 'admissions@hunarmandpunjab.com',
      name: 'Hunarmand Punjab - Admissions'
    },
    
    // Password Reset & Scholarship Card & Contact
    contact: {
      email: process.env.CONTACT_EMAIL || 'contact@hunarmandpunjab.com',
      name: 'Hunarmand Punjab - Contact'
    }
  }
}; 