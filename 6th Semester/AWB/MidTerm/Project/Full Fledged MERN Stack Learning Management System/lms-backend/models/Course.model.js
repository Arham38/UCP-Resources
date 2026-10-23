const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [20, "Description must be at least 20 characters"],
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    image: {
      type: String,
      default: "",
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    academicWeightage: {
      assignment: { type: Number, min: 0, max: 100, default: 40 },
      assessment: { type: Number, min: 0, max: 100, default: 30 },
      quiz: { type: Number, min: 0, max: 100, default: 30 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);