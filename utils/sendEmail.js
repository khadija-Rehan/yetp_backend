const nodemailer = require('nodemailer');
const config = require('../config/config');

const sendEmail = async (options) => {

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port || 587,
    secure: false,
    auth: {
      user: config.smtp.email,
      pass: config.smtp.password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    attachments: options.attachments || []
  };

  // Send email
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail; 