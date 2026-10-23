const mongoose = require("mongoose");

const resultItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    contentType: { type: String, enum: ["assignment", "quiz", "assessment"], required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    maxMarks: { type: Number, required: true, min: 1 },
    obtainedMarks: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    evaluations: [resultItemSchema],
    totalPossible: { type: Number, required: true },
    totalObtained: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, required: true },
    sentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

resultSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);
