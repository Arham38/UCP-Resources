const express = require("express");
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const {
  createLesson,
  getLessonsByCourse,
} = require("../controllers/lessonController");
const { protect, optionalAuth, authorizeRoles } = require("../middleware/authMiddleware");
const { uploadCourseImage, uploadLessonVideo } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getCourses);
router.get("/:courseId/lessons", optionalAuth, getLessonsByCourse);
router.post("/:courseId/lessons", protect, authorizeRoles("instructor"), (req, res, next) => {
  uploadLessonVideo(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message || "Video upload failed" });
    next();
  });
}, createLesson);
router.get("/:id", getCourseById);
router.post("/", protect, authorizeRoles("instructor"), (req, res, next) => {
  uploadCourseImage(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message || "Image upload failed" });
    next();
  });
}, createCourse);
router.put("/:id", protect, authorizeRoles("instructor"), updateCourse);
router.delete("/:id", protect, authorizeRoles("instructor"), deleteCourse);

module.exports = router;