const Wishlist = require("../models/Wishlist.model");
const Course = require("../models/Course.model");

exports.addToWishlist = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ success: false, message: "courseId is required" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const wishlist = await Wishlist.findOneAndUpdate(
      { student: req.user._id },
      { $addToSet: { courses: courseId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate({ path: "courses", populate: { path: "instructor", select: "name email" } });

    return res.status(200).json({ success: true, courses: wishlist.courses || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ success: false, message: "courseId is required" });

    const wishlist = await Wishlist.findOneAndUpdate(
      { student: req.user._id },
      { $pull: { courses: courseId } },
      { new: true }
    ).populate({ path: "courses", populate: { path: "instructor", select: "name email" } });

    return res.status(200).json({ success: true, courses: wishlist?.courses || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ student: req.user._id }).populate({
      path: "courses",
      populate: { path: "instructor", select: "name email" },
    });
    return res.status(200).json({ success: true, courses: wishlist?.courses || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
