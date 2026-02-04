function getScholarshipSubmissionEmailHtml({
  userName,
  rollNumber,
  scholarshipId,
  submissionTime,
  bannerUrl,
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Scholarship Application Submitted</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #ddd; margin-top: 20px;">
        <tr>
          <td style="text-align: center;">
            <img src="https://hunarmandpunjab.org.pk/images/email_banner.png" alt="Hunarmand Punjab" style="width: 100%; max-width: 600px;" />
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #28a745;">🎉 Scholarship Application Submitted Successfully!</h2>
            <h3 style="color: #333333;">Thank you for applying to Hunarmand Punjab</h3>
            
            <p style="font-size: 16px; color: #555555;">
              Dear <strong>${userName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #555555;">
              We have successfully received your scholarship application. Our team will review your application and get back to you soon.
            </p>

            <div style="background-color: #f8f9fa; padding: 15px 20px; border-radius: 8px; margin: 15px 0;">
              <p style="font-size: 15px; color: #555; margin: 0;">
                <strong>Application Details:</strong>
              </p>
              <ul style="font-size: 14px; color: #555; margin: 10px 0; padding-left: 20px;">
                <li><strong>Roll Number:</strong> ${rollNumber}</li>
                <li><strong>Application ID:</strong> ${scholarshipId}</li>
                <li><strong>Submission Time:</strong> ${submissionTime}</li>
                <li><strong>Status:</strong> <span style="color: #28a745;">Under Review</span></li>
              </ul>
            </div>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #155724; margin-top: 0;">📋 What Happens Next:</h3>
              <ol style="font-size: 14px; color: #155724; padding-left: 20px;">
                <li>Our team will review your application within 3-5 business days</li>
                <li>You will receive an email notification about the status</li>
                <li>If approved, you'll get access to our learning platform</li>
                <li>You can track your application status in your dashboard</li>
              </ol>
            </div>

            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #856404; margin-top: 0;">⏰ Timeline:</h4>
              <p style="font-size: 14px; color: #856404; margin: 0;">
                • Application Review: 3-5 business days<br>
                • Notification: Within 24 hours of decision<br>
                • Course Access: Immediately after approval
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://hunarmandpunjab.org.pk/login" style="background-color: #079560; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 10px; display: inline-block;">
                View Application Status
              </a>
              <br>
              <a href="https://hunarmandpunjab.org.pk/contact-us" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 10px; display: inline-block;">
                Contact Support
              </a>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #333333; margin-top: 0;">📞 Need Help?</h4>
              <p style="font-size: 14px; color: #555; margin: 0;">
                If you have any questions about your application, please don't hesitate to contact our support team at <a href="mailto:contact@hunarmandpunjab.com" style="color: #007bff;">contact@hunarmandpunjab.com</a>
              </p>
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
}

module.exports = getScholarshipSubmissionEmailHtml;
