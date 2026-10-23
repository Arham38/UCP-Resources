const express = require("express");
const {
  createAssignment,
  createAssessment,
  createAnnouncement,
  getCourseAcademicContent,
  submitContent,
  gradeSubmission,
  generateResultSheet,
  sendResultsToStudents,
  getMyProgress,
  getCourseSubmissionsForInstructor,
  updateCourseWeightage,
} = require("../controllers/academicController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { uploadSubmissionFile } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/assignments", protect, authorizeRoles("instructor"), (req, res, next) => {
  uploadSubmissionFile(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message || "File upload failed" });
    next();
  });
}, createAssignment);
router.post("/assessments", protect, authorizeRoles("instructor"), createAssessment);
router.post("/announcements", protect, authorizeRoles("instructor"), createAnnouncement);
router.get("/course/:courseId/content", protect, authorizeRoles("student", "instructor", "admin"), getCourseAcademicContent);
router.post("/submissions", protect, authorizeRoles("student"), (req, res, next) => {
  uploadSubmissionFile(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message || "File upload failed" });
    next();
  });
}, submitContent);
router.put("/submissions/:submissionId/grade", protect, authorizeRoles("instructor"), gradeSubmission);
router.get("/course/:courseId/submissions", protect, authorizeRoles("instructor"), getCourseSubmissionsForInstructor);
router.put("/course/:courseId/weightage", protect, authorizeRoles("instructor"), updateCourseWeightage);
router.post("/course/:courseId/results/generate", protect, authorizeRoles("instructor"), generateResultSheet);
router.post("/course/:courseId/results/send", protect, authorizeRoles("instructor"), sendResultsToStudents);
router.get("/my-progress", protect, authorizeRoles("student"), getMyProgress);

module.exports = router;
