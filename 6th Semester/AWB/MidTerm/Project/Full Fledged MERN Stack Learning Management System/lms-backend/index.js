const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

dotenv.config();

const db = require("./config/db");
const logger = require("./config/logger");

const app = express();

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // needed for refresh token cookie
  })
);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── HTTP Request Logging (Morgan → Winston) ──────────────────────────────────
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.http(msg.trim()) },
    skip: (req) => req.url === "/health",
  })
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter for auth endpoints
  message: { success: false, message: "Too many auth attempts, please try again later." },
});

app.use(globalLimiter);

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Fallback for missing images ──────────────────────────────────────────────
app.use("/uploads", (req, res) => {
  logger.warn(`Missing file requested: ${req.path}`);
  res.status(404).json({ success: false, message: "File not found" });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/lessons", require("./routes/lessonRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/quizzes", require("./routes/quizRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/academic", require("./routes/academicRoutes"));
app.use("/api/admin/lms", require("./routes/adminLmsRoutes"));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

app.get("/", (req, res) => res.send("LMS Backend Running Successfully!"));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method}`);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Server Error" : err.message,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});

// Socket.io setup (real-time chat)
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Attach io to app so controllers can emit events
app.set("io", io);

require("./socket/chatSocket")(io);

module.exports = { app, server, io };
