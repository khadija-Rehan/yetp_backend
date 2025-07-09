function getScholarshipSubmissionEmailHtml({ userName, rollNumber, scholarshipId, submissionTime, bannerUrl }) {
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
            <img src="${bannerUrl}" alt="Hunarmand Punjab" style="width: 100%; max-width: 600px;" />
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #333333;">🎓 Scholarship Application Submitted Successfully!</h2>
            <p style="font-size: 16px; color: #555555;">
              Dear <strong>${userName}</strong>,
            </p>
            <p style="font-size: 16px; color: #555555;">
              Thank you for submitting your scholarship application to <strong>Hunarmand Punjab</strong>. We have received your application and it is now under review.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">Application Details:</h3>
              <p style="font-size: 14px; color: #555; margin: 5px 0;"><strong>Roll Number:</strong> ${rollNumber}</p>
              <p style="font-size: 14px; color: #555; margin: 5px 0;"><strong>Application ID:</strong> ${scholarshipId}</p>
              <p style="font-size: 14px; color: #555; margin: 5px 0;"><strong>Submission Time:</strong> ${submissionTime}</p>
              <p style="font-size: 14px; color: #555; margin: 5px 0;"><strong>Status:</strong> <span style="color: #ffc107; font-weight: bold;">Under Review</span></p>
            </div>

            <p style="font-size: 16px; color: #555555;">
              Our team will carefully review your application and get back to you within 5-7 business days. You will receive an email notification once your application status is updated.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://hunarmandpunjab.pk/dashboard" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px;">
                View Application Status
              </a>
            </div>

            <p style="font-size: 14px; color: #999999;">
              If you have any questions about your application, please contact our support team.
            </p>

            <p style="font-size: 16px; color: #555555;">
              Thank you for choosing <strong>Hunarmand Punjab</strong>!<br />
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
  