const User = require("../models/User");
const Challan = require("../models/Challan");

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
      return res.status(402).json({
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
      return res.status(404).json({
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
    });
  } catch (error) {
    console.error("inquery error:", error);
    res.status(500).json({
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
      return res.status(402).json({
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
      return res.status(401).json({
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
    res.status(500).json({
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
