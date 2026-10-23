const jwt = require("jsonwebtoken");
const Message = require("../models/Message.model");
const User = require("../models/User.model");
const logger = require("../config/logger");

module.exports = (io) => {
  // Authenticate socket connections via JWT query param
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error("Authentication required"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("name role");
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    logger.debug(`Socket connected: ${socket.user.name} (${socket.id})`);

    // Join personal room for notifications
    socket.join(`user:${socket.user._id}`);

    // ── Join course chat room ──────────────────────────────────────────────
    socket.on("join:course", async ({ courseId }) => {
      socket.join(`course:${courseId}`);

      // Send last 50 messages
      const messages = await Message.find({ course: courseId })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("sender", "name role")
        .lean();

      socket.emit("chat:history", messages.reverse());
    });

    socket.on("leave:course", ({ courseId }) => {
      socket.leave(`course:${courseId}`);
    });

    // ── Send message ───────────────────────────────────────────────────────
    socket.on("chat:send", async ({ courseId, content }) => {
      if (!content?.trim()) return;

      try {
        const message = await Message.create({
          course: courseId,
          sender: socket.user._id,
          content: content.trim(),
        });

        const populated = await message.populate("sender", "name role");

        io.to(`course:${courseId}`).emit("chat:message", populated);
      } catch (err) {
        logger.error(`chat:send error: ${err.message}`);
        socket.emit("chat:error", { message: "Failed to send message" });
      }
    });

    // ── Typing indicator ───────────────────────────────────────────────────
    socket.on("chat:typing", ({ courseId }) => {
      socket.to(`course:${courseId}`).emit("chat:typing", {
        userId: socket.user._id,
        name: socket.user.name,
      });
    });

    socket.on("disconnect", () => {
      logger.debug(`Socket disconnected: ${socket.user.name}`);
    });
  });
};
