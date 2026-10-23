const express = require("express");
const { getLmsOverview, getNotificationLogs, getStudentProgressAdmin } = require("../controllers/adminLmsController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/overview", protect, authorizeRoles("admin"), getLmsOverview);
router.get("/notifications/logs", protect, authorizeRoles("admin"), getNotificationLogs);
router.get("/students/:studentId/progress", protect, authorizeRoles("admin"), getStudentProgressAdmin);

module.exports = router;
