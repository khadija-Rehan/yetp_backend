function getEmailVerificationHtml({ userName, verifyLink }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Email Verification</title>
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
            <h2 style="color: #333333;">Verify Your Email to Activate Your Account!</h2>
            <p style="font-size: 16px; color: #555555;">
              Dear <strong>${userName}</strong>,
            </p>
            <p style="font-size: 16px; color: #555555;">
              Thank you for registering on <strong>YETP</strong>. To secure your account and gain full access to our services, please verify your email address.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyLink}" style="background-color: #079560; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
                Verify Email
              </a>
            </div>
            <p style="font-size: 14px; color: #999999;">
              If you did not create this account, you can safely ignore this email.
            </p>
            <p style="font-size: 14px; color: #999999;">
              For your security, this link will expire in 24 hours.
            </p>
            <p style="font-size: 16px; color: #555555;">
              Thank you,<br />
              <strong>Team YETP</strong>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
}

module.exports = getEmailVerificationHtml;
