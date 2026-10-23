const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true }, // index into options array
  explanation: { type: String, default: "" },
  points: { type: Number, default: 1 },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  questionType: { type: String, enum: ['multiple-choice', 'true-false', 'fill-blank'], default: 'multiple-choice' },
});

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      default: null,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    questions: [questionSchema],
    timeLimitMinutes: { type: Number, default: 0 }, // 0 = no limit
    passingScore: { type: Number, default: 70 }, // percentage
    maxAttempts: { type: Number, default: 3 },
    isPublished: { type: Boolean, default: false },
    assignedStudents: [{
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      assignedAt: { type: Date, default: Date.now },
      dueDate: { type: Date },
      notified: { type: Boolean, default: false }
    }],
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const attemptSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [{ questionIndex: Number, selectedIndex: Number, answer: String }],
    score: { type: Number, default: 0 },       // percentage
    totalPoints: { type: Number, default: 0 },
    earnedPoints: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    timeTakenSeconds: { type: Number, default: 0 },
    feedback: { type: String, default: "" },
    detailedResults: [{
      questionIndex: Number,
      isCorrect: Boolean,
      studentAnswer: String,
      correctAnswer: String,
      explanation: String,
      points: Number,
      earnedPoints: Number
    }]
  },
  { timestamps: true }
);

// Quiz Assignment Schema for bulk assignments
const quizAssignmentSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  assignedStudents: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedAt: { type: Date, default: Date.now },
    dueDate: { type: Date },
    notified: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 }
  }],
  title: { type: String, required: true },
  instructions: { type: String, default: "" },
  dueDate: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", quizSchema);
const QuizAttempt = mongoose.model("QuizAttempt", attemptSchema);
const QuizAssignment = mongoose.model("QuizAssignment", quizAssignmentSchema);

module.exports = { Quiz, QuizAttempt, QuizAssignment };
