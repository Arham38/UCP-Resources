const express = require("express");
const { getCourseProgress, markLessonComplete } = require("../controllers/progressController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorizeRoles("student"));

router.get("/:courseId", getCourseProgress);
router.post("/:courseId/lesson/:lessonId/complete", markLessonComplete);

module.exports = router;
