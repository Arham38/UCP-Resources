const express = require("express");
const { getAllUsers, deleteUser, updateUserRole } = require("../controllers/userController");
const { getRecommendations } = require("../controllers/recommendationController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);
router.put("/users/:id/role", protect, authorizeRoles("admin"), updateUserRole);

// Recommendations for students
router.get("/recommendations", protect, authorizeRoles("student"), getRecommendations);

module.exports = router;