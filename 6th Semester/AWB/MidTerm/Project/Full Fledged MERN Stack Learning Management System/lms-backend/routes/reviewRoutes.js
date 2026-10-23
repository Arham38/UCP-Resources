const express = require("express");
const { addReview, getCourseReviews, updateReview, deleteReview } = require("../controllers/reviewController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("student"), addReview);
router.get("/course/:id", getCourseReviews);
router.put("/:id", protect, authorizeRoles("student"), updateReview);
router.delete("/:id", protect, authorizeRoles("student", "admin"), deleteReview);

module.exports = router;
