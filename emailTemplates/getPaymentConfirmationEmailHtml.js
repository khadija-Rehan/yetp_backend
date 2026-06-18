function getPaymentConfirmationEmailHtml({
  fullName,
  challanId,
  amount,
  txnId,
  date,
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Payment Confirmation</title>
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
            <h2 style="color: #2c3e50;">✅ Payment Confirmation</h2>
            
            <p style="font-size: 16px; color: #555555;">
              Dear <strong>${fullName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #555555;">
              Your challan payment has been successfully received.
            </p>

            <div style="background-color: #f8f9fa; padding: 15px 20px; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 15px; color: #555; margin: 0;">
                <strong>Transaction Details:</strong>
              </p>
              <ul style="font-size: 14px; color: #555; margin: 10px 0; padding-left: 20px;">
                <li><strong>Challan ID:</strong> <span style="font-weight: bold;">${challanId}</span></li>
                <li><strong>Amount Paid:</strong> <span style="color: #079560; font-weight: bold;">PKR ${amount}</span></li>
                <li><strong>Transaction ID:</strong> ${txnId}</li>
                <li><strong>Date:</strong> ${date}</li>
                <li><strong>Status:</strong> <span style="color: #079560;">Paid</span></li>
              </ul>
            </div>

            <p style="font-size: 16px; color: #555555;">
              Thank you for your prompt payment.
            </p>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #155724; margin-top: 0;">📞 Need Help?</h4>
              <p style="font-size: 14px; color: #155724; margin: 0;">
                If you have any questions about this transaction or need assistance, please contact our support team at <a href="mailto:contact@yetp.pk" style="color: #079560;">contact@yetp.pk</a>
              </p>
            </div>

            <p style="font-size: 16px; color: #555555;">
              Thank you,<br />
              <strong>YETP Team</strong>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

module.exports = getPaymentConfirmationEmailHtml;
