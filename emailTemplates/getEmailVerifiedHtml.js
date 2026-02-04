function getEmailVerifiedHtml({ userName, rollNumber }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Email Verified Successfully</title>
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
            <h2 style="color: #28a745;">✅ Email Verified Successfully!</h2>
            <h3 style="color: #333333;">Welcome to Hunarmand Punjab</h3>
            
            <p style="font-size: 16px; color: #555555;">
              Dear <strong>${userName}</strong>,
            </p>
            
            <div style="background-color: #f8f9fa; padding: 15px 20px; border-radius: 8px; margin: 15px 0;">
              <p style="font-size: 15px; color: #555; margin: 0;">
                <strong>Your Roll Number:</strong> <span style="color: #007bff;">${rollNumber}</span>
              </p>
            </div>
            
            <p style="font-size: 16px; color: #555555;">
              Congratulations! Your email has been successfully verified. Your account is now active and you can access all features of Hunarmand Punjab.
            </p>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #155724; margin-top: 0;">🎉 What You Can Do Now:</h3>
              <ul style="font-size: 14px; color: #155724; padding-left: 20px;">
                <li>✅ Access your personalized dashboard</li>
                <li>✅ Take the admission test</li>
                <li>✅ Apply for scholarship programs</li>
                <li>✅ Enroll in IT courses</li>
                <li>✅ Track your progress</li>
                <li>✅ Access learning materials</li>
              </ul>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">Next Steps:</h3>
              <ol style="font-size: 14px; color: #555; padding-left: 20px;">
                <li><strong>Complete Your Profile:</strong> Add any missing information to your profile</li>
                <li><strong>Take the Admission Test:</strong> Complete the assessment to determine your eligibility</li>
                <li><strong>Apply for Scholarship:</strong> Submit your scholarship application if eligible</li>
                <li><strong>Start Learning:</strong> Begin your journey with our IT courses</li>
              </ol>
            </div>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 14px; color: #155724; margin: 0;">
                <strong>Note:</strong> Please keep your Roll Number <strong>${rollNumber}</strong> safe. You may need it for future reference and for tracking your application status.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://hunarmandpunjab.org.pk/login" style="background-color: #079560; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 10px; display: inline-block;">
                Login to Your Account
              </a>
              <br>
            </div>

            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #856404; margin-top: 0;">🔒 Security Reminder:</h4>
              <p style="font-size: 14px; color: #856404; margin: 0;">
                • Keep your login credentials secure<br>
                • Never share your password with anyone<br>
                • Log out from shared devices<br>
                • Contact support if you notice any suspicious activity
              </p>
            </div>

            <p style="font-size: 14px; color: #999999;">
              For any questions or support, please contact our team at <a href="mailto:contact@hunarmandpunjab.com" style="color: #007bff;">contact@hunarmandpunjab.com</a>
            </p>

            <p style="font-size: 16px; color: #555555;">
              Welcome to the Hunarmand Punjab family!<br />
              <strong>Team Hunarmand Punjab</strong>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
}

module.exports = getEmailVerifiedHtml;
