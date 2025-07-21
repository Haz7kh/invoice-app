const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  createInvoice,
  getInvoices,
} = require("../controllers/invoiceController");

// Protect all routes with `protect` middleware
router
  .route("/")
  .post(protect, createInvoice) // Create new invoice
  .get(protect, getInvoices); // List all user invoices

module.exports = router;
