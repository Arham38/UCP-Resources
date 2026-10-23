const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const coursesDir = path.join(__dirname, "../uploads/courses");
const lessonsDir = path.join(__dirname, "../uploads/lessons");
const submissionsDir = path.join(__dirname, "../uploads/submissions");

[path.join(__dirname, "../uploads"), coursesDir, lessonsDir, submissionsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Course image storage
const courseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, coursesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `course-${uniqueSuffix}${ext}`);
  },
});

// Lesson video storage
const lessonStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, lessonsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".mp4";
    cb(null, `lesson-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|webm|ogg|mov/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const isImage = allowedImageTypes.test(ext);
  const isVideo = allowedVideoTypes.test(ext);
  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Images: jpg, png, gif, webp. Videos: mp4, webm, ogg."), false);
  }
};

exports.uploadCourseImage = multer({
  storage: courseStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowedImageTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid image type. Use jpg, png, gif, or webp."), false);
    }
  },
}).single("image");

exports.uploadLessonVideo = multer({
  storage: lessonStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowedVideoTypes = /mp4|webm|ogg|mov/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowedVideoTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid video type. Use mp4, webm, ogg, or mov."), false);
    }
  },
}).single("videoFile");

const submissionStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, submissionsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".pdf";
    cb(null, `submission-${uniqueSuffix}${ext}`);
  },
});

exports.uploadSubmissionFile = multer({
  storage: submissionStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowedTypes.test(ext)) cb(null, true);
    else cb(new Error("Invalid file type. Use PDF, DOC, or DOCX."), false);
  },
}).single("file");
