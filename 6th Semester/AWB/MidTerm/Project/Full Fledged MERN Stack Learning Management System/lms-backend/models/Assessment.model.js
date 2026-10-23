const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    dueDate: { type: Date, required: true },
    totalMarks: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", assessmentSchema);
