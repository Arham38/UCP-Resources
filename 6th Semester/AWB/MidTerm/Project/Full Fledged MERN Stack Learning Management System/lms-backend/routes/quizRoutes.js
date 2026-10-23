const express = require("express");
const {
  createQuiz,
  getCourseQuizzes,
  getQuiz,
  submitQuiz,
  getMyAttempts,
  assignQuizToStudents,
  getInstructorQuizAssignments,
  getStudentQuizAssignments,
  getQuizResults,
} = require("../controllers/quizController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// Student routes
router.get("/course/:courseId", getCourseQuizzes);
router.get("/assignments/student", authorizeRoles("student"), getStudentQuizAssignments);
router.get("/:id", getQuiz);
router.get("/:id/attempts", authorizeRoles("student"), getMyAttempts);
router.post("/:id/submit", authorizeRoles("student"), submitQuiz);

// Instructor routes
router.post("/", authorizeRoles("instructor"), createQuiz);
router.post("/:quizId/assign", authorizeRoles("instructor"), assignQuizToStudents);
router.get("/assignments/instructor", authorizeRoles("instructor"), getInstructorQuizAssignments);
router.get("/:quizId/results", authorizeRoles("instructor"), getQuizResults);

module.exports = router;
