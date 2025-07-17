const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
    },
    paymentTerms: {
      type: Number,
      default: 30,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    yourReference: {
      type: String,
    },
    ourReference: {
      type: String,
    },
    language: {
      type: String,
      enum: ["en", "sv"],
      default: "sv",
    },
    currency: {
      type: String,
      default: "SEK",
    },
    items: [
      {
        product: { type: String }, // Product/service name
        text: { type: String }, // Extra description
        quantity: { type: Number, required: true },
        unit: { type: String }, // e.g., pcs, hrs
        price: { type: Number, required: true },
        vatPercent: { type: Number, default: 25 },
        discountPercent: { type: Number, default: 0 },
      },
    ],
    netTotal: {
      type: Number,
      required: true,
    },
    vatTotal: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
