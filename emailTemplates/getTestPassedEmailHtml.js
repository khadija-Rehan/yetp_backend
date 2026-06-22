function getTestPassedEmailHtml({ userName, testScore, rollNumber }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Congratulations! You Passed the Admission Test - YETP</title>
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
            <h2 style="color: #333333;">🎉 Congratulations! You Have Passed the Admission Test</h2>
            <h3 style="color: #333333;">Your Seat at YETP is Confirmed — Pay Processing Fee to Enroll</h3>

            <p style="font-size: 16px; color: #555555;">
              Dear <strong>${userName}</strong>,
            </p>

            <p style="font-size: 16px; color: #555555;">
              You have successfully cleared the YETP Admission Test with a score of <strong>${testScore}%</strong>. You are now eligible to enroll. Please login to your dashboard and generate your PSID to pay the processing fee and confirm your seat.
            </p>

            <div style="background-color: #f8f9fa; padding: 15px 20px; border-radius: 8px; margin: 15px 0;">
              <p style="font-size: 15px; color: #555; margin: 0;">
                <strong>Your Result:</strong>
              </p>
              <ul style="font-size: 14px; color: #555; margin: 10px 0; padding-left: 20px;">
                <li><strong>Roll Number:</strong> <span style="color: #0B5D3B; font-weight: bold;">${rollNumber}</span></li>
                <li><strong>Test Score:</strong> <span style="color: #0B5D3B; font-weight: bold;">${testScore}%</span></li>
                <li><strong>Status:</strong> <span style="color: #0B5D3B; font-weight: bold;">PASSED ✓</span></li>
                <li><strong>Processing Fee:</strong> <span style="color: #0B5D3B; font-weight: bold;">PKR 3,250</span></li>
              </ul>
            </div>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #155724; margin-top: 0;">✅ YETP Program Benefits:</h3>
              <ul style="font-size: 14px; color: #155724; padding-left: 20px;">
                <li>Access to Advanced IT Courses (100% Free)</li>
                <li>Laptop Scheme Eligibility</li>
                <li>Hands-On Global Curriculum</li>
                <li>Career Guidance &amp; Freelancing Support</li>
                <li>Guaranteed Internship</li>
              </ul>
            </div>

            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #856404; margin-top: 0;">📋 Next Steps:</h3>
              <ol style="font-size: 14px; color: #856404; padding-left: 20px;">
                <li>Login to your dashboard at <strong>empower-path-eight.vercel.app</strong></li>
                <li>Click <strong>"Generate PSID"</strong> to get your Consumer Number</li>
                <li>Pay PKR 3,250 via Banking App, JazzCash, EasyPaisa or Bank Branch</li>
                <li>Your enrollment will be confirmed after payment</li>
              </ol>
            </div>

            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #856404; margin-top: 0;">⚠️ Important Notes:</h4>
              <ul style="font-size: 14px; color: #856404; padding-left: 20px;">
                <li>All selected courses are 100% free — this fee is for enrollment processing only</li>
                <li>Processing fee is non-refundable once paid</li>
                <li>After successful payment your enrollment will be confirmed automatically</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://empower-path-eight.vercel.app/admission-result" style="background-color: #0B5D3B; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 10px; display: inline-block;">
                Login &amp; Generate PSID
              </a>
              <br>
              <a href="https://empower-path-eight.vercel.app/contact" style="background-color: #C9A227; color: #073d27; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 10px; display: inline-block;">
                Contact Support
              </a>
            </div>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #155724; margin-top: 0;">📞 Need Help?</h4>
              <p style="font-size: 14px; color: #155724; margin: 0;">
                If you have any questions, please contact our support team at <a href="mailto:contact@yetp.pk" style="color: #0B5D3B;">contact@yetp.pk</a> or call <strong>0302-9898082 / 0324-9881887</strong>
              </p>
            </div>

            <p style="font-size: 14px; color: #999999;">
              This email was sent regarding your YETP admission test result.
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

module.exports = getTestPassedEmailHtml;
