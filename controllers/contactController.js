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
              This is an automated notification from the YETP contact form.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    // Send email to admin
    const adminEmailResult = await sendEmail({
      email: process.env.ADMIN_EMAIL || "contact@yetp.pk",
      subject: `New Contact Form Submission: ${subject}`,
      html: adminEmailHtml,
      emailType: "contact",
    });

    // Send confirmation email to user
    const userEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8" /><title>Thank You for Contacting YETP</title></head>
    <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f7f5;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #ddd;margin-top:20px;">
        <tr><td style="background:linear-gradient(135deg,#052b1c,#0B5D3B);padding:28px 30px;text-align:center;">
          <h1 style="color:#C9A227;margin:0;font-size:22px;letter-spacing:1px;">YOUTH EMPOWERMENT TRAINING PROGRAM</h1>
          <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">www.yetp.pk</p>
        </td></tr>
        <tr><td style="padding:30px;">
          <h2 style="color:#0B5D3B;margin:0 0 6px;">✅ Message Received!</h2>
          <p style="font-size:15px;color:#555;margin:0 0 16px;">Dear <strong>${name}</strong>, thank you for reaching out to YETP. We have received your message and will respond within 24 hours.</p>
          <div style="background:#f8fdf9;border:1px solid #c8e6d4;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
            <p style="font-size:13px;color:#555;margin:0 0 8px;font-weight:bold;">Your Message Details:</p>
            <p style="font-size:13px;color:#555;margin:4px 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="font-size:13px;color:#555;margin:4px 0;"><strong>Message:</strong> ${message}</p>
            <p style="font-size:13px;color:#555;margin:4px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="background:#fff8e6;border:1px solid #f0d080;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
            <p style="font-size:13px;color:#7a6010;margin:0;"><strong>📞 Need immediate help?</strong> Call us at 0302-9898082 or 0324-9881887</p>
          </div>
          <div style="text-align:center;margin:24px 0;">
            <a href="https://yetp.pk" style="background:#0B5D3B;color:#fff;padding:12px 28px;text-decoration:none;font-weight:bold;border-radius:6px;display:inline-block;">Visit YETP Website</a>
          </div>
          <p style="font-size:14px;color:#888;margin:0;">Thank you for choosing YETP!<br/><strong style="color:#0B5D3B;">Team YETP</strong></p>
        </td></tr>
        <tr><td style="background:#0B5D3B;padding:14px;text-align:center;">
          <p style="color:rgba(255,255,255,0.6);font-size:11px;margin:0;">© ${new Date().getFullYear()} Youth Empowerment Training Program · Lahore, Pakistan</p>
        </td></tr>
      </table>
    </body></html>
    `;

    const userEmailResult = await sendEmail({
      email: email,
      subject: "Thank You for Contacting YETP",
      html: userEmailHtml,
      emailType: "contact",
    });

    // Check if both emails were sent successfully
    const adminEmailSent = adminEmailResult.success;
    const userEmailSent = userEmailResult.success;

    if (!adminEmailSent && !userEmailSent) {
      // Both emails failed
      return res.status(500).json({
        status: "error",
        message: "Failed to send message. Please try again later.",
        emailError:
          "Both admin notification and user confirmation emails failed to send",
      });
    } else if (!adminEmailSent) {
      // Only admin email failed
      return res.status(200).json({
        status: "success",
        message:
          "Your message has been sent successfully. We'll get back to you soon!",
        warning:
          "Admin notification email failed to send, but your message was received",
        adminEmailError: adminEmailResult.error,
      });
    } else if (!userEmailResult.success) {
      // Only user email failed
      return res.status(200).json({
        status: "success",
        message:
          "Your message has been sent successfully. We'll get back to you soon!",
        warning:
          "Confirmation email failed to send, but your message was received",
        userEmailError: userEmailResult.error,
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
