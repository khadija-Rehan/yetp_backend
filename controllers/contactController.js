const sendEmail = require("../utils/sendEmail");

exports.contactUs = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        status: "error",
        message:
          "All fields are required: name, email, phone, subject, message",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid email address",
      });
    }

    // Validate phone number (basic validation for Pakistan numbers)
    const phoneRegex = /^(\+92|0)?[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid phone number",
      });
    }

    // Create admin notification email
    const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>New Contact Form Submission</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #ddd; margin-top: 20px;">
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #333333;">📧 New Contact Form Submission</h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333333; margin-top: 0;">Contact Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #079560;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="tel:${phone}" style="color: #079560;">${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${subject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Message:</strong></td>
                  <td style="padding: 8px 0;">${message}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #155724; margin-top: 0;">📅 Submission Details:</h4>
              <p style="font-size: 14px; color: #155724; margin: 0;">
                <strong>Date:</strong> ${new Date().toLocaleString()}<br>
                <strong>IP Address:</strong> ${
                  req.ip || req.connection.remoteAddress
                }<br>
                <strong>User Agent:</strong> ${req.get("User-Agent")}
              </p>
            </div>

            <p style="font-size: 14px; color: #999999;">
              This is an automated notification from the Hunarmand Punjab contact form.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    // Send email to admin
    const adminEmailResult = await sendEmail({
      email: process.env.ADMIN_EMAIL || "contact@hunarmandpunjab.pk",
      subject: `New Contact Form Submission: ${subject}`,
      html: adminEmailHtml,
    });

    // Send confirmation email to user
    const userEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Thank You for Contacting Us</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #ddd; margin-top: 20px;">
        <tr>
          <td style="text-align: center;">
            <img src="https://hunarmandpunjab.pk/images/email_banner.png" alt="Hunarmand Punjab" style="width: 100%; max-width: 600px;" />
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #28a745;">✅ Thank You for Contacting Us!</h2>
            <h3 style="color: #333333;">We've Received Your Message</h3>
            
            <p style="font-size: 16px; color: #555555;">
              Dear <strong>${name}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #555555;">
              Thank you for reaching out to Hunarmand Punjab. We have successfully received your message and our team will get back to you as soon as possible.
            </p>

            <div style="background-color: #f8f9fa; padding: 15px 20px; border-radius: 8px; margin: 15px 0;">
              <p style="font-size: 15px; color: #555; margin: 0;">
                <strong>Your Message Details:</strong>
              </p>
              <ul style="font-size: 14px; color: #555; margin: 10px 0; padding-left: 20px;">
                <li><strong>Subject:</strong> ${subject}</li>
                <li><strong>Message:</strong> ${message}</li>
                <li><strong>Submitted:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #155724; margin-top: 0;">📋 What Happens Next:</h3>
              <ol style="font-size: 14px; color: #155724; padding-left: 20px;">
                <li>Our team will review your message within 24 hours</li>
                <li>You will receive a detailed response via email</li>
                <li>If needed, we may contact you via phone</li>
                <li>We aim to resolve all inquiries within 48 hours</li>
              </ol>
            </div>

            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #856404; margin-top: 0;">📞 Need Immediate Assistance?</h4>
              <p style="font-size: 14px; color: #856404; margin: 0;">
                For urgent matters, you can also contact us directly at <a href="mailto:support@hunarmandpunjab.pk" style="color: #079560;">support@hunarmandpunjab.pk</a> or call our helpline.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://hunarmandpunjab.pk" style="background-color: #079560; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 10px; display: inline-block;">
                Visit Our Website
              </a>
            </div>

            <p style="font-size: 16px; color: #555555;">
              Thank you for choosing Hunarmand Punjab!<br />
              <strong>Team Hunarmand Punjab</strong>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    const userEmailResult = await sendEmail({
      email: email,
      subject: "Thank You for Contacting Hunarmand Punjab",
      html: userEmailHtml,
    });

    // Check if both emails were sent successfully
    const adminEmailSent = adminEmailResult.success;
    const userEmailSent = userEmailResult.success;

    if (!adminEmailSent && !userEmailSent) {
      // Both emails failed
      return res.status(500).json({
        status: "error",
        message: "Failed to send message. Please try again later.",
        emailError: "Both admin notification and user confirmation emails failed to send"
      });
    } else if (!adminEmailSent) {
      // Only admin email failed
      return res.status(200).json({
        status: "success",
        message: "Your message has been sent successfully. We'll get back to you soon!",
        warning: "Admin notification email failed to send, but your message was received",
        adminEmailError: adminEmailResult.error
      });
    } else if (!userEmailResult.success) {
      // Only user email failed
      return res.status(200).json({
        status: "success",
        message: "Your message has been sent successfully. We'll get back to you soon!",
        warning: "Confirmation email failed to send, but your message was received",
        userEmailError: userEmailResult.error
      });
    }

    return res.status(200).json({
      status: "success",
      message:
        "Your message has been sent successfully. We'll get back to you soon!",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to send message. Please try again later.",
    });
  }
};
