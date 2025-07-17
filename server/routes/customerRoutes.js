// server/routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const { protect } = require("../middleware/authMiddleware");

// Protect both routes
router.route("/").post(protect, createCustomer).get(protect, getCustomers);
router
  .route("/:id")
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);

module.exports = router;
