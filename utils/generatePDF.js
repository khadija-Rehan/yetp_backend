const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

/**
 * Fills values into an existing challan form and saves to /uploads
 * @param {Object} userData
 * @param {number} amount
 * @returns {Promise<{filePath: string, fileName: string, challanNumber: string}>}
 */
const generatePDF = async (userData, amount, userCourses) => {
  try {
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }


    console.log("userCourses", userCourses);
    

    const challanNumber = Date.now().toString().slice(-8);
    const fileName = `challan-${challanNumber}.pdf`;
    const filePath = path.join(uploadsDir, fileName);

    const templatePath = path.join(__dirname, "../", "challan.pdf");
    const existingPdfBytes = fs.readFileSync(templatePath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const color = rgb(0, 0, 0);

    // Text positions for each of the 3 challan copies
    const positions = [
      { xOffset: 350, yOffset: 320 },
      { xOffset: 80, yOffset: 320 },
      { xOffset: 620, yOffset: 320 },
    ];

    positions.forEach(({ xOffset, yOffset }) => {
      const page = pages[0];
      page.drawText(challanNumber, { x: xOffset + 145, y: yOffset + 230, size: 10, font, color });
      page.drawText(userData.fullName, { x: xOffset + 40, y: yOffset + 105, size: 10, font, color });
      page.drawText(userData.fatherName, { x: xOffset + 40, y: yOffset + 80, size: 10, font, color });
      page.drawText(userData.mobile, { x: xOffset + 40, y: yOffset + 60 , size: 10, font, color });
      page.drawText(userData.email || "-", { x: xOffset + 40, y: yOffset + 35, size: 10, font, color });


      // Add issue date in the first one
      const issueDate = new Date();
      const issueDateStr = issueDate.toLocaleDateString("en-GB"); // DD/MM/YYYY
      page.drawText(`${issueDateStr}`, { x: xOffset + 5, y: yOffset + 15, size: 10, font, color });

      // Add due date (one week from issue) in the second one
      const dueDate = new Date(issueDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const dueDateStr = dueDate.toLocaleDateString("en-GB"); // DD/MM/YYYY
      page.drawText(`${dueDateStr}`, { x: xOffset + 130, y: yOffset + 15, size: 10, font, color });

      // Draw each course, adjusting y for each
      const courseStartY = yOffset - 80;
      const courseGap = 15; // vertical gap between courses
      const coursesToShow = userCourses && userCourses.length > 0 ? userCourses : ["-"];
      coursesToShow.forEach((course, idx) => {
        const courseY = courseStartY - idx * courseGap;
        page.drawText(course, { x: xOffset + 7, y: courseY, size: 6, font, color });
        page.drawText('0', { x: xOffset + 170, y: courseY, size: 6, font, color });
      });
      // Add processing fee row
      const processingFeeY = courseStartY - coursesToShow.length * courseGap;
      page.drawText("Processing Fee", { x: xOffset + 7, y: processingFeeY, size: 6, font, color });
      page.drawText(amount.toString(), { x: xOffset + 170, y: processingFeeY, size: 6, font, color });
      page.drawText(`Rs. ${amount}`, { x: xOffset + 150, y: yOffset - 132, size: 10, font, color });
    });


    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);

    console.log("✅ PDF saved:", filePath);
    return { filePath, fileName, challanNumber };
  } catch (error) {
    console.error("❌ PDF generation error:", error);
    throw error;
  }
};

module.exports = generatePDF;
