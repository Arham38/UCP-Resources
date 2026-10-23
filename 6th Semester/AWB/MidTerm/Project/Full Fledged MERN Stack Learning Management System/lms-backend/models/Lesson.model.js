const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    videoFile: {
      type: String,
      default: "",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
