/**
 * resumeValidator.js
 * Multi-signal resume detection and validation service.
 *
 * A document is accepted as a resume ONLY when ALL of the following are true:
 *   1. No hard negative (disqualifying) signal is present.
 *   2. At least one genuine contact/identity signal is present (email or verified phone).
 *   3. At least 2 distinct resume section headers are present.
 *   4. Overall confidence score >= 45 out of 100.
 */

const {
  NEGATIVE_SIGNALS,
  DEGREE_PATTERNS,
  DATE_RANGE_PATTERNS,
  JOB_TITLE_PATTERNS
} = require("../utils/constants");

// ─────────────────────────────────────────────────────────────────────────────
// STRICT EMAIL REGEX
// ─────────────────────────────────────────────────────────────────────────────
const EMAIL_RE = /\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/;

// ─────────────────────────────────────────────────────────────────────────────
// STRICT PHONE REGEX
// Matches genuine phone numbers (7–15 digits, standard separators).
// Excludes student/roll IDs such as A24126511165 (alphanumeric prefixes).
// Must be preceded/followed by whitespace, start/end of line, or common delimiters.
// ─────────────────────────────────────────────────────────────────────────────
const PHONE_RE = /(?:^|[\s,;|])(?:\+?(?:[1-9]\d{0,2}[\s\-.])?)?(?:\(?\d{3,5}\)?[\s\-.]?)?\d{3,5}[\s\-.]?\d{3,5}(?=[\s,;|]|$)/m;
// Additional guard: phone must be purely numeric with optional +, (), spaces, hyphens
const PHONE_VALID_RE = /^\+?[\d\s\-().]{7,18}$/;

// ─────────────────────────────────────────────────────────────────────────────
// CANDIDATE NAME HEURISTIC PATTERNS (exclusions)
// ─────────────────────────────────────────────────────────────────────────────
const NAME_EXCLUSIONS_RE = /\b(resume|curriculum|vitae|email|phone|contact|page|profile|team|member|lab|binary|search|tree|competitive|programming|handbook|edition|expanded|scope|university|college|department|institute|faculty)\b/i;

/**
 * Validates whether extracted contact info has a genuine phone number.
 * Rejects alphanumeric roll numbers / student IDs (e.g. A24126511165).
 */
function isValidPhone(rawPhone) {
  if (!rawPhone) return false;
  const stripped = rawPhone.replace(/[\s\-().+]/g, "");
  // Must be all digits after stripping separators (length 7-15)
  return /^\d{7,15}$/.test(stripped);
}

/**
 * Validates whether the extracted name looks like a real person's name.
 * Rejects team names, lab labels, academic titles, etc.
 */
function isValidCandidateName(name) {
  if (!name) return false;
  if (NAME_EXCLUSIONS_RE.test(name)) return false;
  // Must be 2-5 alpha words, each capitalised (like a person's name)
  const words = name.trim().split(/\s+/);
  if (words.length < 2 || words.length > 5) return false;
  return words.every(w => /^[A-Za-z][a-z.'-]*$/.test(w));
}

/**
 * Main resume validation function.
 *
 * @param {string} text - Normalized document text
 * @param {Object} sections - Boolean map of detected section headers
 * @param {Object} contactInfo - Extracted contact fields (from resumeAnalyzer)
 * @param {Array<string>} detectedSkills - Array of extracted skill labels
 * @returns {{
 *   isResume: boolean,
 *   resumeDetected: boolean,
 *   confidence: number,
 *   detectedSignals: string[],
 *   missingSignals: string[],
 *   rejectionReason: string|null
 * }}
 */
/**
 * Detects whether a document is an academic project report/thesis.
 * Uses a COMBINATION of multiple strong indicators rather than a single keyword.
 */
function checkAcademicProjectReport(text) {
  let reportScore = 0;
  const reportSignals = [];

  // 1. Formal project report title
  if (/\b(?:a\s+project\s+report\s+on|a\s+dissertation\s+on|a\s+thesis\s+on|project\s+report\s+submitted\s+in)\b/i.test(text)) {
    reportScore += 3;
    reportSignals.push("project report title");
  }

  // 2. Formal degree submission clause
  if (/\bsubmitted\s+in\s+partial\s+fulfillment\s+of\s+(?:the\s+requirements\s+for\s+)?(?:the\s+award\s+of\s+)?(?:the\s+degree|bachelor|master|diploma)\b/i.test(text)) {
    reportScore += 4;
    reportSignals.push("degree fulfillment submission clause");
  }

  // 3. Project guide / supervisor acknowledgment
  if (/\b(?:under\s+the\s+(?:esteemed\s+)?guidance\s+of\s+(?:dr\.|prof\.|mr\.|mrs\.|ms\.)|internal\s+guide\s*:|project\s+guide\s*:|external\s+guide\s*:)\b/i.test(text)) {
    reportScore += 3;
    reportSignals.push("project guide acknowledgment");
  }

  // 4. Formal academic certificate page
  if (/\bthis\s+is\s+to\s+certify\s+that\s+(?:the\s+project|this\s+project|the\s+work\s+entitled)\b/i.test(text)) {
    reportScore += 3;
    reportSignals.push("formal project certification");
  }

  // 5. Formal report chapter structure + table of contents
  const hasChapters = /(?:^|\n)\s*chapter\s+\d+\b/i.test(text);
  const hasToc = /\b(?:table\s+of\s+contents|list\s+of\s+figures|list\s+of\s+tables)\b/i.test(text);
  const hasThesisSections = /\b(?:literature\s+survey|system\s+requirements\s+specification|srs\b|system\s+architecture\s+design|conclusion\s+(?:and|&)\s+future\s+(?:scope|work))\b/i.test(text);

  if (hasChapters && hasToc) {
    reportScore += 3;
    reportSignals.push("chapter outline and table of contents");
  }
  if (hasChapters && hasThesisSections) {
    reportScore += 3;
    reportSignals.push("academic thesis chapters");
  }

  const isReport = reportScore >= 5;
  return {
    isReport,
    reportScore,
    reason: isReport ? `academic project report (${reportSignals.join(", ")})` : null
  };
}

function validateResume(text, sections = {}, contactInfo = {}, detectedSkills = []) {
  let confidence = 0;
  const detectedSignals = [];
  const missingSignals = [];

  // ───────────────────────────────────────────────────────────────────────────
  // STEP 1: Hard Negative Signals (instant disqualification for definitive non-resumes)
  // ───────────────────────────────────────────────────────────────────────────
  for (const { re, reason } of NEGATIVE_SIGNALS) {
    if (re.test(text)) {
      return {
        isResume: false,
        resumeDetected: false,
        confidence: 0,
        detectedSignals: [`NEGATIVE: ${reason}`],
        missingSignals: ["contact information", "resume section headers"],
        rejectionReason: `Non-resume document pattern detected: ${reason}.`
      };
    }
  }

  // Check composite academic project report pattern (combination of multiple markers)
  const reportCheck = checkAcademicProjectReport(text);
  if (reportCheck.isReport) {
    return {
      isResume: false,
      resumeDetected: false,
      confidence: 0,
      detectedSignals: [`NEGATIVE: ${reportCheck.reason}`],
      missingSignals: ["resume format"],
      rejectionReason: `Academic project report pattern detected: ${reportCheck.reason}.`
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STEP 2: Identity / Contact Signals
  // ───────────────────────────────────────────────────────────────────────────
  let hasEmail = false;
  let hasPhone = false;

  if (contactInfo.email && EMAIL_RE.test(contactInfo.email)) {
    hasEmail = true;
    confidence += 18;
    detectedSignals.push("email address");
  } else {
    missingSignals.push("email address");
  }

  if (contactInfo.phone && isValidPhone(contactInfo.phone)) {
    hasPhone = true;
    confidence += 14;
    detectedSignals.push("phone number");
  } else {
    missingSignals.push("phone number");
  }

  if (contactInfo.linkedin) {
    confidence += 8;
    detectedSignals.push("LinkedIn profile");
  }
  if (contactInfo.github) {
    confidence += 6;
    detectedSignals.push("GitHub profile");
  }
  if (isValidCandidateName(contactInfo.name)) {
    confidence += 4;
    detectedSignals.push("candidate name");
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STEP 3: Resume Section Headers
  // ───────────────────────────────────────────────────────────────────────────
  const sectionScores = {
    experience: 15,
    education: 14,
    skills: 14,
    projects: 10,
    summary: 7,
    certifications: 5,
    achievements: 4,
    languages: 2
  };

  let sectionHeaderCount = 0;
  for (const [key, score] of Object.entries(sectionScores)) {
    if (sections[key]) {
      confidence += score;
      sectionHeaderCount++;
      detectedSignals.push(`${key} section`);
    }
  }
  if (sectionHeaderCount === 0) {
    missingSignals.push("resume section headers (Education / Experience / Skills / Projects)");
  } else if (sectionHeaderCount === 1) {
    missingSignals.push("additional resume section headers");
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STEP 4: Content & Chronology Signals
  // ───────────────────────────────────────────────────────────────────────────

  // Degree mentions
  let hasDegree = false;
  for (const re of DEGREE_PATTERNS) {
    if (re.test(text)) {
      hasDegree = true;
      confidence += 6;
      detectedSignals.push("degree qualification");
      break;
    }
  }
  if (!hasDegree) missingSignals.push("degree qualification");

  // Date ranges (chronological employment / study timeline)
  let hasDateRange = false;
  for (const re of DATE_RANGE_PATTERNS) {
    if (re.test(text)) {
      hasDateRange = true;
      confidence += 5;
      detectedSignals.push("employment/study date range");
      break;
    }
  }
  if (!hasDateRange) missingSignals.push("employment or study date ranges");

  // Job titles
  let hasJobTitle = false;
  for (const re of JOB_TITLE_PATTERNS) {
    if (re.test(text)) {
      hasJobTitle = true;
      confidence += 5;
      detectedSignals.push("professional job title");
      break;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STEP 5: Technical Skills Density
  // ───────────────────────────────────────────────────────────────────────────
  if (detectedSkills.length >= 8) {
    confidence += 8;
    detectedSignals.push(`high skill density (${detectedSkills.length} skills)`);
  } else if (detectedSkills.length >= 4) {
    confidence += 5;
    detectedSignals.push(`moderate skill density (${detectedSkills.length} skills)`);
  } else if (detectedSkills.length >= 1) {
    confidence += 2;
    detectedSignals.push(`low skill density (${detectedSkills.length} skills)`);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STEP 6: Word Count Guard
  // ───────────────────────────────────────────────────────────────────────────
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount >= 80 && wordCount <= 2500) {
    confidence += 5;
  } else if (wordCount > 2500) {
    // Very long documents (textbooks, lab manuals) are penalized
    confidence -= 10;
    detectedSignals.push(`long document (${wordCount} words — may not be a resume)`);
  }
  if (wordCount < 40) {
    // Caps confidence for near-empty documents
    confidence = Math.min(confidence, 5);
    missingSignals.push("sufficient content (document too short)");
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STEP 7: Clamp confidence to valid range [0, 100]
  // ───────────────────────────────────────────────────────────────────────────
  if (!Number.isFinite(confidence)) confidence = 0;
  confidence = Math.max(0, Math.min(100, Math.round(confidence)));

  // ───────────────────────────────────────────────────────────────────────────
  // STEP 8: Multi-Signal Conjunction Rules (hard gates)
  //
  // Primary path: identity (email or phone) + 2 sections + confidence >= 45
  // Fresher/developer path: if email present + 3 sections + degree + conf >= 55
  //   then accept even without phone (many freshers omit phone from digital CVs)
  // GitHub/LinkedIn alone counts as identity for technical profiles
  // ───────────────────────────────────────────────────────────────────────────
  const hasIdentity = hasEmail || hasPhone || contactInfo.linkedin || contactInfo.github;
  const hasSufficientSections = sectionHeaderCount >= 2;
  const meetsThreshold = confidence >= 45;

  // Fresher-friendly path: email + ≥3 sections + degree detected + higher confidence threshold
  const fresherPath = hasEmail && sectionHeaderCount >= 3 && hasDegree && confidence >= 55;

  const isResume = hasIdentity && hasSufficientSections && (meetsThreshold || fresherPath);

  let rejectionReason = null;
  if (!isResume) {
    const reasons = [];
    if (!hasIdentity) {
      reasons.push("no verifiable contact information (email, phone, LinkedIn, or GitHub) was found");
    }
    if (!hasSufficientSections) {
      reasons.push(
        sectionHeaderCount === 0
          ? "no recognizable resume section headers were detected"
          : "only one resume section header was detected (minimum 2 required)"
      );
    }
    if (!meetsThreshold && !fresherPath) {
      reasons.push(`overall resume confidence is too low (${confidence}/100, minimum 45 required)`);
    }
    rejectionReason = reasons.join("; ") + ".";
  }

  return {
    isResume,
    resumeDetected: isResume,
    confidence,
    detectedSignals,
    missingSignals: isResume ? [] : missingSignals,
    rejectionReason: isResume ? null : rejectionReason
  };
}

module.exports = {
  validateResume
};
