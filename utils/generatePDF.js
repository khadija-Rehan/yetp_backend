const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const Challan = require("../models/Challan");

const generatePDF = async (userData, amount, userCourses) => {
  try {
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    // Sequential challan number
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

    // PSID
    const psid = "1000000" + challanNumber.padStart(8, "0");

    // Load the existing challan template
    const templatePath = path.join(__dirname, "../challan.pdf");
    const existingPdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const black = rgb(0, 0, 0);
    const green = rgb(0.043, 0.365, 0.231);

    // Dates
    const now = new Date();
    const issueDate = now.toLocaleDateString("en-US");
    const dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US");

    // 3 copies — same x offsets as original
    const positions = [
      { xOffset: 350, yOffset: 320 },
      { xOffset: 80,  yOffset: 320 },
      { xOffset: 620, yOffset: 320 },
    ];

    const courses = Array.isArray(userCourses) ? userCourses.filter(Boolean) : [];
    if (courses.length === 0) courses.push("-");

    positions.forEach(({ xOffset, yOffset }) => {
      const page = pages[0];

      // Challan number
      page.drawText(challanNumber, { x: xOffset + 145, y: yOffset + 230, size: 10, font, color: black });

      // PSID line (above student name)
      page.drawText("PSID:", { x: xOffset - 30, y: yOffset + 160, size: 7, font: boldFont, color: green });
      page.drawText(psid, { x: xOffset + 5, y: yOffset + 160, size: 8, font: boldFont, color: green });

      // Student info
      page.drawText(userData.fullName   || "-", { x: xOffset + 40, y: yOffset + 135, size: 10, font, color: black });
      page.drawText(userData.fatherName || "-", { x: xOffset + 40, y: yOffset + 110, size: 10, font, color: black });
      page.drawText(userData.mobile     || "-", { x: xOffset + 40, y: yOffset + 90,  size: 10, font, color: black });
      page.drawText(userData.email      || "-", { x: xOffset + 40, y: yOffset + 65,  size: 10, font, color: black });

      // Dates
      page.drawText(issueDate, { x: xOffset + 5,   y: yOffset + 45, size: 10, font, color: black });
      page.drawText(dueDate,   { x: xOffset + 130, y: yOffset + 45, size: 10, font, color: black });

      // Courses
      const courseStartY = yOffset - 50;
      const courseGap = 15;
      courses.forEach((course, i) => {
        const cy = courseStartY - i * courseGap;
        page.drawText(String(i + 1),  { x: xOffset - 30, y: cy, size: 6, font, color: black });
        page.drawText(course,          { x: xOffset + 7,  y: cy, size: 6, font, color: black });
        page.drawText("0",             { x: xOffset + 170, y: cy, size: 6, font, color: black });
      });

      // Processing fee row
      const feeY = courseStartY - courses.length * courseGap;
      page.drawText("Total",           { x: xOffset - 30, y: feeY, size: 6, font, color: black });
      page.drawText("Processing Fee",  { x: xOffset + 7,  y: feeY, size: 6, font, color: black });
      page.drawText(String(amount),    { x: xOffset + 170, y: feeY, size: 6, font, color: black });
      page.drawText(`Rs. ${amount}`,   { x: xOffset + 150, y: yOffset - 100, size: 10, font, color: black });
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);

    console.log("✅ Challan PDF saved:", filePath);
    return { filePath, fileName, challanNumber };
  } catch (error) {
    console.error("❌ PDF generation error:", error);
    throw error;
  }
};

module.exports = generatePDF;
