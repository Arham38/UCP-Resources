const Course = require("../models/Course.model");


exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    let imagePath = "";

    if (req.file && req.file.filename) {
      imagePath = "/uploads/courses/" + req.file.filename;
    }

    const course = await Course.create({
      title,
      description,
      category,
      price: Number(price),
      instructor: req.user._id,
      image: imagePath,
    });

    const populated = await Course.findById(course._id).populate("instructor", "name email role");
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email role");
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email role"
    );

    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course)
        
      return res.status(404).json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString())

      return res.status(403).json({ success: false, message: "Not authorized" });

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course)

      return res.status(404).json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString())

      return res.status(403).json({ success: false, message: "Not authorized" });

    await course.deleteOne();

    res.status(200).json({ success: true, message: "Course deleted" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};