const Enrollment = require("../models/Enrollment.model");
const Course = require("../models/Course.model");


//  Enroll in a Course (Student Only)

exports.enrollCourse = async (req, res) => {
  try {
    // support both courseId and course fields from front-end
    const courseId = req.body.courseId || req.body.course;

    const course = await Course.findById(courseId);
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

   
    const alreadyEnrolled = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (alreadyEnrolled)
      return res
        .status(400)
        .json({ success: false, message: "Already enrolled in this course" });

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
    });

    res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get Enrolled Courses (Student Only)

exports.getMyCourses = async (req, res) => {
  try {
    // populate course and the instructor inside the course
  const enrollments = await Enrollment.find({ student: req.user._id }).populate({
      path: 'course',
      populate: { path: 'instructor', select: 'name email' }
    });

    res.status(200).json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//  Update Progress (Student Only)

exports.updateProgress = async (req, res) => {
  try {
    const { courseId, progress } = req.body;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment)
      return res.status(404).json({ success: false, message: "Enrollment not found" });

    enrollment.progress = progress;
    await enrollment.save();

    res.status(200).json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};