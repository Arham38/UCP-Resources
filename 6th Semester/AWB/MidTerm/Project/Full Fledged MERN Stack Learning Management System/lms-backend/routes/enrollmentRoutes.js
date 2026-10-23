const express = require("express");
const {
  enrollCourse,
  getMyCourses,
  updateProgress,
} = require("../controllers/enrollmentController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/enroll", protect, authorizeRoles("student"), enrollCourse);
router.get("/my-courses", protect, authorizeRoles("student"), getMyCourses);
router.put("/progress", protect, authorizeRoles("student"), updateProgress);

module.exports = router;