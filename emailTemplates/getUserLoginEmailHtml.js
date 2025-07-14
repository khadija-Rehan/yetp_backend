function getUserLoginEmailHtml({ userName, loginTime, dashboardUrl }) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Login Alert</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f6f6;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #ddd; margin-top: 20px;">
        <tr>
          <td style="text-align: center;">
            <img src="" alt="Hunarmand Punjab" style="width: 100%; max-width: 600px;" />
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #333333;">🔒 Login Alert</h2>
            <p style="font-size: 16px; color: #555555;">Hi <strong>${userName}</strong>,</p>
            <p style="font-size: 16px; color: #555555;">
              We noticed a login to your <strong>Hunarmand Punjab</strong> account on:
            </p>
  
            <p style="font-size: 15px; color: #333;"><strong>${loginTime}</strong></p>
  
            <p style="font-size: 15px; color: #555;">
              If this was you, no action is needed. If not, we recommend changing your password immediately.
            </p>
  
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" style="background-color: #079560; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
  
            <p style="font-size: 16px; color: #555;">
              Thanks,<br />
              <strong>Team Hunarmand Punjab</strong>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  }
  
  module.exports = getUserLoginEmailHtml;
  