const User = require("../models/User.model");
const Course = require("../models/Course.model");
const Enrollment = require("../models/Enrollment.model");
const Result = require("../models/Result.model");
const Notification = require("../models/Notification.model");
const Submission = require("../models/Submission.model");

exports.getLmsOverview = async (req, res) => {
  try {
    const [students, instructors, courses, enrollments, passCount, failCount, recentNotifications] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "instructor" }),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Result.countDocuments({ grade: { $ne: "F" } }),
      Result.countDocuments({ grade: "F" }),
      Notification.find().sort({ createdAt: -1 }).limit(20),
    ]);

    return res.status(200).json({
      success: true,
      stats: { students, instructors, courses, enrollments, passCount, failCount },
      recentActivity: recentNotifications,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotificationLogs = async (req, res) => {
  try {
    const { type, courseId, from, to } = req.query;
    const query = {};
    if (type) query.type = type;
    if (courseId) query["metadata.courseId"] = courseId;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(500);
    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentProgressAdmin = async (req, res) => {
  try {
    const { studentId } = req.params;
    const [student, enrollments, submissions, results] = await Promise.all([
      User.findById(studentId).select("name email role"),
      Enrollment.find({ student: studentId }).populate("course", "title"),
      Submission.find({ student: studentId }).sort({ submittedAt: -1 }),
      Result.find({ student: studentId }).populate("course", "title"),
    ]);
    if (!student || student.role !== "student") {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    return res.status(200).json({ success: true, student, enrollments, submissions, results });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
