const User = require("../models/User");
const Challan = require("../models/Challan");
const TeleChallan = require("../models/TeleChallan");
const sendEmail = require("../utils/sendEmail");
const getPaymentConfirmationEmailHtml = require("../emailTemplates/getPaymentConfirmationEmailHtml");

exports.inquery = async (req, res) => {
  try {
    const { challanId } = req.body;

    const challan = await Challan.findOne({ challanId }).select("-path");

    if (!challan) {
      return res.status(200).json({
        message: "Challan not found",
        status: "failed",
        responseCode: 201,
        amount: null,
        challanId: null,
        fullName: null,
        cnic: null,
        mobile: null,
        fatherName: null,
      });
    }

    const user = await User.findById(challan.userId);

    if (challan.paid) {
      return res.status(200).json({
        message: "Challan is already paid",
        status: "failed",
        responseCode: 204,
        amount: null,
        challanId: null,
        fullName: null,
        cnic: null,
        mobile: null,
        fatherName: null,
      });
    }

    if (!user) {
      return res.status(200).json({
        message: "User not found",
        status: "failed",
        responseCode: 202,
        amount: null,
        challanId: null,
        fullName: null,
        cnic: null,
        mobile: null,
        fatherName: null,
      });
    }

    return res.status(200).json({
      message: "Challan found successfully",
      status: "success",
      responseCode: 200,
      amount: challan.amount.toString(),
      challanId: challan.challanId,
      fullName: user.fullName,
      cnic: user.cnic,
      mobile: user.mobile,
      fatherName: user.fatherName,
      rollNumber: user.rollNumber,
    });
  } catch (error) {
    console.error("inquery error:", error);
    res.status(200).json({
      message: error.message,
      status: "failed",
      responseCode: 203,
      amount: null,
      challanId: null,
      fullName: null,
      cnic: null,
      mobile: null,
      fatherName: null,
    });
  }
};

exports.postPay = async (req, res) => {
  try {
    const { challanId, txnId, amount, branchCode, txnDate } = req.body;

    const challan = await Challan.findOne({ challanId }).select("-path");

    if (!challan) {
      return res.status(200).json({
        message: "Challan not found",
        status: "failed",
        responseCode: 201,
        challanId: null,
        amount: null,
        branchCode: null,
        txnId: null,
      });
    }

    if (challan.paid) {
      return res.status(200).json({
        message: "Challan is already paid",
        status: "failed",
        responseCode: 204,
        challanId: null,
        amount: null,
        branchCode: null,
        txnId: null,
      });
    }
    if (challan.amount.toString() !== amount) {
      return res.status(200).json({
        message: "Amount does not match with challan amount",
        status: "failed",
        responseCode: 205,
        challanId: null,
        amount: null,
        branchCode: null,
        txnId: null,
      });
    }

    challan.paid = true;
    challan.txnId = txnId;
    challan.branchCode = branchCode;
    challan.txnDate = txnDate;
    await challan.save();

    const telechallan = await TeleChallan.findOne({
      originalChallanId: challan._id,
    });
    if (telechallan) {
      telechallan.status = "resolved";
      telechallan.challanData.paid = true;
      await telechallan.save();
    }

    // Send email notification to user
    // Send email notification to user
    try {
      const user = await User.findById(challan.userId);
      if (user && user.email) {
        await sendEmail({
          email: user.email,
          subject: "Payment Confirmation - Hunarmand",
          message: `Dear ${user.fullName},\n\nYour challan payment of PKR ${amount} has been successfully received.\n\nChallan ID: ${challanId}\nTransaction ID: ${txnId}\nDate: ${txnDate}\n\nThank you,\nHunarmand Team`,
          html: getPaymentConfirmationEmailHtml({
            fullName: user.fullName,
            challanId,
            amount,
            txnId,
            date: txnDate,
          }),
          emailType: "admissions",
        });
      }
    } catch (emailError) {
      console.error("Failed to send payment email:", emailError);
      // Continue execution, don't fail the request because of email error
    }

    return res.status(200).json({
      message: "Payment processed successfully",
      status: "success",
      code: 200,
      challanId: challan.challanId,
      amount: challan.amount.toString(),
      branchCode: challan.branchCode,
      txnId: challan.txnId,
    });
  } catch (error) {
    console.error("postPay error:", error);
    res.status(200).json({
      message: error.message,
      status: "failed",
      responseCode: 203,
      challanId: null,
      amount: null,
      branchCode: null,
      txnId: null,
    });
  }
};
