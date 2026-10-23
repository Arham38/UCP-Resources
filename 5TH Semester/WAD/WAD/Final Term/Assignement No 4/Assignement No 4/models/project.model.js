
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: undefined, // optional
      index: true,
    },
    status: {
      type: String,
      enum: ["proposed", "completed"],
      default: "proposed",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
