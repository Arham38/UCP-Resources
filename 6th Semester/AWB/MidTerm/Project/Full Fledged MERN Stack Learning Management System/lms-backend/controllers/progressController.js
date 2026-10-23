const Progress = require("../models/Progress.model");
const Lesson = require("../models/Lesson.model");
const Enrollment = require("../models/Enrollment.model");
const { createNotification } = require("./notificationController");
const logger = require("../config/logger");

// GET /api/progress/:courseId
exports.getCourseProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      student: req.user._id,
      course: req.params.courseId,
    }).populate("completedLessons", "title");

    if (!progress) {
      return res.json({ success: true, progress: null, percentage: 0 });
    }

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/progress/:courseId/lesson/:lessonId/complete
exports.markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    // Verify enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });
    if (!enrollment) {
      return res.status(403).json({ success: false, message: "Not enrolled in this course" });
    }

    // Count total lessons in course
    const totalLessons = await Lesson.countDocuments({ course: courseId });

    let progress = await Progress.findOne({ student: req.user._id, course: courseId });

    if (!progress) {
      progress = new Progress({ student: req.user._id, course: courseId });
    }

    // Add lesson if not already completed
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    progress.lastWatchedLesson = lessonId;

    // Recalculate percentage
    const completedCount = progress.completedLessons.length;
    progress.percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Mark course complete
    if (progress.percentage === 100 && !progress.completedAt) {
      progress.completedAt = new Date();
      const io = req.app.get("io");
      await createNotification(io, {
        recipient: req.user._id,
        type: "course_update",
        title: "Course Completed! 🎉",
        message: "Congratulations! You have completed the course.",
        link: `/course/${courseId}`,
      });
    }

    await progress.save();

    // Sync legacy Enrollment.progress field
    enrollment.progress = progress.percentage;
    await enrollment.save();

    res.json({ success: true, progress });
  } catch (error) {
    logger.error(`markLessonComplete: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
