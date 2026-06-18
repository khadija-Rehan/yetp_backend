function getChallanEmailHtml({ userName, challanNumber, amount, bannerUrl }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Your Challan is Ready</title>
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
            <h2 style="color: #333333;">💰 Your Challan is Ready!</h2>
            <h3 style="color: #333333;">Processing Fee Payment Details</h3>
            
            <p style="font-size: 16px; color: #555555;">
              Dear <strong>${userName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #555555;">
              Your challan has been generated successfully. Please find the attached challan document for payment of the processing fee.
            </p>

            <div style="background-color: #f8f9fa; padding: 15px 20px; border-radius: 8px; margin: 15px 0;">
              <p style="font-size: 15px; color: #555; margin: 0;">
                <strong>Challan Details:</strong>
              </p>
              <ul style="font-size: 14px; color: #555; margin: 10px 0; padding-left: 20px;">
                <li><strong>Challan Number:</strong> <span style="color: #079560; font-weight: bold;">${challanNumber}</span></li>
                <li><strong>Amount:</strong> <span style="color: #079560; font-weight: bold;">PKR ${amount}</span></li>
                <li><strong>Payment Type:</strong> Processing Fee</li>
                <li><strong>Status:</strong> <span style="color: #dc3545;">Pending Payment</span></li>
              </ul>
            </div>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #155724; margin-top: 0;">📋 Payment Instructions:</h3>
              <ol style="font-size: 14px; color: #155724; padding-left: 20px;">
                <li>Print the attached challan document</li>
                <li>Visit any branch of the designated bank</li>
                <li>Present the challan to the bank teller</li>
                <li>Pay the exact amount mentioned in the challan</li>
                <li>Keep the payment receipt for your records</li>
              </ol>
            </div>

            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #856404; margin-top: 0;">⚠️ Important Notes:</h4>
              <ul style="font-size: 14px; color: #856404; padding-left: 20px;">
                <li>Pay the exact amount mentioned - no additional charges</li>
                <li>Processing fee is non-refundable once paid</li>
                <li>After successful payment of processing fee your payment status will be updated to Paid. Check on your Dashboard</li>
              </ul>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #333333; margin-top: 0;">💳 Payment Methods:</h4>
              <p style="font-size: 14px; color: #555; margin: 0;">
                • Bank Branch Payment (Recommended)<br>
                • Online Banking (if available)<br>
                • Mobile Banking (if available)<br>
                • ATM Payment (if available)
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://yetp.pk/admission-result" style="background-color: #079560; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 10px; display: inline-block;">
                View Payment Status
              </a>
              <br>
              <a href="https://yetp.pk/contact-us" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 10px; display: inline-block;">
                Contact Support
              </a>
            </div>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #155724; margin-top: 0;">📞 Need Help?</h4>
              <p style="font-size: 14px; color: #155724; margin: 0;">
                If you have any questions about the payment process or need assistance, please contact our support team at <a href="mailto:contact@yetp.pk" style="color: #079560;">contact@yetp.pk</a>
              </p>
            </div>

            <p style="font-size: 14px; color: #999999;">
              This challan is generated for your scholarship application processing fee.
            </p>

            <p style="font-size: 16px; color: #555555;">
              Thank you for choosing YETP!<br />
              <strong>Team YETP</strong>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
}

module.exports = getChallanEmailHtml;
