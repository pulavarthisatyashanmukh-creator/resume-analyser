/**
 * resumeRoutes.js
 * Routing for resume uploading and parsing.
 */

const express = require("express");
const router = express.Router();
const { uploadResumeMiddleware } = require("../middleware/uploadMiddleware");
const { uploadAndAnalyzeResume } = require("../controllers/resumeController");

router.post("/upload", uploadResumeMiddleware, uploadAndAnalyzeResume);

module.exports = router;
