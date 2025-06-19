const User = require("../models/User");
const Challan = require("../models/Challan");

exports.inquery = async (req, res) => {
  try {
    const { challanId } = req.body;

    const challan = await Challan.findOne({ challanId }).select('-path');

    if (!challan) {
      return res.status(404).json({
        message: "Challan not found",
        status: "failed",
      });
    }

    const user = await User.findById(challan.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "failed",
      });
    }

    return res.status(200).json({
      message: "Challan found successfully",
      status: "success",
      data: {
        challan,
        user: {
          fullName: user.fullName,
          cnic: user.cnic,
          mobile: user.mobile,
          fatherName: user.fatherName,
        },
      },
    });
  } catch (error) {
    console.error("inquery error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.postPay = async (req, res) => {
  try {
    const { challanId, txnId, amount, branchCode, txnDate } = req.body;

    const challan = await Challan.findOne({ challanId }).select('-path');

    if (!challan) {
      return res.status(400).json({
        message: "Challan not found",
        status: "failed",
      });
    }

    if (challan.paid) {
      return res.status(402).json({
        message: "Challan is already paid",
        status: "failed",
      });
    }
    if (challan.amount !== amount) {
      return res.status(401).json({
        message: "Amount does not match with challan amount",
        status: "failed",
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
      data: challan,
    });
  } catch (error) {
    console.error("postPay error:", error);
    res.status(500).json({ message: error.message });
  }
};
