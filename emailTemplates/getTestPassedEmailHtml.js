function getTestPassedEmailHtml({ userName, testScore, rollNumber }) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Congratulations! You Have Passed the Admission Test</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #ddd; margin-top: 20px;">
        <tr>
          <td style="text-align: center;">
            <img src="" alt="Hunarmand Punjab" style="width: 100%; max-width: 600px;" />
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #28a745;">🎉 Congratulations! You Have Passed the Admission Test!</h2>
            <h3 style="color: #333333;">Now You Are Eligible For Hunarmand Punjab Scholarship Card</h3>
            
            <p style="font-size: 16px; color: #555555;">
              Dear <strong>${userName}</strong>,
            </p>
            
            <div style="background-color: #f8f9fa; padding: 15px 20px; border-radius: 8px; margin: 15px 0;">
              <p style="font-size: 15px; color: #555; margin: 0;">
                <strong>Your Roll Number:</strong> <span style="color: #007bff;">${rollNumber}</span>
              </p>
            </div>
            
            <p style="font-size: 16px; color: #555555;">
              We are thrilled to inform you that you have successfully cleared the Hunarmand Punjab Admission Test with a score of <strong>${testScore}%</strong>. Now you are eligible for a Scholarship Card. To confirm your seat & proceed with your enrolled course. All the courses under the Hunarmand scholarship card are 100% free, but the application processing fee is necessary to complete your application. Your processing fee will be reimbursed if you achieve above 85% Marks in the final evaluation test under the policy of Hunarmand Punjab.
            </p>

            <p style="font-size: 16px; color: #555555;">
              You're just one step away from receiving your Scholarship Card!
            </p>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">Benefits of the Scholarship Card:</h3>
              <ul style="font-size: 14px; color: #555; padding-left: 20px;">
                <li>✅ Access to Advanced IT Courses</li>
                <li>✅ Laptop Scheme</li>
                <li>✅ Solar Scheme</li>
                <li>✅ Access to Taleem Finance</li>
                <li>✅ Access to Study Abroad Free Consultancy</li>
                <li>✅ Hands-On Learning with Global Curriculum</li>
                <li>✅ Career Guidance & Freelancing Support</li>
              </ul>
            </div>

            <div style="border: 2px solid #007bff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">Next Steps to Claim Your Scholarship Card:</h3>
              
              <h4 style="color: #333; margin: 15px 0 10px 0;">1. Submit the Application Processing Fee:</h4>
              <p style="font-size: 14px; color: #555; margin: 5px 0;">
                To Claim your Scholarship Card and confirm your seat, please pay the one-time processing fee of <strong>PKR 2850</strong>.
              </p>
              <ul style="font-size: 14px; color: #555; padding-left: 20px;">
                <li>This fee covers the processing and issuance of your Scholarship Card.</li>
                <li>All your selected courses are 100% free of cost — there are no tuition fees.</li>
              </ul>

              <h4 style="color: #333; margin: 15px 0 10px 0;">2. Complete Your Application Submission:</h4>
              <ul style="font-size: 14px; color: #555; padding-left: 20px;">
                <li>Once the processing fee is submitted, you must need to fill your Scholarship Card Application Form with your correct Details, & your application will be sent for final review.</li>
                <li>Once you successfully submit your scholarship card Application Form, you will receive a review email and further updates.</li>
              </ul>
            </div>

            <div style="background-color: #e9f7ef; border: 1px solid #b2f0c0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 14px; color: #155724; margin: 0;">
                <strong>Note:</strong> Please keep your Roll Number <strong>${rollNumber}</strong> safe. You may need it for future reference and for tracking your application status.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://hunarmandpunjab.pk/login" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 10px;">
                Login Here
              </a>
              <br>
              <a href="https://hunarmandpunjab.pk/apply-scholarshipcard" style="background-color: #28a745; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 10px;">
                Scholarship Card Application Form
              </a>
            </div>

            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 14px; color: #856404; margin: 0;">
                <strong>Important Note:</strong> If the fee is not paid, your Scholarship Card will not be issued and your application will be canceled.
              </p>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">What Happens Next:</h3>
              <ul style="font-size: 14px; color: #555; padding-left: 20px;">
                <li>✅ After your Processing Fee is confirmed and your application is approved, Then you will get your Scholarship Card.</li>
                <li>✅ Under Scholarship Card you are eligible for scholarship card Free laptop Scheme , Solar scheme, Taleem Finance, Study Abroad, & Advance IT Courses.</li>
                <li>✅ You will receive access to the LMS, where you can begin your learning journey.</li>
                <li>✅ If your application is not approved for any reason, your processing fee will be fully refunded.</li>
                <li>✅ After successfully completing your courses, you will be awarded an official certificate recognized by the Hunarmand Punjab.</li>
              </ul>
            </div>

            <p style="font-size: 14px; color: #999999;">
              For any questions, please contact our support team at <a href="mailto:support@hunarmandpunjab.pk" style="color: #007bff;">support@hunarmandpunjab.pk</a>
            </p>

            <p style="font-size: 16px; color: #555555;">
              Best Regards,<br />
              <strong>Team Hunarmand Punjab</strong>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  }
  
  module.exports = getTestPassedEmailHtml; 