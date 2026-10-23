const express = require("express");
const { registerUser, loginUser, refreshToken, logoutUser, updateProfile, changePassword } = require("../controllers/authController");
const { body } = require("express-validator");
const { validateRequest } = require("../middleware/validateMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const registerValidation = [
  body("name").trim().isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["student", "instructor"]).withMessage("Invalid role"),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerValidation, validateRequest, registerUser);
router.post("/login", loginValidation, validateRequest, loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;