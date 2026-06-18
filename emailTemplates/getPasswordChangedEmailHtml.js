function getPasswordChangedEmailHtml({ userName, changeTime, bannerUrl }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Password Changed Successfully</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #ddd; margin-top: 20px;">
        <tr>
          <td style="text-align: center;">
            <img src="https://yetp.pk/images/email_banner.png" alt="YETP" style="width: 100%; max-width: 600px;" />
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #28a745;">✅ Password Changed Successfully!</h2>
            <h3 style="color: #333333;">Your Account Security Has Been Updated</h3>
            
            <p style="font-size: 16px; color: #555555;">
              Dear <strong>${userName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #555555;">
              Your YETP account password has been successfully changed. This change was made on <strong>${changeTime}</strong>.
            </p>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #155724; margin-top: 0;">🔒 Security Confirmation:</h3>
              <ul style="font-size: 14px; color: #155724; padding-left: 20px;">
                <li>✅ Your new password is now active</li>
                <li>✅ All previous sessions have been logged out</li>
                <li>✅ Your account is secure with the new password</li>
                <li>✅ You can now log in with your new password</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://yetp.pk/login" style="background-color: #079560; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 10px; display: inline-block;">
                Login to Your Account
              </a>
            </div>

            <p style="font-size: 16px; color: #555555;">
              Thank you for keeping your account secure!<br />
              <strong>Team YETP</strong>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
}

module.exports = getPasswordChangedEmailHtml;
