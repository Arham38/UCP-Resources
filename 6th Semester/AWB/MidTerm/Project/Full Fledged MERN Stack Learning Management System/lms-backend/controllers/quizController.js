const { Quiz, QuizAttempt, QuizAssignment } = require("../models/Quiz.model");
const Course = require("../models/Course.model");
const Enrollment = require("../models/Enrollment.model");
const { createNotification } = require("./notificationController");
const logger = require("../config/logger");

// ─── Assign Quiz to Students ─────────────────────────────────────────────────
exports.assignQuizToStudents = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { studentIds, dueDate, instructions } = req.body;

    const quiz = await Quiz.findById(quizId).populate('course');
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    if (quiz.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Verify students are enrolled in the course
    const enrollments = await Enrollment.find({
      course: quiz.course._id,
      student: { $in: studentIds },
      status: 'active'
    });

    const enrolledStudentIds = enrollments.map(e => e.student.toString());
    const validStudentIds = studentIds.filter(id => enrolledStudentIds.includes(id));

    if (validStudentIds.length === 0) {
      return res.status(400).json({ success: false, message: "No valid enrolled students found" });
    }

    // Create quiz assignment
    const assignment = await QuizAssignment.create({
      quiz: quizId,
      instructor: req.user._id,
      course: quiz.course._id,
      title: `Quiz Assignment: ${quiz.title}`,
      instructions: instructions || '',
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedStudents: validStudentIds.map(studentId => ({
        student: studentId,
        dueDate: dueDate ? new Date(dueDate) : null
      }))
    });

    // Update quiz with assigned students
    quiz.assignedStudents = validStudentIds.map(studentId => ({
      student: studentId,
      dueDate: dueDate ? new Date(dueDate) : null
    }));
    await quiz.save();

    // Send notifications to students
    const io = req.app.get("io");
    for (const studentId of validStudentIds) {
      await createNotification(io, {
        recipient: studentId,
        type: "quiz_assigned",
        title: `New Quiz: ${quiz.title}`,
        message: `You have been assigned a new quiz in ${quiz.course.title}`,
        link: `/course/${quiz.course._id}/quiz/${quiz._id}`,
        metadata: { 
          quizId: quiz._id, 
          courseId: quiz.course._id,
          dueDate: dueDate,
          assignmentId: assignment._id
        }
      });
    }

    res.json({ 
      success: true, 
      assignment,
      assignedCount: validStudentIds.length,
      message: `Quiz assigned to ${validStudentIds.length} students successfully!`
    });
  } catch (error) {
    logger.error(`assignQuizToStudents: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Quiz Assignments for Instructor ─────────────────────────────────────
exports.getInstructorQuizAssignments = async (req, res) => {
  try {
    const assignments = await QuizAssignment.find({ instructor: req.user._id })
      .populate('quiz', 'title description questions')
      .populate('course', 'title')
      .populate('assignedStudents.student', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, assignments });
  } catch (error) {
    logger.error(`getInstructorQuizAssignments: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Student Quiz Assignments ────────────────────────────────────────────
exports.getStudentQuizAssignments = async (req, res) => {
  try {
    const assignments = await QuizAssignment.find({
      'assignedStudents.student': req.user._id,
      isActive: true
    })
    .populate('quiz', 'title description timeLimitMinutes passingScore maxAttempts')
    .populate('course', 'title')
    .populate('instructor', 'name');

    // Get attempt counts for each quiz
    const assignmentsWithAttempts = await Promise.all(
      assignments.map(async (assignment) => {
        const attemptCount = await QuizAttempt.countDocuments({
          quiz: assignment.quiz._id,
          student: req.user._id
        });

        const studentAssignment = assignment.assignedStudents.find(
          s => s.student.toString() === req.user._id.toString()
        );

        return {
          ...assignment.toObject(),
          attemptCount,
          dueDate: studentAssignment?.dueDate,
          completed: studentAssignment?.completed || false
        };
      })
    );

    res.json({ success: true, assignments: assignmentsWithAttempts });
  } catch (error) {
    logger.error(`getStudentQuizAssignments: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Quiz Results for Instructor ─────────────────────────────────────────
exports.getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    if (quiz.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const attempts = await QuizAttempt.find({ quiz: quizId })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    // Group attempts by student (latest attempt per student)
    const studentResults = {};
    attempts.forEach(attempt => {
      const studentId = attempt.student._id.toString();
      if (!studentResults[studentId] || attempt.createdAt > studentResults[studentId].createdAt) {
        studentResults[studentId] = attempt;
      }
    });

    const results = Object.values(studentResults);
    
    // Calculate statistics
    const stats = {
      totalStudents: results.length,
      averageScore: results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0,
      passedCount: results.filter(r => r.passed).length,
      failedCount: results.filter(r => !r.passed).length,
      highestScore: results.length > 0 ? Math.max(...results.map(r => r.score)) : 0,
      lowestScore: results.length > 0 ? Math.min(...results.map(r => r.score)) : 0
    };

    res.json({ success: true, results, stats, quiz });
  } catch (error) {
    logger.error(`getQuizResults: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Instructor: Create Quiz ──────────────────────────────────────────────────
exports.createQuiz = async (req, res) => {
  try {
    const course = await Course.findById(req.body.course);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const quizData = {
      ...req.body,
      instructor: req.user._id
    };

    const quiz = await Quiz.create(quizData);
    res.status(201).json({ success: true, quiz });
  } catch (error) {
    logger.error(`createQuiz: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Quizzes for a Course ─────────────────────────────────────────────────
exports.getCourseQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId, isPublished: true }).select(
      "-questions.correctIndex -questions.explanation"
    );
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Single Quiz (student view — no answers) ──────────────────────────────
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select(
      "-questions.correctIndex -questions.explanation"
    );
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Student: Submit Quiz ─────────────────────────────────────────────────────
exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    // Check attempt limit
    const attemptCount = await QuizAttempt.countDocuments({
      quiz: quiz._id,
      student: req.user._id,
    });
    if (attemptCount >= quiz.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${quiz.maxAttempts} attempts reached`,
      });
    }

    const { answers, startedAt } = req.body;
    let earnedPoints = 0;
    let totalPoints = 0;

    const gradedAnswers = quiz.questions.map((q, idx) => {
      totalPoints += q.points;
      const studentAnswer = answers?.find((a) => a.questionIndex === idx);
      const isCorrect = studentAnswer?.selectedIndex === q.correctIndex;
      if (isCorrect) earnedPoints += q.points;
      return {
        questionIndex: idx,
        selectedIndex: studentAnswer?.selectedIndex ?? -1,
        isCorrect,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      };
    });

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= quiz.passingScore;
    const timeTakenSeconds = startedAt
      ? Math.round((Date.now() - new Date(startedAt).getTime()) / 1000)
      : 0;

    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      student: req.user._id,
      answers: answers || [],
      score,
      totalPoints,
      earnedPoints,
      passed,
      startedAt: startedAt || new Date(),
      submittedAt: new Date(),
      timeTakenSeconds,
    });

    // Notify student of result
    const io = req.app.get("io");
    await createNotification(io, {
      recipient: req.user._id,
      type: "quiz_result",
      title: `Quiz Result: ${quiz.title}`,
      message: `You scored ${score}% — ${passed ? "Passed ✓" : "Failed ✗"}`,
      link: `/course/${quiz.course}`,
      metadata: { quizId: quiz._id, score, passed },
    });

    res.status(201).json({
      success: true,
      result: { score, earnedPoints, totalPoints, passed, timeTakenSeconds, gradedAnswers },
      attempt: attempt._id,
    });
  } catch (error) {
    logger.error(`submitQuiz: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Student: My Attempts ─────────────────────────────────────────────────────
exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      quiz: req.params.id,
      student: req.user._id,
    }).sort({ createdAt: -1 });
    res.json({ success: true, attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
