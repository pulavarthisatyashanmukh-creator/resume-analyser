/**
 * analysisRoutes.js
 * Routing for analysis operations: retrieval by id, text analysis, and job description comparison.
 */

const express = require("express");
const router = express.Router();
const {
  getAnalysisById,
  analyzeDirectText,
  compareWithJob
} = require("../controllers/analysisController");

router.post("/", analyzeDirectText);
router.post("/compare", compareWithJob);
router.get("/:id", getAnalysisById);

module.exports = router;
