const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    type: {
      type: String,
      enum: ["text", "system"],
      default: "text",
    },
  },
  { timestamps: true }
);

// Auto-delete messages older than 90 days
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model("Message", messageSchema);
