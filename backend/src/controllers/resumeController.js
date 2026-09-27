/**
 * resumeController.js
 * Controller handling file upload, extraction, validation, and analysis.
 */

const { parseResumeFile } = require("../services/resumeParser");
const { analyzeResumeText } = require("../services/resumeAnalyzer");
const { analysisStore } = require("../utils/storage");
const ResumeAnalysis = require("../models/ResumeAnalysis");

/**
 * POST /api/resumes/upload
 * Accepts multipart/form-data with 'resume' file and optional 'jobDescription' field.
 */
async function uploadAndAnalyzeResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_FILE",
          message:
            "No resume file uploaded. Please attach a PDF or DOCX file under field name 'file' or 'resume'."
        }
      });
    }

    const jobDescription = req.body.jobDescription || "";

    // 1. Extract text
    const { normalizedText, fileType, wordCount } =
      await parseResumeFile(req.file);

    // Dev-safe debug info (no full text logged)
    console.log(
      "[ResumeUpload] file=%s | type=%s | size=%d bytes | words=%d",
      req.file.originalname,
      fileType,
      req.file.size,
      wordCount
    );

    // 2. Perform Content-Based Analysis
    const analysis = analyzeResumeText(
      normalizedText,
      req.file.originalname,
      jobDescription
    );

    // 3. Check if document is a valid resume
    if (!analysis.isValid) {
      console.log(
        "[ResumeUpload] REJECTED file=%s | resumeDetected=%s | confidence=%d",
        req.file.originalname,
        analysis.resumeDetected,
        analysis.confidence
      );

      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_RESUME",
          message: "The uploaded document does not appear to be a resume."
        },
        details: {
          confidence: analysis.confidence,
          detectedSignals: analysis.detectedSignals || [],
          missingSignals: analysis.missingSignals || [],
          rejectionReason:
            analysis.message ||
            "Document does not match standard resume structure."
        }
      });
    }

    // Attach file metadata
    analysis.fileType = fileType;
    analysis.fileSize = req.file.size;

    // =========================================================
    // 4. SAVE ANALYSIS TO MONGODB ATLAS
    // =========================================================

    const savedAnalysis = await ResumeAnalysis.create({
      fileName: analysis.fileName,
      fileType: analysis.fileType,
      fileSize: analysis.fileSize,
      analyzedAt: analysis.analyzedAt,

      // Candidate / personal information
      candidate: analysis.personalInfo || {},

      // Scores
      scores: {
        overall: analysis.scores?.overall,
        ats: analysis.scores?.ats,
        keywords: analysis.scores?.keyword,
        skills: analysis.scores?.skills,
        experience: analysis.scores?.experience,
        education: analysis.scores?.education,
        projects: analysis.scores?.projects,
        formatting: analysis.scores?.formatting,
        contact: analysis.scores?.contact
      },

      // Resume information
      skills: analysis.skills || [],
      education: analysis.education || [],
      projects: analysis.projects || [],
      certifications: analysis.certifications || [],

      // Feedback
      improvements: analysis.improvements || [],
      suggestions: analysis.suggestions || [],

      // Validation information
      validation: {
        resumeDetected: analysis.resumeDetected,
        confidence: analysis.confidence,
        signals: analysis.detectedSignals || []
      }
    });

    console.log(
      "[ResumeUpload] Saved to MongoDB | documentId=%s",
      savedAnalysis._id
    );

    // =========================================================
    // 5. KEEP EXISTING IN-MEMORY STORAGE FOR NOW
    // =========================================================

    analysisStore.set(analysis.id, analysis);

    // Add MongoDB document ID to response
    analysis.databaseId = savedAnalysis._id.toString();

    // 6. Return clean structured JSON response
    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: analysis
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  uploadAndAnalyzeResume
};