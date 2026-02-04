function getForgotPasswordEmailHtml({ userName, resetUrl }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Password Reset Request</title>
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
            <h2 style="color: #333333;">🔐 Password Reset Request</h2>
            
            <p style="font-size: 16px; color: #555555;">
              Dear <strong>${userName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #555555;">
              We received a request to reset your password for your Hunarmand Punjab account. If you made this request, please click the button below to reset your password.
            </p>

            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #856404; margin-top: 0;">⚠️ Important Security Notice:</h4>
              <p style="font-size: 14px; color: #856404; margin: 0;">
                • This link will expire in 10 minutes for security reasons<br>
                • If you didn't request this password reset, please ignore this email<br>
                • Never share this link with anyone else
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #079560; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
                Reset My Password
              </a>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #333333; margin-top: 0;">🔒 Password Security Tips:</h4>
              <ul style="font-size: 14px; color: #555; padding-left: 20px;">
                <li>Use a strong password with at least 8 characters</li>
                <li>Include a mix of letters, numbers, and special characters</li>
                <li>Don't use the same password for multiple accounts</li>
                <li>Consider using a password manager for better security</li>
              </ul>
            </div>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #155724; margin-top: 0;">📞 Need Help?</h4>
              <p style="font-size: 14px; color: #155724; margin: 0;">
                If you're having trouble resetting your password or didn't request this reset, please contact our support team at <a href="mailto:contact@hunarmandpunjab.com" style="color: #079560;">contact@hunarmandpunjab.com</a>
              </p>
            </div>

            <p style="font-size: 14px; color: #999999;">
              This is an automated message. Please do not reply to this email.
            </p>

            <p style="font-size: 16px; color: #555555;">
              Best regards,<br />
              <strong>Team Hunarmand Punjab</strong>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
}

module.exports = getForgotPasswordEmailHtml;
