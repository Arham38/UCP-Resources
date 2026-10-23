const crypto = require("crypto");
const Certificate = require("../models/Certificate.model");
const Progress = require("../models/Progress.model");
const Course = require("../models/Course.model");

exports.generateCertificate = async (req, res) => {
  try {
    const { courseId, grade } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const progress = await Progress.findOne({ student: req.user._id, course: courseId });
    if (!progress || Number(progress.percentage || 0) < 100) {
      return res.status(400).json({ success: false, message: "Course is not completed yet" });
    }

    const existing = await Certificate.findOne({ student: req.user._id, course: courseId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Certificate already exists",
        certificate: existing,
      });
    }

    const certificate = await Certificate.create({
      student: req.user._id,
      course: courseId,
      certificateId: crypto.randomUUID(),
      grade: grade || "",
    });

    const populated = await Certificate.findById(certificate._id)
      .populate("student", "name email")
      .populate({ path: "course", select: "title instructor", populate: { path: "instructor", select: "name" } });

    return res.status(201).json({
      success: true,
      message: "Certificate generated successfully",
      certificate: populated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate({ path: "course", select: "title instructor", populate: { path: "instructor", select: "name" } })
      .sort({ issuedAt: -1 });

    return res.status(200).json({ success: true, certificates });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const certificateId = req.params.certificateId || req.params.id;
    const certificate = await Certificate.findOne({ certificateId })
      .populate("student", "name")
      .populate({ path: "course", select: "title instructor", populate: { path: "instructor", select: "name" } });

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Invalid certificate ID" });
    }

    return res.status(200).json({ success: true, certificate });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
