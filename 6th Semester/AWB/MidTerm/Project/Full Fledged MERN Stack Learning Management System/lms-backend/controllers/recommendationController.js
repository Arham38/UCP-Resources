const Course = require("../models/Course.model");
const Enrollment = require("../models/Enrollment.model");

/**
 * Simple content-based recommendation:
 * 1. Find categories the student is enrolled in
 * 2. Return courses in those categories they haven't enrolled in yet
 * 3. Fall back to popular courses if no history
 */
exports.getRecommendations = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get enrolled course IDs and their categories
    const enrollments = await Enrollment.find({ student: studentId }).populate("course", "category");
    const enrolledIds = enrollments.map((e) => e.course?._id).filter(Boolean);
    const enrolledCategories = [...new Set(enrollments.map((e) => e.course?.category).filter(Boolean))];

    let recommendations;

    if (enrolledCategories.length > 0) {
      // Courses in same categories, not yet enrolled
      recommendations = await Course.find({
        category: { $in: enrolledCategories },
        _id: { $nin: enrolledIds },
      })
        .populate("instructor", "name")
        .limit(8)
        .lean();
    }

    // If fewer than 4 results, pad with popular courses
    if (!recommendations || recommendations.length < 4) {
      const enrollmentCounts = await Enrollment.aggregate([
        { $group: { _id: "$course", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 12 },
      ]);

      const popularIds = enrollmentCounts
        .map((e) => e._id)
        .filter((id) => !enrolledIds.some((eid) => eid.toString() === id.toString()));

      const popular = await Course.find({ _id: { $in: popularIds } })
        .populate("instructor", "name")
        .limit(8)
        .lean();

      // Merge, deduplicate
      const existing = recommendations || [];
      const existingIds = new Set(existing.map((c) => c._id.toString()));
      const merged = [...existing, ...popular.filter((c) => !existingIds.has(c._id.toString()))];
      recommendations = merged.slice(0, 8);
    }

    res.json({ success: true, recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
