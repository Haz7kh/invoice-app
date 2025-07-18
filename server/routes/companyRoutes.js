const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  saveCompany,
  getCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");

const router = express.Router();

router.route("/").get(protect, getCompany).post(protect, saveCompany);

router.route("/:id").put(protect, updateCompany).delete(protect, deleteCompany);

module.exports = router;
