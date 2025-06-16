const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

/**
 * Generates a user challan PDF and saves it to /uploads
 * @param {Object} userData
 * @returns {Promise<{filePath: string, fileName: string, challanNumber: string}>}
 */
const generatePDF = async (userData, amount) => {
  // return new Promise((resolve, reject) => {
    try {
      const uploadsDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate 8-digit challan number from timestamp
      const challanNumber = Date.now().toString().slice(-8);
      const fileName = `challan-${challanNumber}.pdf`;
      const filePath = path.join(uploadsDir, fileName);

      const doc = new PDFDocument({
        size: "A4",
        layout: "portrait",
        margin: 20,
      });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const colWidth = 180;
      const startY = 20;

      const drawColumn = (x, userData) => {
        let y = startY;
        const labelX = x + 10;
        const valueWidth = colWidth / 2 - 15;
        const valueX = x + colWidth / 2 + 5;

        doc.rect(x, y, colWidth, 800).stroke();

        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text("Hunarmand Punjab", x + 10, y + 5, {
            width: colWidth - 20,
            align: "center",
          });
        doc.fontSize(8).text(`Challan # ${challanNumber}`, x + 10, y + 19, {
          width: colWidth - 20,
          align: "center",
        });

        y += 33;
        doc.fontSize(8).font("Helvetica");

        const printField = (label, value) => {
          doc.text(label, labelX, y, { width: valueWidth });
          doc.text(value, valueX, y, { width: valueWidth, align: "right" });
          y += 13;
        };

        printField("Name:", userData.fullName);
        printField("CNIC:", userData.cnic);
        printField("Father Name:", userData.fatherName);
        printField("Mobile:", userData.mobile);

        y += 20;
        printField("Deposit Amount:", `Rs. ${amount}`);
        y += 20;
        printField("Branch:", "_____________");
        printField("Code:", "____________");
        printField("Date:", "____________");
        printField("Applicant Signature:", "______________");

        y += 40;

      };

      const columnX = [20, 220, 420];
      columnX.forEach((x) => drawColumn(x, userData));

      doc.end();

      await new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
      });
  
      console.log("✅ PDF saved:", filePath);
      return { filePath, fileName, challanNumber };
    } catch (error) {
      console.error("❌ PDF generation error:", error);
      reject(error);
    }
  // });
};

module.exports = generatePDF;
