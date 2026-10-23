const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

// ─── Token Helpers ────────────────────────────────────────────────────────────

const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "15m",
  });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ─── Register ─────────────────────────────────────────────────────────────────

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Persist refresh token hash in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    setRefreshCookie(res, refreshToken);

    logger.info(`New user registered: ${email} (${role})`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: accessToken,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password +refreshToken");
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account has been deactivated" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    setRefreshCookie(res, refreshToken);

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: accessToken,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "No refresh token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    setRefreshCookie(res, newRefreshToken);

    res.status(200).json({ success: true, token: newAccessToken });
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    res.status(401).json({ success: false, message: "Token refresh failed" });
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );
      await User.findByIdAndUpdate(decoded.id, { refreshToken: "" });
    }
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch {
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out" });
  }
};

// ─── Update Profile ───────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ success: false, message: "Name must be at least 3 characters" });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim(), bio: bio?.trim() || "" },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Change Password ──────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both passwords are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, refreshToken, logoutUser, updateProfile, changePassword };
