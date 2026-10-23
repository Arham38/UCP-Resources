const Review = require("../models/Review.model");
const Course = require("../models/Course.model");
const Enrollment = require("../models/Enrollment.model");

const refreshCourseRating = async (courseId) => {
  const stats = await Review.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: "$course",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const avgRating = stats[0]?.avgRating || 0;
  const totalReviews = stats[0]?.totalReviews || 0;
  await Course.findByIdAndUpdate(courseId, {
    avgRating: Number(avgRating.toFixed(1)),
    totalReviews,
  });
};

exports.addReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    if (!courseId || !rating) {
      return res.status(400).json({ success: false, message: "courseId and rating are required" });
    }

    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment) {
      return res.status(403).json({ success: false, message: "Enroll in course before reviewing" });
    }

    const review = await Review.findOneAndUpdate(
      { student: req.user._id, course: courseId },
      { rating, comment: comment || "" },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await refreshCourseRating(review.course);

    return res.status(200).json({ success: true, review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.id })
      .populate("student", "name avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    if (review.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    await review.save();
    await refreshCourseRating(review.course);

    return res.status(200).json({ success: true, review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    const canDelete = review.student.toString() === req.user._id.toString() || req.user.role === "admin";
    if (!canDelete) return res.status(403).json({ success: false, message: "Not authorized" });

    const courseId = review.course;
    await review.deleteOne();
    await refreshCourseRating(courseId);

    return res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
