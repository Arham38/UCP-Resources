const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    grade: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

certificateSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Certificate", certificateSchema);
