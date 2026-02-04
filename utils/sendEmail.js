const nodemailer = require("nodemailer");
const config = require("../config/config");

const sendEmail = async (options) => {
  try {
    // Determine which email configuration to use based on email type
    let emailConfig;

    switch (options.emailType) {
      case "verification":
        emailConfig = config.emails.verification;
        break;
      case "admissions":
        emailConfig = config.emails.admissions;
        break;
      case "contact":
        emailConfig = config.emails.contact;
        break;
      default:
        // Default to contact email if no type specified
        emailConfig = config.emails.admissions;
    }

    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port || 587,
      secure: true,
      auth: {
        user: emailConfig.email,
        pass: config.smtp.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const message = {
      from: `${emailConfig.name} <${emailConfig.email}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
      attachments: options.attachments || [],
    };

    // Send email
    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to send email",
    };
  }
};

module.exports = sendEmail;
