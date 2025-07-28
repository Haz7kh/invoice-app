const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["product", "text"], default: "product" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productCode: { type: String },
    product: { type: String }, // snapshot
    text: { type: String },
    quantity: { type: Number },
    unit: { type: String },
    price: { type: Number },
    vatPercent: { type: Number, default: 25 },
    discountPercent: { type: Number, default: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    companyFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    invoiceNumber: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, required: true },
    paymentTerms: { type: Number, default: 30 },
    dueDate: { type: Date, required: true },
    yourReference: { type: String },
    ourReference: { type: String },
    language: { type: String, enum: ["en", "sv"], default: "sv" },
    currency: { type: String, default: "SEK" },
    items: [invoiceItemSchema],
    netTotal: { type: Number, required: true },
    vatTotal: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

const formatDate = (date) => (date ? date.toISOString().split("T")[0] : null);

invoiceSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.invoiceDate) ret.invoiceDate = formatDate(ret.invoiceDate);
    if (ret.dueDate) ret.dueDate = formatDate(ret.dueDate);
    if (ret.createdAt) ret.createdAt = formatDate(ret.createdAt);
    if (ret.updatedAt) ret.updatedAt = formatDate(ret.updatedAt);
    return ret;
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
