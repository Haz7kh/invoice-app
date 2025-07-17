const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  saveCompany,
  getCompany,
  deleteCompany,
  updateCompany,
} = require("../controllers/companyController");

router.route("/").post(protect, saveCompany).get(protect, getCompany);

router.route("/:id").put(protect, updateCompany).delete(protect, deleteCompany);

module.exports = router;
