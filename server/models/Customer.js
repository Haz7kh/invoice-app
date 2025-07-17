// server/models/Customer.js
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["company", "person"],
      required: true,
    },
    companyName: {
      type: String,
    },
    orgNumber: {
      type: String,
    },
    vatNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    sendBy: {
      type: [String],
      enum: ["email", "sms", "letter", "einvoice"],
      default: ["email"],
    },
    attachPdf: {
      type: Boolean,
      default: false,
    },
    billingAddress: {
      co: { type: String },
      address: { type: String },
      zip: { type: String },
      city: { type: String },
      country: { type: String, default: "Sweden" },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
