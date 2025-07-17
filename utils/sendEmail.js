const nodemailer = require('nodemailer');
const config = require('../config/config');

const sendEmail = async (options) => {
  try {
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
      html: options.html,
      attachments: options.attachments || []
    };

    // Send email
    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email'
    };
  }
};

module.exports = sendEmail; 