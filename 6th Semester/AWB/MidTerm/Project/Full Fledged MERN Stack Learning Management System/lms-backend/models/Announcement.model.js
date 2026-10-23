const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    priority: { type: String, enum: ["normal", "urgent"], default: "normal" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
