const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const Challan = require("../models/Challan");

// YETP brand colors
const GREEN      = rgb(0.043, 0.365, 0.231); // #0B5D3B
const DARK_GREEN = rgb(0.027, 0.239, 0.153); // #073d27
const GOLD       = rgb(0.788, 0.635, 0.153); // #C9A227
const WHITE      = rgb(1, 1, 1);
const LIGHT_GRAY = rgb(0.95, 0.97, 0.95);
const DARK_TEXT  = rgb(0.1, 0.1, 0.1);
const MID_TEXT   = rgb(0.4, 0.4, 0.4);

function drawCopy(page, font, boldFont, x, y, w, h, data) {
  const { challanNumber, psid, fullName, fatherName, mobile, email, cnic, courses, amount, issueDate, dueDate, copyLabel } = data;

  // Outer border
  page.drawRectangle({ x, y, width: w, height: h, borderColor: GREEN, borderWidth: 1.5 });

  // Header bar (dark green)
  page.drawRectangle({ x, y: y + h - 36, width: w, height: 36, color: DARK_GREEN });

  // Gold top accent line
  page.drawRectangle({ x, y: y + h - 3, width: w, height: 3, color: GOLD });

  // Header text
  page.drawText("YOUTH EMPOWERMENT TRAINING PROGRAM", {
    x: x + 8, y: y + h - 17, size: 6.5, font: boldFont, color: GOLD,
  });
  page.drawText("Application Processing Fee Challan", {
    x: x + 8, y: y + h - 27, size: 5.5, font, color: WHITE,
  });

  // Copy label (right side of header)
  const labelW = 40;
  page.drawRectangle({ x: x + w - labelW - 2, y: y + h - 28, width: labelW, height: 18, color: GOLD, borderRadius: 2 });
  page.drawText(copyLabel, { x: x + w - labelW + 2, y: y + h - 21, size: 6, font: boldFont, color: DARK_GREEN });

  // Section: Challan No + Amount
  const secY = y + h - 52;
  page.drawRectangle({ x, y: secY, width: w, height: 16, color: LIGHT_GRAY });
  page.drawText("Challan #:", { x: x + 6, y: secY + 5, size: 6.5, font: boldFont, color: DARK_GREEN });
  page.drawText(challanNumber, { x: x + 42, y: secY + 5, size: 7, font: boldFont, color: GREEN });
  page.drawText("Amount:", { x: x + w - 70, y: secY + 5, size: 6.5, font: boldFont, color: DARK_GREEN });
  page.drawText(`PKR ${amount}`, { x: x + w - 40, y: secY + 5, size: 7, font: boldFont, color: GREEN });

  // PSID row
  if (psid) {
    const psidY = secY - 14;
    page.drawRectangle({ x, y: psidY, width: w, height: 13, color: rgb(0.95, 0.99, 0.96) });
    page.drawLine({ start: { x, y: psidY + 13 }, end: { x: x + w, y: psidY + 13 }, color: GOLD, thickness: 0.5 });
    page.drawText("PSID / Consumer No:", { x: x + 6, y: psidY + 4, size: 6, font: boldFont, color: MID_TEXT });
    page.drawText(psid, { x: x + 65, y: psidY + 4, size: 7.5, font: boldFont, color: DARK_GREEN });
  }

  // Student info rows
  const rows = [
    ["Name",       fullName   || "-"],
    ["Father",     fatherName || "-"],
    ["CNIC",       cnic       || "-"],
    ["Mobile",     mobile     || "-"],
    ["Email",      email      || "-"],
  ];

  const baseY = psid ? (secY - 15) : secY;
  const rowH = 11;
  rows.forEach(([label, val], i) => {
    const ry = baseY - (i + 1) * rowH;
    if (i % 2 === 0) page.drawRectangle({ x, y: ry, width: w, height: rowH, color: rgb(0.98, 0.99, 0.98) });
    page.drawLine({ start: { x, y: ry }, end: { x: x + w, y: ry }, color: rgb(0.9, 0.94, 0.91), thickness: 0.4 });
    page.drawText(label + ":", { x: x + 6, y: ry + 3, size: 6, font: boldFont, color: DARK_GREEN });
    // Truncate long values
    const maxLen = Math.floor((w - 46) / 4);
    const display = val.length > maxLen ? val.slice(0, maxLen - 1) + "…" : val;
    page.drawText(display, { x: x + 40, y: ry + 3, size: 6, font, color: DARK_TEXT });
  });

  // Courses section
  const courseBaseY = baseY - rows.length * rowH - 2;
  page.drawRectangle({ x, y: courseBaseY - 10, width: w, height: 10, color: GREEN });
  page.drawText("ENROLLED COURSE(S)", { x: x + 6, y: courseBaseY - 7, size: 5.5, font: boldFont, color: GOLD });

  const courseList = (Array.isArray(courses) && courses.length ? courses : ["-"]).filter(Boolean);
  courseList.forEach((course, i) => {
    const cy = courseBaseY - 20 - i * 10;
    page.drawText(`${i + 1}.`, { x: x + 6, y: cy, size: 6, font: boldFont, color: DARK_GREEN });
    const maxCLen = Math.floor((w - 24) / 3.8);
    const disp = course.length > maxCLen ? course.slice(0, maxCLen - 1) + "…" : course;
    page.drawText(disp, { x: x + 16, y: cy, size: 6, font, color: DARK_TEXT });
  });

  // Dates + footer
  const footerY = y + 18;
  page.drawLine({ start: { x, y: footerY + 12 }, end: { x: x + w, y: footerY + 12 }, color: GOLD, thickness: 0.6 });
  page.drawText("Issue Date:", { x: x + 6, y: footerY + 4, size: 5.5, font: boldFont, color: MID_TEXT });
  page.drawText(issueDate, { x: x + 38, y: footerY + 4, size: 5.5, font, color: DARK_TEXT });
  page.drawText("Due Date:", { x: x + w / 2, y: footerY + 4, size: 5.5, font: boldFont, color: MID_TEXT });
  page.drawText(dueDate, { x: x + w / 2 + 30, y: footerY + 4, size: 5.5, font, color: DARK_TEXT });

  // Bottom green bar
  page.drawRectangle({ x, y, width: w, height: 17, color: DARK_GREEN });
  page.drawText("Bank of Punjab · 1Bill · JazzCash · EasyPaisa", {
    x: x + 6, y: y + 6, size: 5.5, font, color: rgb(1, 1, 1, 0.7),
  });
  page.drawText("www.yetp.pk", { x: x + w - 42, y: y + 6, size: 5.5, font: boldFont, color: GOLD });
}

const generatePDF = async (userData, amount, userCourses) => {
  try {
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    // Determine challan number
    let challanNumber, fileName, filePath, existingChallan;
    let attempts = 0;
    do {
      const last = await Challan.findOne({ challanId: { $regex: /^\d{5,7}$/ } }).sort({ challanId: -1 }).select("challanId");
      let next = 10000;
      if (last?.challanId) {
        const p = parseInt(last.challanId, 10);
        if (!isNaN(p) && p >= 10000 && p < 10000000) next = p + 1;
      }
      challanNumber = String(next);
      existingChallan = await Challan.findOne({ challanId: challanNumber });
      attempts++;
    } while (existingChallan && attempts < 10);

    if (existingChallan) throw new Error("Could not generate unique challan number.");

    fileName = `challan-${challanNumber}.pdf`;
    filePath = path.join(uploadsDir, fileName);

    // PSID for this challan
    const psid = "1000000" + challanNumber.padStart(8, "0");

    // Dates
    const now = new Date();
    const fmt = (d) => d.toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });
    const issueDate = fmt(now);
    const dueDate   = fmt(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));

    const courses = Array.isArray(userCourses) ? userCourses.filter(Boolean) : [];

    // Build PDF — A4 landscape
    const pdfDoc = await PDFDocument.create();
    const font     = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const PAGE_W = 841, PAGE_H = 595; // A4 landscape pt
    const page = pdfDoc.addPage([PAGE_W, PAGE_H]);

    // Page background
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: rgb(0.96, 0.97, 0.96) });

    // Top gold accent bar
    page.drawRectangle({ x: 0, y: PAGE_H - 4, width: PAGE_W, height: 4, color: GOLD });

    // Page header
    page.drawText("YOUTH EMPOWERMENT TRAINING PROGRAM", {
      x: 30, y: PAGE_H - 24, size: 14, font: boldFont, color: DARK_GREEN,
    });
    page.drawText("APPLICATION PROCESSING FEE CHALLAN", {
      x: 30, y: PAGE_H - 38, size: 9, font, color: MID_TEXT,
    });
    page.drawText(`Challan No: ${challanNumber}   |   Amount: PKR ${amount}   |   Date: ${issueDate}`, {
      x: PAGE_W - 310, y: PAGE_H - 30, size: 8, font, color: MID_TEXT,
    });

    // Divider
    page.drawLine({ start: { x: 20, y: PAGE_H - 46 }, end: { x: PAGE_W - 20, y: PAGE_H - 46 }, color: GOLD, thickness: 1 });

    // Three copies
    const MARGIN = 20, GAP = 10;
    const copyW = (PAGE_W - 2 * MARGIN - 2 * GAP) / 3;
    const copyH = PAGE_H - 46 - MARGIN - 20;
    const copyY = MARGIN;

    const copies = ["BANK COPY", "OFFICE COPY", "STUDENT COPY"];
    copies.forEach((label, i) => {
      const cx = MARGIN + i * (copyW + GAP);
      drawCopy(page, font, boldFont, cx, copyY, copyW, copyH, {
        challanNumber, psid, amount,
        fullName:   userData.fullName   || "-",
        fatherName: userData.fatherName || "-",
        mobile:     userData.mobile     || "-",
        email:      userData.email      || "-",
        cnic:       userData.cnic       || "-",
        courses,
        issueDate,
        dueDate,
        copyLabel: label,
      });

      // Dashed cut line between copies
      if (i < 2) {
        const lx = cx + copyW + GAP / 2;
        for (let dy = copyY; dy < copyY + copyH; dy += 6) {
          page.drawLine({ start: { x: lx, y: dy }, end: { x: lx, y: Math.min(dy + 3, copyY + copyH) }, color: MID_TEXT, thickness: 0.4 });
        }
        page.drawText("✂", { x: lx - 4, y: copyY + copyH / 2, size: 7, font, color: MID_TEXT });
      }
    });

    // Bottom bar
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 18, color: DARK_GREEN });
    page.drawText("Youth Empowerment Training Program  ·  Building No 30, Tariq Block, New Garden Town, Lahore  ·  0302-9898082", {
      x: 20, y: 5, size: 6.5, font, color: rgb(1, 1, 1, 0.6),
    });
    page.drawText("www.yetp.pk", { x: PAGE_W - 70, y: 5, size: 7, font: boldFont, color: GOLD });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);

    console.log("✅ YETP challan PDF saved:", filePath);
    return { filePath, fileName, challanNumber };
  } catch (error) {
    console.error("❌ PDF generation error:", error);
    throw error;
  }
};

module.exports = generatePDF;
