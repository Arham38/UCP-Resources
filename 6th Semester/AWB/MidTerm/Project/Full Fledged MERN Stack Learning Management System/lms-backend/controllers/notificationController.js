const Notification = require("../models/Notification.model");

// Helper used by other controllers to create + push notifications
const createNotification = async (io, { recipient, type, title, message, link = "", metadata = {} }) => {
  const notification = await Notification.create({ recipient, type, title, message, link, metadata });
  // Push real-time notification via Socket.io
  if (io) {
    io.to(`user:${recipient}`).emit("notification", notification);
  }
  return notification;
};

exports.createNotification = createNotification;

// GET /api/notifications  — paginated list for current user
exports.getMyNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ recipient: req.user._id }),
      Notification.countDocuments({ recipient: req.user._id, read: false }),
    ]);

    res.json({
      success: true,
      notifications,
      unreadCount,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/notifications/read-all
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
