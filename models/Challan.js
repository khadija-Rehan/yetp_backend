const mongoose = require("mongoose");

const challanSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    challanId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    branchCode: {
      type: Number,
    },
    txnId: {
      type: Number,
    },
    txnDate: {
      type: Date,
    },
    path: {
      type: String,
    },
    secondEnrollChallan: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Challan = mongoose.model("Challan", challanSchema);

module.exports = Challan;
