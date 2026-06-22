function getTestPassedEmailHtml({ userName, testScore, rollNumber }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><title>Congratulations! You Passed — YETP</title></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f7f5;">
  <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#fff;margin-top:20px;border-radius:8px;overflow:hidden;border:1px solid #ddd;">

    <!-- Header -->
    <tr><td style="background:linear-gradient(135deg,#052b1c,#0B5D3B);padding:32px 30px;text-align:center;">
      <div style="width:56px;height:56px;border-radius:50%;background:rgba(201,162,39,0.2);border:2px solid #C9A227;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:26px;">🎉</span>
      </div>
      <h1 style="color:#C9A227;margin:0 0 6px;font-size:20px;letter-spacing:1px;">YOUTH EMPOWERMENT TRAINING PROGRAM</h1>
      <p style="color:rgba(255,255,255,0.65);margin:0;font-size:12px;letter-spacing:2px;">ADMISSION TEST RESULT</p>
    </td></tr>

    <!-- Score badge -->
    <tr><td style="background:#0B5D3B;padding:16px 30px;text-align:center;">
      <span style="display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(201,162,39,0.5);border-radius:40px;padding:8px 28px;">
        <span style="color:rgba(255,255,255,0.7);font-size:11px;font-weight:bold;letter-spacing:1px;">SCORE </span>
        <span style="color:#C9A227;font-size:22px;font-weight:900;"> ${testScore}%</span>
        <span style="color:rgba(255,255,255,0.5);font-size:11px;"> &nbsp;·&nbsp; </span>
        <span style="background:#C9A227;color:#073d27;font-size:11px;font-weight:900;padding:2px 12px;border-radius:20px;letter-spacing:1px;">PASS ✓</span>
      </span>
    </td></tr>

    <!-- Body -->
    <tr><td style="padding:30px;">
      <p style="font-size:15px;color:#333;margin:0 0 14px;">Dear <strong>${userName}</strong>,</p>
      <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px;">
        Congratulations! You have successfully cleared the <strong style="color:#0B5D3B;">YETP Admission Test</strong>.
        You are now eligible for the <strong>YETP Scholarship Card</strong>.
        Your Roll Number is <strong style="color:#0B5D3B;">${rollNumber}</strong>.
      </p>

      <!-- Info box -->
      <div style="background:#f0f9f4;border:1px solid #c8e6d4;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
        <p style="font-size:13px;color:#073d27;margin:0 0 8px;font-weight:bold;">✅ Scholarship Card Benefits:</p>
        <ul style="font-size:13px;color:#0B5D3B;margin:0;padding-left:18px;line-height:1.9;">
          <li>Access to Advanced IT Courses</li>
          <li>Laptop Scheme Eligibility</li>
          <li>Hands-On Global Curriculum</li>
          <li>Career Guidance &amp; Freelancing Support</li>
          <li>Guaranteed Internship</li>
        </ul>
      </div>

      <!-- Next steps -->
      <div style="background:#fff8e6;border:1px solid #f0d080;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
        <p style="font-size:13px;color:#7a6010;font-weight:bold;margin:0 0 8px;">📋 Next Step — Pay Processing Fee:</p>
        <p style="font-size:13px;color:#7a6010;margin:0 0 6px;">To confirm your seat and receive your Scholarship Card, please pay the one-time processing fee:</p>
        <p style="font-size:22px;font-weight:900;color:#0B5D3B;margin:8px 0 6px;">PKR 3,250</p>
        <p style="font-size:12px;color:#999;margin:0;">All selected courses are 100% free — this fee covers card processing only.</p>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin:24px 0;">
        <a href="https://empower-path-eight.vercel.app/admission-result"
           style="background:#0B5D3B;color:#fff;padding:13px 32px;text-decoration:none;font-weight:bold;font-size:14px;border-radius:6px;display:inline-block;">
          Login &amp; Generate PSID →
        </a>
      </div>

      <p style="font-size:13px;color:#888;line-height:1.6;margin:0;">
        For help: <a href="mailto:contact@yetp.pk" style="color:#0B5D3B;">contact@yetp.pk</a> &nbsp;|&nbsp; 0302-9898082 &nbsp;|&nbsp; 0324-9881887
      </p>
    </td></tr>

    <!-- Footer -->
    <tr><td style="background:#073d27;padding:14px 30px;text-align:center;">
      <p style="color:#C9A227;font-size:12px;font-weight:bold;margin:0 0 4px;">Youth Empowerment Training Program</p>
      <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:0;">Building No 30, Tariq Block, New Garden Town, Lahore &nbsp;·&nbsp; www.yetp.pk</p>
    </td></tr>

  </table>
</body>
</html>`;
}

module.exports = getTestPassedEmailHtml;
