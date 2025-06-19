require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '24h',
  
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    email: process.env.SMTP_EMAIL,
    password: process.env.SMTP_PASSWORD,
    fromName: process.env.FROM_NAME,
    fromEmail: process.env.FROM_EMAIL
  }
}; 