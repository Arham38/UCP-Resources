const express = require("express");
const { generateCertificate, getMyCertificates, verifyCertificate } = require("../controllers/certificateController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate", protect, authorizeRoles("student"), generateCertificate);
router.get("/my", protect, authorizeRoles("student"), getMyCertificates);
router.get("/verify/:certificateId", verifyCertificate);

module.exports = router;
