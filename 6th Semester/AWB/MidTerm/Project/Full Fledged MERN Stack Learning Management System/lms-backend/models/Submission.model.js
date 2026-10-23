const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    contentType: { type: String, enum: ["assignment", "quiz", "assessment"], required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    fileUrl: { type: String, default: "" },
    textAnswer: { type: String, default: "" },
    submittedAt: { type: Date, default: Date.now },
    marksObtained: { type: Number, default: null },
    status: { type: String, enum: ["pending", "submitted", "graded"], default: "submitted" },
  },
  { timestamps: true }
);

submissionSchema.index({ student: 1, contentType: 1, contentId: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);
