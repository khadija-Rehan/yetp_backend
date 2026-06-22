function getChallanEmailHtml({ userName, challanNumber, amount, psid }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Your PSID &amp; Challan is Ready - YETP</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #ddd; margin-top: 20px;">
        <tr>
          <td style="text-align: center; padding: 0; background: linear-gradient(135deg, #052b1c, #0B5D3B);">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 28px 30px; text-align: center;">
                  <h1 style="color: #C9A227; margin: 0 0 6px; font-size: 20px; letter-spacing: 1px; font-family: Arial, sans-serif;">YOUTH EMPOWERMENT TRAINING PROGRAM</h1>
                  <p style="color: rgba(255,255,255,0.65); margin: 0; font-size: 12px; letter-spacing: 2px;">www.yetp.pk</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #333333;">💰 Your PSID &amp; Challan is Ready!</h2>
            <h3 style="color: #333333;">Processing Fee Payment Details</h3>

            <p style="font-size: 16px; color: #555555;">
              Dear <strong>${userName}</strong>,
            </p>

            <p style="font-size: 16px; color: #555555;">
              Your PSID and challan have been generated successfully. Please find the details below to complete your application processing fee payment. The challan PDF is also attached to this email.
            </p>

            ${psid ? `
            <div style="background-color: #f0f9f4; border: 2px solid #0B5D3B; border-radius: 8px; padding: 15px 20px; margin: 15px 0; text-align: center;">
              <p style="font-size: 12px; font-weight: bold; color: #888; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 8px;">PSID / Consumer Number</p>
              <p style="font-size: 26px; font-weight: 900; color: #0B5D3B; letter-spacing: 3px; margin: 0; font-family: monospace;">${psid}</p>
              <p style="font-size: 12px; color: #aaa; margin: 8px 0 0;">Enter this number in Banking App, JazzCash or EasyPaisa under 1Bill</p>
            </div>
            ` : ''}

            <div style="background-color: #f8f9fa; padding: 15px 20px; border-radius: 8px; margin: 15px 0;">
              <p style="font-size: 15px; color: #555; margin: 0;">
                <strong>Challan Details:</strong>
              </p>
              <ul style="font-size: 14px; color: #555; margin: 10px 0; padding-left: 20px;">
                <li><strong>Challan Number:</strong> <span style="color: #0B5D3B; font-weight: bold;">${challanNumber}</span></li>
                <li><strong>Amount:</strong> <span style="color: #0B5D3B; font-weight: bold;">PKR ${amount}</span></li>
                <li><strong>Payment Type:</strong> Application Processing Fee</li>
                <li><strong>Status:</strong> <span style="color: #dc3545;">Pending Payment</span></li>
              </ul>
            </div>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #155724; margin-top: 0;">📋 Payment Instructions:</h3>
              <ol style="font-size: 14px; color: #155724; padding-left: 20px;">
                <li>Open your banking app (HBL, Meezan, UBL, Bank Alfalah, JazzCash, EasyPaisa)</li>
                <li>Go to <strong>Bill Payments</strong> and select <strong>1Bill</strong></li>
                <li>Enter your <strong>PSID / Consumer Number</strong> shown above</li>
                <li>Verify the name and amount, then confirm payment</li>
                <li>Save the confirmation receipt or SMS for your records</li>
              </ol>
            </div>

            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #856404; margin-top: 0;">⚠️ Important Notes:</h4>
              <ul style="font-size: 14px; color: #856404; padding-left: 20px;">
                <li>Pay the exact amount mentioned — no additional charges</li>
                <li>Processing fee is non-refundable once paid</li>
                <li>After successful payment your enrollment will be confirmed automatically</li>
                <li>Check payment status on your dashboard</li>
              </ul>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #333333; margin-top: 0;">💳 Payment Methods:</h4>
              <p style="font-size: 14px; color: #555; margin: 0;">
                • <strong>Banking App</strong> — HBL, Meezan, UBL, Bank Alfalah (via 1Bill)<br>
                • <strong>JazzCash</strong> — Pay Bills → 1Bill → Enter PSID<br>
                • <strong>EasyPaisa</strong> — Bill Payments → 1Bill → Enter PSID<br>
                • <strong>Bank Branch (BOP)</strong> — Print attached challan, pay at any Bank of Punjab
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://empower-path-eight.vercel.app/admission-result" style="background-color: #0B5D3B; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 10px; display: inline-block;">
                View Payment Status
              </a>
              <br>
              <a href="https://empower-path-eight.vercel.app/contact" style="background-color: #C9A227; color: #073d27; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 10px; display: inline-block;">
                Contact Support
              </a>
            </div>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #155724; margin-top: 0;">📞 Need Help?</h4>
              <p style="font-size: 14px; color: #155724; margin: 0;">
                If you have any questions about the payment process, please contact us at <a href="mailto:contact@yetp.pk" style="color: #0B5D3B;">contact@yetp.pk</a> or call <strong>0302-9898082 / 0324-9881887</strong>
              </p>
            </div>

            <p style="font-size: 14px; color: #999999;">
              This email was sent regarding your YETP application processing fee challan.
            </p>

            <p style="font-size: 16px; color: #555555;">
              Thank you for choosing YETP!<br />
              <strong>Team YETP</strong>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #073d27; padding: 14px 30px; text-align: center;">
            <p style="color: rgba(255,255,255,0.5); font-size: 11px; margin: 0;">
              © ${new Date().getFullYear()} Youth Empowerment Training Program &nbsp;·&nbsp; Building No 30, Tariq Block, New Garden Town, Lahore &nbsp;·&nbsp; www.yetp.pk
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

module.exports = getChallanEmailHtml;
