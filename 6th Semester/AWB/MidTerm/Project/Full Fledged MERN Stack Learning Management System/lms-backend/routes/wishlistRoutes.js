const express = require("express");
const { addToWishlist, removeFromWishlist, getMyWishlist } = require("../controllers/wishlistController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, authorizeRoles("student"), addToWishlist);
router.delete("/remove", protect, authorizeRoles("student"), removeFromWishlist);
router.get("/my", protect, authorizeRoles("student"), getMyWishlist);

module.exports = router;
