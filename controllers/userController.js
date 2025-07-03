const User = require("../models/User");
const generatePDF = require("../utils/generatePDF");
const sendEmail = require("../utils/sendEmail");
const fs = require("fs");
const Challan = require("../models/Challan");

exports.generateAndSendPDF = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = req.user;



    console.log('amount', amount);
    

    // const amount = 1000;

    const { filePath, fileName, challanNumber } = await generatePDF(
      user,
      amount
    );

    // Save challan details to database
    const challan = new Challan({
      userId: user._id,
      challanId: challanNumber,
      amount: amount,
      path: filePath,
    });
    await challan.save();

    // Send email with PDF
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your Information PDF',
    //   message: 'Please find attached your information PDF.',
    //   attachments: [{
    //     filename: fileName,
    //     path: filePath
    //   }]
    // });

    // Read the PDF file
    const pdfBuffer = fs.readFileSync(filePath);

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    console.log("pdfBuffer", pdfBuffer);

    return res.status(200).json({
      status: 'success',
      message: 'PDF generated successfully',
      data: { fileName }, // Only send this
    });

    // return res.status(200).json({
    //   message: "Challan Created successfully",
    //   status: "success",
    //   data: { pdfBuffer },
    // });
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ message: error.message });
  }
};
