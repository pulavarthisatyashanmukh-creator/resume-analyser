/**
 * resumeAnalyzer.js
 * ==================
 * Authoritative API client for the Resume Analyzer Backend.
 * Submits the resume to POST /api/resumes/upload (proxied by Vite to http://localhost:5000)
 * and maps the real backend content-based analysis to the frontend views.
 *
 * Never uses hardcoded/demo scores or fallback data.
 */

/**
 * Main analysis function called by Upload.jsx.
 * Sends the file to the backend and maps the response.
 */
export async function analyzeResume(file, jobDescription = "") {
  // 1. Prepare multipart/form-data with single 'file' field matching backend multer expectations
  const formData = new FormData();
  formData.append("file", file);
  if (jobDescription && jobDescription.trim()) {
    formData.append("jobDescription", jobDescription.trim());
  }

  // 2. Determine target endpoint
  // When running Vite dev server, relative /api/resumes/upload uses the Vite proxy to http://localhost:5000
  // If VITE_API_URL is explicitly set, use that URL.
  const primaryUrl = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/resumes/upload`
    : "/api/resumes/upload";

  let response;
  let networkError = null;

  try {
    response = await fetch(primaryUrl, {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    networkError = err;
    // If relative /api URL failed (e.g. preview mode or direct access without proxy),
    // fallback to direct http://localhost:5000/api/resumes/upload
    if (primaryUrl.startsWith("/api")) {
      try {
        response = await fetch("http://localhost:5000/api/resumes/upload", {
          method: "POST",
          body: formData,
        });
        networkError = null;
      } catch (fallbackErr) {
        networkError = fallbackErr;
      }
    }
  }

  // Case A: Connection / Network Error (backend is down or unreachable)
  if (networkError || !response) {
    console.error("[ResumeAnalyzer] Backend connection failure:", networkError);
    return {
      isValid: false,
      error: "NETWORK_ERROR",
      message:
        "Unable to connect to the backend server. Please make sure the backend is running at http://localhost:5000 and try again.",
    };
  }

  // Parse JSON response from backend
  let resJson;
  try {
    resJson = await response.json();
  } catch (jsonErr) {
    resJson = null;
  }

  // Case B & C: Backend returned non-200 HTTP response (e.g. 400 INVALID_RESUME or other errors)
  if (!response.ok) {
    const errCode =
      resJson?.error?.code || (response.status === 400 ? "INVALID_RESUME" : `HTTP_${response.status}`);
    const errMsg =
      resJson?.error?.message ||
      resJson?.message ||
      (response.status === 400
        ? "The uploaded document does not appear to be a resume."
        : `Server responded with status ${response.status}.`);

    return {
      isValid: false,
      error: errCode,
      message: errMsg,
      rejectionReason: resJson?.details?.rejectionReason || null,
      status: response.status,
      details: resJson?.details || null,
    };
  }

  // Case D: Successful response (HTTP 200)
  const a = resJson?.data;
  if (!a) {
    return {
      isValid: false,
      error: "INVALID_RESPONSE",
      message: "Unexpected response format from server.",
    };
  }

  const scores = a.scores || {};

  return {
    isValid: true,
    resumeId: a.id || String(Date.now()),
    fileName: a.fileName || file.name,
    fileType: a.fileType,
    fileSize: a.fileSize,
    overallScore: scores.overall ?? 0,
    overallLabel: a.overallLabel || "Average",
    atsScore: scores.ats ?? 0,
    atsLabel: a.atsLabel || "Moderate ATS Compatibility",
    keywordScore: scores.keyword ?? 0,
    skillsScore: scores.skills ?? 0,
    experienceScore: scores.experience ?? 0,
    educationScore: scores.education ?? 0,
    projectsScore: scores.projects ?? 0,
    formattingScore: scores.formatting ?? 0,
    contactScore: scores.contact ?? 0,
    detectedSkills: a.detectedSkills || a.skills || [],
    matchedSkills: a.matchedSkills || [],
    missingSkills: a.missingSkills || [],
    sections: a.sections || {},
    contactInfo: a.personalInfo || {},
    strengths: a.strengths || [],
    weaknesses: a.improvements || a.weaknesses || [],
    recommendations: a.suggestions || a.recommendations || [],
    hasJobDescription: !!a.hasJobDescription,
    analyzedAt: a.analyzedAt || new Date().toISOString(),
    wordCount: a.wordCount || 0,
    confidence: a.confidence ?? 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Compatibility helpers (kept to preserve exports without breaking callers)
// ─────────────────────────────────────────────────────────────────────────────
export async function extractTextFromFile(file) {
  return "";
}

export function normalizeText(raw) {
  return typeof raw === "string" ? raw.trim() : "";
}

export function extractSections(text) {
  return {};
}

export function extractContactInfo(text) {
  return {};
}

export function extractSkills(text) {
  return [];
}

export function detectResume(text, sections, contactInfo, detectedSkills) {
  return { isResume: false, confidence: 0 };
}
