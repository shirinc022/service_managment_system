const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
      required: true,
    },
    provider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Providers",
      required: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
    },
    basicAmount: {
      type: Number,
      required: true,
    },
    materialCost: {
      type: Number,
      required: true,
    },
    extraCharges: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    billStatus: {
      type: String,
      default: "Bill sent",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
