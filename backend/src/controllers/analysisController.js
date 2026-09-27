/**
 * analysisController.js
 * Controller handling analysis retrieval by ID, direct text analysis, and job description comparison.
 */

const { analyzeResumeText, extractSkills } = require("../services/resumeAnalyzer");
const { analysisStore } = require("../utils/storage");
const ResumeAnalysis = require("../models/ResumeAnalysis");

/**
 * GET /api/analysis/:id
 * Retrieves a stored analysis result by ID.
 * Checks MongoDB first (by _id or databaseId), then falls back to in-memory store.
 */
async function getAnalysisById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_ID",
        message: "Analysis ID parameter is required."
      }
    });
  }

  // 1. Try MongoDB first (for analyses saved to MongoDB with databaseId / ObjectId)
  try {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    if (isMongoId) {
      const doc = await ResumeAnalysis.findById(id).lean();
      if (doc) {
        return res.status(200).json({
          success: true,
          data: {
            ...doc,
            id: doc._id.toString(),
            databaseId: doc._id.toString(),
            personalInfo: doc.candidate || {},
            detectedSkills: doc.skills || [],
            weaknesses: doc.improvements || [],
            recommendations: doc.suggestions || [],
            scores: {
              ...doc.scores,
              keyword: doc.scores?.keywords ?? doc.scores?.keyword ?? 0,
            }
          }
        });
      }
    }
  } catch (dbErr) {
    console.error("[AnalysisController] MongoDB lookup error:", dbErr.message);
  }

  // 2. Fall back to in-memory store (for analyses created via direct text API or in-memory IDs)
  const inMemory = analysisStore.get(id);
  if (inMemory) {
    return res.status(200).json({
      success: true,
      data: inMemory
    });
  }

  return res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `No analysis found with ID '${id}'.`
    }
  });
}

/**
 * POST /api/analysis
 * Analyzes resume text directly from JSON body.
 */
function analyzeDirectText(req, res, next) {
  try {
    const { text, fileName = "direct_input.txt", jobDescription = "" } = req.body;

    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Please provide a valid 'text' string containing at least 20 characters."
        }
      });
    }

    const analysis = analyzeResumeText(text, fileName, jobDescription);

    if (!analysis.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_RESUME",
          message: analysis.message || "The provided text does not appear to be a resume."
        },
        details: {
          confidence: analysis.confidence,
          detectedSignals: analysis.detectedSignals || [],
          missingSignals: analysis.missingSignals || [],
          rejectionReason: analysis.message
        }
      });
    }

    analysisStore.set(analysis.id, analysis);

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: analysis
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/analysis/compare
 * Compares an existing analysis or resume text against a Job Description.
 * Checks both in-memory store and MongoDB for the analysis.
 */
async function compareWithJob(req, res, next) {
  try {
    const { analysisId, resumeText, jobDescription } = req.body;

    if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_JD",
          message: "A non-empty 'jobDescription' string (minimum 10 characters) is required."
        }
      });
    }

    let detectedSkills = [];

    if (analysisId) {
      let stored = null;

      // 1. Try MongoDB first (for persistent analyses)
      try {
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(analysisId);
        if (isMongoId) {
          stored = await ResumeAnalysis.findById(analysisId).lean();
        }
      } catch (dbErr) {
        console.error("[AnalysisController] MongoDB lookup error:", dbErr.message);
      }

      // 2. Fall back to in-memory store
      if (!stored) {
        stored = analysisStore.get(analysisId);
      }

      if (!stored) {
        return res.status(404).json({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Analysis '${analysisId}' not found.`
          }
        });
      }
      detectedSkills = stored.detectedSkills || stored.skills || [];
    } else if (resumeText) {
      detectedSkills = extractSkills(resumeText);
    } else {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_SOURCE",
          message: "Provide either an 'analysisId' or 'resumeText' to compare against the job description."
        }
      });
    }

    const jdSkills = extractSkills(jobDescription);
    const matchedSkills = jdSkills.filter(s => detectedSkills.includes(s));
    const missingSkills = jdSkills.filter(s => !detectedSkills.includes(s));

    const matchPercentage = jdSkills.length > 0
      ? Math.round((matchedSkills.length / jdSkills.length) * 100)
      : Math.min(detectedSkills.length * 5, 100);

    const relevanceLevel =
      matchPercentage >= 70 ? "High Fit" :
      matchPercentage >= 50 ? "Moderate Fit" : "Low Fit";

    return res.status(200).json({
      success: true,
      message: "Job description comparison completed successfully",
      data: {
        matchPercentage,
        relevanceLevel,
        jdSkillsFound: jdSkills.length,
        matchedSkillsCount: matchedSkills.length,
        missingSkillsCount: missingSkills.length,
        matchedSkills,
        missingSkills
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAnalysisById,
  analyzeDirectText,
  compareWithJob
};
