/**
 * healthRoutes.js
 * Health check endpoint for verifying backend status.
 */

const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Resume Analyzer Backend is running"
  });
});

module.exports = router;
