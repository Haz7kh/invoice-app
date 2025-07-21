// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    unit: { type: String, required: true },
    productCode: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    tax: { type: Number, required: true },
    priceInclTax: { type: Number },
    isGreenTech: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Optional: calculate priceInclTax if not provided
productSchema.pre("save", function (next) {
  if (!this.priceInclTax && this.price && this.tax) {
    this.priceInclTax = this.price * (1 + this.tax / 100);
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
