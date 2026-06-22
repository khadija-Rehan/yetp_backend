function getChallanEmailHtml({ userName, challanNumber, amount, psid }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><title>Your PSID &amp; Challan — YETP</title></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f7f5;">
  <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#fff;margin-top:20px;border-radius:8px;overflow:hidden;border:1px solid #ddd;">

    <!-- Header -->
    <tr><td style="background:linear-gradient(135deg,#052b1c,#0B5D3B);padding:28px 30px;text-align:center;">
      <h1 style="color:#C9A227;margin:0 0 4px;font-size:19px;letter-spacing:1px;">YOUTH EMPOWERMENT TRAINING PROGRAM</h1>
      <p style="color:rgba(255,255,255,0.65);margin:0;font-size:12px;letter-spacing:2px;">PROCESSING FEE CHALLAN</p>
    </td></tr>

    <!-- Body -->
    <tr><td style="padding:30px;">
      <p style="font-size:15px;color:#333;margin:0 0 16px;">Dear <strong>${userName}</strong>,</p>
      <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px;">
        Your PSID and challan have been generated. Please use the details below to complete your application processing fee payment.
      </p>

      <!-- PSID box -->
      ${psid ? `
      <div style="background:linear-gradient(135deg,#f0f9f4,#e8f5ee);border:2px solid #0B5D3B;border-radius:10px;padding:18px 22px;margin-bottom:16px;text-align:center;">
        <p style="font-size:11px;font-weight:bold;color:#888;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">PSID / Consumer Number</p>
        <p style="font-size:28px;font-weight:900;color:#0B5D3B;letter-spacing:3px;margin:0;font-family:monospace;">${psid}</p>
        <p style="font-size:11px;color:#aaa;margin:6px 0 0;">Use this number in any banking app, JazzCash or EasyPaisa under 1Bill</p>
      </div>` : ''}

      <!-- Challan details -->
      <div style="background:#f8fdf9;border:1px solid #c8e6d4;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
        <p style="font-size:13px;color:#073d27;font-weight:bold;margin:0 0 10px;">Challan Details:</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#555;padding:5px 0;border-bottom:1px solid #eef4f0;"><strong>Challan Number</strong></td>
            <td style="font-size:13px;color:#0B5D3B;font-weight:bold;padding:5px 0;border-bottom:1px solid #eef4f0;text-align:right;">${challanNumber}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#555;padding:5px 0;border-bottom:1px solid #eef4f0;"><strong>Amount</strong></td>
            <td style="font-size:14px;color:#0B5D3B;font-weight:900;padding:5px 0;border-bottom:1px solid #eef4f0;text-align:right;">PKR ${amount}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#555;padding:5px 0;border-bottom:1px solid #eef4f0;"><strong>Payment Type</strong></td>
            <td style="font-size:13px;color:#555;padding:5px 0;border-bottom:1px solid #eef4f0;text-align:right;">Application Processing Fee</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#555;padding:5px 0;"><strong>Status</strong></td>
            <td style="padding:5px 0;text-align:right;"><span style="background:#fff3cd;color:#856404;font-size:11px;font-weight:bold;padding:2px 12px;border-radius:20px;">PENDING</span></td>
          </tr>
        </table>
      </div>

      <!-- Payment methods -->
      <div style="background:#fff8e6;border:1px solid #f0d080;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
        <p style="font-size:13px;color:#7a6010;font-weight:bold;margin:0 0 8px;">💳 How to Pay:</p>
        <ul style="font-size:13px;color:#7a6010;margin:0;padding-left:18px;line-height:1.9;">
          <li><strong>Banking App</strong> (HBL, Meezan, UBL, Bank Alfalah) — Go to Bill Payments → 1Bill → Enter PSID</li>
          <li><strong>JazzCash</strong> — Pay Bills → 1Bill → Enter PSID</li>
          <li><strong>EasyPaisa</strong> — Bill Payments → 1Bill → Enter PSID</li>
          <li><strong>Bank Branch (BOP)</strong> — Print attached challan and pay at any Bank of Punjab branch</li>
        </ul>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin:24px 0;">
        <a href="https://empower-path-eight.vercel.app/admission-result"
           style="background:#0B5D3B;color:#fff;padding:13px 32px;text-decoration:none;font-weight:bold;font-size:14px;border-radius:6px;display:inline-block;">
          View Payment Status →
        </a>
      </div>

      <p style="font-size:12px;color:#aaa;margin:0;">Need help? <a href="mailto:contact@yetp.pk" style="color:#0B5D3B;">contact@yetp.pk</a> &nbsp;·&nbsp; 0302-9898082 &nbsp;·&nbsp; 0324-9881887</p>
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

module.exports = getChallanEmailHtml;
