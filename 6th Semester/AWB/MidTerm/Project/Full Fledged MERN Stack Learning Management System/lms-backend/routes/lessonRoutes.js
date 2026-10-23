const express = require("express");
const { deleteLesson } = require("../controllers/lessonController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.delete("/:id", protect, authorizeRoles("instructor"), deleteLesson);

module.exports = router;
