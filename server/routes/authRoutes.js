// server/routes/authRoutes.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);
router.put("/me", protect, updateUser);
router.delete("/me", protect, deleteUser);

module.exports = router;
