const Lesson = require("../models/Lesson.model");
const Course = require("../models/Course.model");

exports.createLesson = async (req, res) => {
  try {
    const courseId = req.params.courseId || req.params.id;
    const { title, description, videoUrl } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to add lessons" });
    }

    let videoFile = "";
    if (req.file && req.file.filename) {
      videoFile = "/uploads/lessons/" + req.file.filename;
    }

    const lesson = await Lesson.create({
      title,
      description: description || "",
      videoUrl: videoUrl || "",
      videoFile,
      course: courseId,
    });

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLessonsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId || req.params.id;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // If user is authenticated, check authorization
    if (req.user) {
      // Admins can see all lessons
      if (req.user.role === 'admin') {
        const lessons = await Lesson.find({ course: courseId }).sort({ createdAt: 1 });
        return res.status(200).json({ success: true, lessons });
      }

      // Instructors can see lessons for their own courses
      if (req.user.role === 'instructor' && course.instructor.toString() === req.user._id.toString()) {
        const lessons = await Lesson.find({ course: courseId }).sort({ createdAt: 1 });
        return res.status(200).json({ success: true, lessons });
      }

      // Students must be enrolled to see lessons
      if (req.user.role === 'student') {
        const Enrollment = require('../models/Enrollment.model');
        const enrollment = await Enrollment.findOne({
          student: req.user._id,
          course: courseId
        });

        if (!enrollment) {
          return res.status(403).json({ 
            success: false, 
            message: "You must be enrolled in this course to view lessons" 
          });
        }

        const lessons = await Lesson.find({ course: courseId }).sort({ createdAt: 1 });
        return res.status(200).json({ success: true, lessons });
      }
    }

    // For unauthenticated users, return empty array or basic info only
    // This allows the course details page to load, but no lesson content
    res.status(200).json({ success: true, lessons: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course");
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }
    if (lesson.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this lesson" });
    }
    await Lesson.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Lesson deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
