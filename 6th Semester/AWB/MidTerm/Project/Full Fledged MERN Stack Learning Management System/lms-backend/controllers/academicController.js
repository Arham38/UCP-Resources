const Assignment = require("../models/Assignment.model");
const Assessment = require("../models/Assessment.model");
const Announcement = require("../models/Announcement.model");
const Submission = require("../models/Submission.model");
const Result = require("../models/Result.model");
const Course = require("../models/Course.model");
const Enrollment = require("../models/Enrollment.model");
const { Quiz, QuizAttempt } = require("../models/Quiz.model");
const { createNotification } = require("./notificationController");

const DEFAULT_WEIGHTAGE = { assignment: 40, assessment: 30, quiz: 30 };

const normalizeWeightage = (raw) => {
  const assignment = Number(raw?.assignment ?? DEFAULT_WEIGHTAGE.assignment);
  const assessment = Number(raw?.assessment ?? DEFAULT_WEIGHTAGE.assessment);
  const quiz = Number(raw?.quiz ?? DEFAULT_WEIGHTAGE.quiz);
  return { assignment, assessment, quiz };
};

const getGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

const ensureInstructorOwnsCourse = async (courseId, userId) => {
  const course = await Course.findById(courseId);
  if (!course) return { error: { status: 404, message: "Course not found" } };
  if (course.instructor.toString() !== userId.toString()) {
    return { error: { status: 403, message: "Not authorized for this course" } };
  }
  return { course };
};

const notifyEnrolledStudents = async ({
  io,
  course,
  type,
  title,
  contentType,
  dueDate,
  link,
  metadata = {},
}) => {
  const enrollments = await Enrollment.find({ course: course._id }).populate("student", "_id");
  const now = new Date();
  await Promise.all(
    enrollments.map((enr) =>
      createNotification(io, {
        recipient: enr.student._id,
        type,
        title: `${contentType} posted: ${title}`,
        message: `${course.title}: ${title}${dueDate ? ` (Due: ${new Date(dueDate).toLocaleDateString()})` : ""}`,
        link,
        metadata: {
          courseName: course.title,
          contentType,
          title,
          dueDate: dueDate || null,
          timestamp: now,
          ...metadata,
        },
      })
    )
  );
};

exports.createAssignment = async (req, res) => {
  try {
    const { courseId, title, description, instructions, dueDate, totalMarks } = req.body;
    if (!courseId || !title || !dueDate || !totalMarks) {
      return res.status(400).json({ success: false, message: "courseId, title, dueDate, totalMarks are required" });
    }
    const ownership = await ensureInstructorOwnsCourse(courseId, req.user._id);
    if (ownership.error) return res.status(ownership.error.status).json({ success: false, message: ownership.error.message });

    const fileUrl = req.file ? `/uploads/submissions/${req.file.filename}` : "";
    const assignment = await Assignment.create({
      course: courseId,
      instructor: req.user._id,
      title,
      description: description || "",
      instructions: instructions || "",
      dueDate,
      totalMarks: Number(totalMarks),
      fileUrl,
    });

    await notifyEnrolledStudents({
      io: req.app.get("io"),
      course: ownership.course,
      type: "assignment",
      title: assignment.title,
      contentType: "Assignment",
      dueDate: assignment.dueDate,
      link: `/student/course/${courseId}`,
      metadata: { assignmentId: assignment._id },
    });

    return res.status(201).json({ success: true, assignment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAssessment = async (req, res) => {
  try {
    const { courseId, title, description, dueDate, totalMarks } = req.body;
    if (!courseId || !title || !dueDate || !totalMarks) {
      return res.status(400).json({ success: false, message: "courseId, title, dueDate, totalMarks are required" });
    }
    const ownership = await ensureInstructorOwnsCourse(courseId, req.user._id);
    if (ownership.error) return res.status(ownership.error.status).json({ success: false, message: ownership.error.message });

    const assessment = await Assessment.create({
      course: courseId,
      instructor: req.user._id,
      title,
      description: description || "",
      dueDate,
      totalMarks: Number(totalMarks),
    });

    await notifyEnrolledStudents({
      io: req.app.get("io"),
      course: ownership.course,
      type: "assessment",
      title: assessment.title,
      contentType: "Assessment",
      dueDate: assessment.dueDate,
      link: `/student/course/${courseId}`,
      metadata: { assessmentId: assessment._id },
    });

    return res.status(201).json({ success: true, assessment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { courseId, title, body, priority } = req.body;
    if (!courseId || !title || !body) {
      return res.status(400).json({ success: false, message: "courseId, title, body are required" });
    }
    const ownership = await ensureInstructorOwnsCourse(courseId, req.user._id);
    if (ownership.error) return res.status(ownership.error.status).json({ success: false, message: ownership.error.message });

    const announcement = await Announcement.create({
      course: courseId,
      instructor: req.user._id,
      title,
      body,
      priority: priority || "normal",
    });

    await notifyEnrolledStudents({
      io: req.app.get("io"),
      course: ownership.course,
      type: "announcement",
      title: announcement.title,
      contentType: "Announcement",
      link: `/student/course/${courseId}`,
      metadata: { announcementId: announcement._id, priority: announcement.priority },
    });

    return res.status(201).json({ success: true, announcement });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseAcademicContent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (req.user.role === "student") {
      const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
      if (!enrollment) return res.status(403).json({ success: false, message: "Not enrolled in this course" });
    } else if (req.user.role === "instructor" && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized for this course" });
    }

    const [assignments, assessments, announcements, quizzes] = await Promise.all([
      Assignment.find({ course: courseId }).sort({ createdAt: -1 }),
      Assessment.find({ course: courseId }).sort({ createdAt: -1 }),
      Announcement.find({ course: courseId }).sort({ createdAt: -1 }),
      Quiz.find({ course: courseId }).sort({ createdAt: -1 }).select("title dueDate timeLimitMinutes totalMarks createdAt"),
    ]);

    return res.status(200).json({
      success: true,
      assignments,
      assessments,
      announcements,
      quizzes,
      academicWeightage: normalizeWeightage(course.academicWeightage),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCourseWeightage = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { assignment, assessment, quiz } = req.body;
    const ownership = await ensureInstructorOwnsCourse(courseId, req.user._id);
    if (ownership.error) return res.status(ownership.error.status).json({ success: false, message: ownership.error.message });

    const nextWeightage = normalizeWeightage({ assignment, assessment, quiz });
    const values = Object.values(nextWeightage);
    if (values.some((v) => !Number.isFinite(v) || v < 0 || v > 100)) {
      return res.status(400).json({ success: false, message: "Weightage values must be numbers between 0 and 100" });
    }
    const sum = Number((nextWeightage.assignment + nextWeightage.assessment + nextWeightage.quiz).toFixed(2));
    if (sum !== 100) {
      return res.status(400).json({ success: false, message: "Total course weightage must be exactly 100%" });
    }

    ownership.course.academicWeightage = nextWeightage;
    await ownership.course.save();
    return res.status(200).json({ success: true, academicWeightage: nextWeightage });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitContent = async (req, res) => {
  try {
    const { contentType, contentId, textAnswer } = req.body;
    if (!contentType || !contentId || !["assignment", "assessment"].includes(contentType)) {
      return res.status(400).json({ success: false, message: "contentType (assignment/assessment) and contentId are required" });
    }

    const Model = contentType === "assignment" ? Assignment : Assessment;
    const content = await Model.findById(contentId).populate("course", "title instructor");
    if (!content) return res.status(404).json({ success: false, message: "Content not found" });

    const enrollment = await Enrollment.findOne({ student: req.user._id, course: content.course._id });
    if (!enrollment) return res.status(403).json({ success: false, message: "Not enrolled in this course" });

    const previousSubmission = await Submission.findOne({ student: req.user._id, contentType, contentId });
    const fileUrl = req.file
      ? `/uploads/submissions/${req.file.filename}`
      : (previousSubmission?.fileUrl || "");
    const normalizedTextAnswer = typeof textAnswer === "string" ? textAnswer.trim() : "";
    const finalTextAnswer = normalizedTextAnswer || (previousSubmission?.textAnswer || "");
    const submission = await Submission.findOneAndUpdate(
      { student: req.user._id, contentType, contentId },
      {
        student: req.user._id,
        course: content.course._id,
        contentType,
        contentId,
        fileUrl,
        textAnswer: finalTextAnswer,
        submittedAt: new Date(),
        status: "submitted",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await createNotification(req.app.get("io"), {
      recipient: content.instructor,
      type: "course_update",
      title: `New ${contentType} submission`,
      message: `${req.user.name} submitted ${content.title} (${content.course.title})`,
      link: `/instructor/dashboard`,
      metadata: { contentType, contentId, submissionId: submission._id, courseId: content.course._id },
    });

    return res.status(201).json({ success: true, submission });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marksObtained } = req.body;
    const submission = await Submission.findById(submissionId);
    if (!submission) return res.status(404).json({ success: false, message: "Submission not found" });

    const course = await Course.findById(submission.course);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    if (req.user.role !== "instructor" || course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const parsedMarks = Number(marksObtained);
    if (!Number.isFinite(parsedMarks)) {
      return res.status(400).json({ success: false, message: "marksObtained must be a valid number" });
    }

    let maxMarks = null;
    if (submission.contentType === "assignment") {
      const assignment = await Assignment.findById(submission.contentId).select("totalMarks");
      if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found for this submission" });
      maxMarks = Number(assignment.totalMarks || 0);
    } else if (submission.contentType === "assessment") {
      const assessment = await Assessment.findById(submission.contentId).select("totalMarks");
      if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found for this submission" });
      maxMarks = Number(assessment.totalMarks || 0);
    }

    if (maxMarks !== null && (parsedMarks < 0 || parsedMarks > maxMarks)) {
      return res.status(400).json({ success: false, message: `Marks must be between 0 and ${maxMarks}` });
    }

    submission.marksObtained = Math.max(0, parsedMarks);
    submission.status = "graded";
    await submission.save();

    await createNotification(req.app.get("io"), {
      recipient: submission.student,
      type: "course_update",
      title: "Submission graded",
      message: `Your ${submission.contentType} submission has been graded.`,
      link: `/student/dashboard`,
      metadata: { submissionId: submission._id, marksObtained: submission.marksObtained },
    });

    return res.status(200).json({ success: true, submission });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateResultSheet = async (req, res) => {
  try {
    const { courseId } = req.params;
    const ownership = await ensureInstructorOwnsCourse(courseId, req.user._id);
    if (ownership.error) return res.status(ownership.error.status).json({ success: false, message: ownership.error.message });

    const [enrollments, assignments, assessments, quizzes, courseDoc] = await Promise.all([
      Enrollment.find({ course: courseId }).populate("student", "name email"),
      Assignment.find({ course: courseId }).select("title totalMarks"),
      Assessment.find({ course: courseId }).select("title totalMarks"),
      Quiz.find({ course: courseId }).select("title questions"),
      Course.findById(courseId).select("academicWeightage"),
    ]);
    const courseWeightage = normalizeWeightage(courseDoc?.academicWeightage);

    const assignmentMap = new Map(assignments.map((a) => [String(a._id), a]));
    const assessmentMap = new Map(assessments.map((a) => [String(a._id), a]));
    const quizMap = new Map(
      quizzes.map((q) => [String(q._id), { title: q.title, totalMarks: (q.questions || []).reduce((s, qq) => s + Number(qq.points || 1), 0) }])
    );

    const courseResults = [];

    for (const enr of enrollments) {
      const [submissions, attempts] = await Promise.all([
        Submission.find({ student: enr.student._id, course: courseId, status: "graded" }),
        QuizAttempt.find({ student: enr.student._id }).populate({ path: "quiz", select: "course title questions" }),
      ]);

      const evalRows = [];
      let totalPossible = 0;
      let totalObtained = 0;
      const bucket = {
        assignment: { obtained: 0, possible: 0 },
        assessment: { obtained: 0, possible: 0 },
        quiz: { obtained: 0, possible: 0 },
      };

      submissions.forEach((sub) => {
        const lookup = sub.contentType === "assignment" ? assignmentMap : assessmentMap;
        const item = lookup.get(String(sub.contentId));
        if (!item) return;
        const maxMarks = Number(item.totalMarks || 0);
        const obtainedMarks = Math.min(maxMarks, Math.max(0, Number(sub.marksObtained || 0)));
        totalPossible += maxMarks;
        totalObtained += obtainedMarks;
        if (bucket[sub.contentType]) {
          bucket[sub.contentType].possible += maxMarks;
          bucket[sub.contentType].obtained += obtainedMarks;
        }
        evalRows.push({
          title: item.title,
          contentType: sub.contentType,
          contentId: sub.contentId,
          maxMarks,
          obtainedMarks,
        });
      });

      attempts.forEach((att) => {
        if (!att.quiz || String(att.quiz.course) !== String(courseId)) return;
        const q = quizMap.get(String(att.quiz._id));
        if (!q) return;
        const maxMarks = Number(q.totalMarks || 0);
        const obtainedMarks = Math.min(maxMarks, Math.max(0, Number(att.earnedPoints || 0)));
        totalPossible += maxMarks;
        totalObtained += obtainedMarks;
        bucket.quiz.possible += maxMarks;
        bucket.quiz.obtained += obtainedMarks;
        evalRows.push({
          title: q.title,
          contentType: "quiz",
          contentId: att.quiz._id,
          maxMarks,
          obtainedMarks,
        });
      });

      const assignmentPct = bucket.assignment.possible > 0 ? (bucket.assignment.obtained / bucket.assignment.possible) * 100 : 0;
      const assessmentPct = bucket.assessment.possible > 0 ? (bucket.assessment.obtained / bucket.assessment.possible) * 100 : 0;
      const quizPct = bucket.quiz.possible > 0 ? (bucket.quiz.obtained / bucket.quiz.possible) * 100 : 0;
      const weightedScore =
        (assignmentPct * (courseWeightage.assignment / 100)) +
        (assessmentPct * (courseWeightage.assessment / 100)) +
        (quizPct * (courseWeightage.quiz / 100));
      const percentage = Number(Math.min(100, Math.max(0, weightedScore)).toFixed(1));
      const grade = getGrade(percentage);

      const result = await Result.findOneAndUpdate(
        { student: enr.student._id, course: courseId },
        {
          student: enr.student._id,
          course: courseId,
          instructor: req.user._id,
          evaluations: evalRows,
          totalPossible,
          totalObtained,
          percentage,
          grade,
        },
        { new: true, upsert: true }
      ).populate("student", "name email");

      courseResults.push(result);
    }

    return res.status(200).json({ success: true, results: courseResults, academicWeightage: courseWeightage });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendResultsToStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const ownership = await ensureInstructorOwnsCourse(courseId, req.user._id);
    if (ownership.error) return res.status(ownership.error.status).json({ success: false, message: ownership.error.message });

    const results = await Result.find({ course: courseId });
    const now = new Date();
    await Promise.all(
      results.map(async (r) => {
        r.sentAt = now;
        await r.save();
        await createNotification(req.app.get("io"), {
          recipient: r.student,
          type: "result_published",
          title: `Result published: ${ownership.course.title}`,
          message: `Your result for ${ownership.course.title} is published. Grade: ${r.grade}`,
          link: `/student/progress`,
          metadata: { courseId, resultId: r._id, grade: r.grade },
        });
      })
    );

    return res.status(200).json({ success: true, message: "Results sent to students" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyProgress = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate("course", "title instructor");
    const courseIds = enrollments.map((e) => e.course?._id).filter(Boolean);

    const [submissions, results] = await Promise.all([
      Submission.find({ student: req.user._id, course: { $in: courseIds } }),
      Result.find({ student: req.user._id, course: { $in: courseIds } }),
    ]);

    const byCourse = {};
    enrollments.forEach((enr) => {
      const cid = String(enr.course._id);
      byCourse[cid] = {
        course: enr.course,
        enrollmentProgress: enr.progress || 0,
        submissions: [],
        result: null,
      };
    });

    submissions.forEach((s) => {
      const cid = String(s.course);
      if (byCourse[cid]) byCourse[cid].submissions.push(s);
    });

    results.forEach((r) => {
      const cid = String(r.course);
      if (byCourse[cid]) byCourse[cid].result = r;
    });

    return res.status(200).json({ success: true, courses: Object.values(byCourse) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseSubmissionsForInstructor = async (req, res) => {
  try {
    const { courseId } = req.params;
    const ownership = await ensureInstructorOwnsCourse(courseId, req.user._id);
    if (ownership.error) return res.status(ownership.error.status).json({ success: false, message: ownership.error.message });

    const submissions = await Submission.find({ course: courseId })
      .populate("student", "name email")
      .sort({ submittedAt: -1 });

    const [assignments, assessments] = await Promise.all([
      Assignment.find({ course: courseId }).select("_id title totalMarks"),
      Assessment.find({ course: courseId }).select("_id title totalMarks"),
    ]);
    const assignmentMap = new Map(assignments.map((a) => [String(a._id), a]));
    const assessmentMap = new Map(assessments.map((a) => [String(a._id), a]));

    const enriched = submissions.map((s) => {
      const base = s.toObject();
      const source = s.contentType === "assignment" ? assignmentMap.get(String(s.contentId)) : assessmentMap.get(String(s.contentId));
      return {
        ...base,
        contentTitle: source?.title || "",
        totalMarks: Number(source?.totalMarks || 0),
      };
    });

    return res.status(200).json({ success: true, submissions: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
