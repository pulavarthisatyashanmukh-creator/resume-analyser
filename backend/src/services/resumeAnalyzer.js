/**
 * resumeAnalyzer.js
 * Core analysis engine for calculating content-derived scores, extracting structured data,
 * and generating dynamic recommendations.
 *
 * ZERO hardcoded scores. ZERO random values.
 */

const {
  SKILLS_DICT,
  SECTION_PATTERNS,
  ACTION_VERBS,
  TECH_CATEGORIES,
  DEGREE_PATTERNS,
  DATE_RANGE_PATTERNS,
  JOB_TITLE_PATTERNS
} = require("../utils/constants");
const { validateResume } = require("./resumeValidator");

function clamp(val) {
  if (!Number.isFinite(val)) return 0;
  return Math.min(100, Math.max(0, Math.round(val)));
}

/**
 * Extracts sections presence from document text.
 */
function extractSections(text) {
  const sections = {};
  for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
    sections[key] = pattern.test(text);
  }
  return sections;
}

/**
 * Extracts contact information using strict regexes.
 * Excludes alphanumeric student/roll IDs from phone detection.
 * Excludes academic/lab labels from name detection.
 */
function extractContactInfo(text) {
  // Email — strict RFC-like pattern
  const emailMatch = text.match(/\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/);

  // Phone — must be purely numeric after stripping separators (7–15 digits).
  // Pattern: optional country code, optional area code in parens, then digit groups.
  // Word boundary before and after to exclude IDs embedded in alphanumeric strings.
  let phone = null;
  const phoneRe = /(?:^|[\s,;|(])(?:\+?([1-9]\d{0,2})[\s\-.])?(?:\(?\d{3,5}\)?[\s\-.]?)?\d{3,5}[\s\-.]?\d{3,5}(?=[\s,;)|]|$)/gm;
  let pm;
  while ((pm = phoneRe.exec(text)) !== null) {
    const raw = pm[0].trim();
    const digitsOnly = raw.replace(/[^\d]/g, "");
    // Valid phone: 7–15 pure digits (no letters in the original match)
    if (/^[^a-zA-Z]+$/.test(raw) && digitsOnly.length >= 7 && digitsOnly.length <= 15) {
      phone = raw;
      break;
    }
  }

  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9\-_]+/i);
  const githubMatch   = text.match(/github\.com\/[a-zA-Z0-9\-_]+/i);

  // Candidate Name — look at first 6 non-empty lines
  // Must be 2–4 alphabetic words, title-cased, not an academic / document label
  const NAME_EXCLUSIONS = /\b(resume|curriculum|vitae|cv|email|phone|contact|page|profile|team|member|lab|binary|search|tree|competitive|programming|handbook|edition|expanded|scope|university|college|department|institute|faculty|question|assignment|exercise|summary|objective|overview|introduction|chapter|table|contents|note|edition|beginner|friendly)\b/i;

  let name = null;
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i];
    // Purely alphabetic + spaces + common name punctuation
    if (
      line.length >= 4 &&
      line.length <= 45 &&
      /^[A-Za-z][A-Za-z\s.'\-]+$/.test(line) &&
      !NAME_EXCLUSIONS.test(line)
    ) {
      const words = line.split(/\s+/).filter(Boolean);
      // At least 2 words, at most 5 words, each starting with a capital
      if (words.length >= 2 && words.length <= 5 && words.every(w => /^[A-Z]/.test(w))) {
        name = line;
        break;
      }
    }
  }

  return {
    name: name || null,
    email: emailMatch ? emailMatch[0].trim() : null,
    phone: phone,
    linkedin: linkedinMatch ? linkedinMatch[0].trim() : null,
    github: githubMatch ? githubMatch[0].trim() : null
  };
}

/**
 * Extracts technical and professional skills using SKILLS_DICT.
 */
function extractSkills(text) {
  const found = [];
  for (const { pattern, label } of SKILLS_DICT) {
    if (pattern.test(text) && !found.includes(label)) {
      found.push(label);
    }
  }
  return found;
}

/**
 * Extracts structured sections summary from the text.
 */
function extractStructuredInfo(text, sections, contactInfo, detectedSkills) {
  // Extract summary block if present
  let summaryText = "";
  const summaryMatch = text.match(/(?:summary|objective|career\s+objective|profile)[\s\S]{1,400}?(?=\n\s*(?:skills|experience|education|projects|work)|$)/i);
  if (summaryMatch) {
    summaryText = summaryMatch[0].replace(/^(?:summary|objective|career\s+objective|profile)[:\s-]*/i, "").trim();
    if (summaryText.length > 250) summaryText = summaryText.substring(0, 250) + "...";
  }

  // Education items detected
  const educationItems = [];
  const degreeRegexes = [
    { name: "Ph.D. / Doctorate", regex: /\b(ph\.?d|doctorate)\b/i },
    { name: "Master's Degree", regex: /\b(m\.?tech|m\.?e\.?|master|msc|mba|m\.?s\.?)\b/i },
    { name: "Bachelor's Degree", regex: /\b(b\.?tech|b\.?e\.?|bachelor|bsc|ba|bba|b\.?s\.?)\b/i },
    { name: "Diploma", regex: /\bdiploma\b/i }
  ];
  for (const { name: degName, regex } of degreeRegexes) {
    if (regex.test(text)) educationItems.push(degName);
  }

  // Experience highlights (dates & metrics)
  const experienceHighlights = [];
  const yearMatches = text.match(/\b(20\d{2}|19\d{2})\b/g) || [];
  if (yearMatches.length > 0) {
    const uniqueYears = [...new Set(yearMatches)].sort();
    experienceHighlights.push(`Timeline indicates activity from ${uniqueYears[0]} to ${uniqueYears[uniqueYears.length - 1]}`);
  }
  const metricMatches = text.match(/\b\d+\s*(%|users?|clients?|projects?|apps?|systems?|x\b)/gi) || [];
  if (metricMatches.length > 0) {
    experienceHighlights.push(`${metricMatches.length} quantitative impact metrics found in descriptions`);
  }

  // Project mentions
  const projectMentions = (text.match(/\bproject\b/gi) || []).length;
  const projectHighlights = projectMentions > 0 ? [`Approx. ${Math.min(projectMentions, 8)} projects referenced`] : [];

  return {
    personalInfo: contactInfo,
    summary: summaryText || (sections.summary ? "Professional summary detected" : "No summary provided"),
    skills: detectedSkills,
    education: educationItems.length > 0 ? educationItems : (sections.education ? ["Education section present"] : []),
    experience: experienceHighlights.length > 0 ? experienceHighlights : (sections.experience ? ["Experience section present"] : []),
    projects: projectHighlights.length > 0 ? projectHighlights : (sections.projects ? ["Projects section present"] : []),
    certifications: sections.certifications ? ["Certifications section present"] : []
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE CALCULATIONS (Deterministic and Content-Derived)
// ─────────────────────────────────────────────────────────────────────────────

function calcSkillsScore(detectedSkills) {
  if (detectedSkills.length === 0) return 5;
  if (detectedSkills.length === 1) return 18;
  if (detectedSkills.length === 2) return 28;
  // 3 skills -> 37, 10 skills -> 68, 18+ skills -> high
  return clamp(25 + detectedSkills.length * 3.6);
}

function calcExperienceScore(text, sections) {
  let score = 0;
  if (sections.experience) score += 35;
  if (sections.projects) score += 20;

  let verbCount = 0;
  const lower = text.toLowerCase();
  for (const v of ACTION_VERBS) {
    if (lower.includes(v)) verbCount++;
  }
  score += Math.min(verbCount * 2, 20);

  const yearMatches = (text.match(/\b(20\d{2}|19\d{2})\b/g) || []).length;
  score += Math.min(yearMatches * 2, 12);

  const metrics = (text.match(/\b\d+\s*(%|users?|clients?|projects?|apps?|systems?|x\b)/gi) || []).length;
  score += Math.min(metrics * 4, 13);

  return clamp(score);
}

function calcEducationScore(text, sections) {
  let score = 0;
  if (sections.education) score += 40;

  if (/\b(phd|doctorate|doctor\s+of)\b/i.test(text)) score += 25;
  else if (/\b(m\.?tech|m\.?e\.?|master|msc|mba|m\.?s\.?)\b/i.test(text)) score += 20;
  else if (/\b(b\.?tech|b\.?e\.?|bachelor|bsc|ba|bba|b\.?s\.?)\b/i.test(text)) score += 15;
  else if (/\bdiploma\b/i.test(text)) score += 10;

  if (/\b(cgpa|gpa)\b/i.test(text)) score += 10;
  else if (/\b\d{2,3}(\.\d{1,2})?%\b/.test(text)) score += 8;

  if (/\b(university|college|institute|institution)\b/i.test(text)) score += 15;

  return clamp(score);
}

function calcProjectsScore(text, sections, detectedSkills) {
  if (!sections.projects) return 8;

  let score = 30;
  const projectMentions = (text.match(/\bproject\b/gi) || []).length;
  score += Math.min(projectMentions * 6, 30);
  score += Math.min(detectedSkills.length * 2, 25);

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount > 400) score += 15;
  else if (wordCount > 200) score += 8;

  return clamp(score);
}

function calcFormattingScore(text, sections) {
  let score = 40;
  const sectionCount = Object.values(sections).filter(Boolean).length;
  score += sectionCount * 5;

  const nonAsciiCount = (text.match(/[^\x00-\x7F]/g) || []).length;
  const ratio = nonAsciiCount / Math.max(text.length, 1);
  if (ratio > 0.08) score -= 20;
  else if (ratio > 0.03) score -= 8;

  const longBlocks = (text.match(/[^\n]{400,}/g) || []).length;
  score -= Math.min(longBlocks * 4, 20);

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 200 && wordCount <= 1500) score += 10;

  return clamp(score);
}

function calcContactScore(contactInfo) {
  let score = 0;
  if (contactInfo.email) score += 40;
  if (contactInfo.phone) score += 35;
  if (contactInfo.linkedin) score += 15;
  if (contactInfo.github) score += 10;
  return clamp(score);
}

function calcKeywordScore(detectedSkills, jobDescription) {
  if (!jobDescription || jobDescription.trim().length < 10) {
    const categoriesHit = TECH_CATEGORIES.filter(cat =>
      cat.some(skill => detectedSkills.includes(skill))
    ).length;

    const base = Math.min(detectedSkills.length * 4, 60);
    const diversity = categoriesHit * 6;
    return clamp(base + diversity);
  }

  const jdSkills = extractSkills(jobDescription);
  if (jdSkills.length === 0) {
    return clamp(Math.min(detectedSkills.length * 4, 60));
  }
  const matched = jdSkills.filter(s => detectedSkills.includes(s));
  return clamp((matched.length / jdSkills.length) * 100);
}

function calcATSScore(text, sections, contactInfo, detectedSkills) {
  let score = 0;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 100) score += 20;
  else if (wordCount >= 50) score += 12;

  const sectionCount = Object.values(sections).filter(Boolean).length;
  score += Math.min(sectionCount * 4, 25);

  if (contactInfo.email) score += 10;
  if (contactInfo.phone) score += 8;

  if (sections.skills) score += 10;
  if (sections.experience || sections.projects) score += 10;
  if (sections.education) score += 8;
  if (sections.summary) score += 5;

  if (detectedSkills.length >= 6) score += 4;
  else if (detectedSkills.length >= 2) score += 2;

  return clamp(score);
}

function calcOverallScore(scores) {
  return clamp(
    scores.skills * 0.22 +
    scores.experience * 0.20 +
    scores.education * 0.13 +
    scores.projects * 0.13 +
    scores.keyword * 0.14 +
    scores.formatting * 0.10 +
    scores.contact * 0.08
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC NARRATIVE FEEDBACK
// ─────────────────────────────────────────────────────────────────────────────

function generateStrengths(sections, contactInfo, detectedSkills, scores) {
  const list = [];
  if (contactInfo.email && contactInfo.phone) {
    list.push("Contact information (email and phone number) is prominently provided.");
  }
  if (detectedSkills.length >= 10) {
    list.push(`Strong technical skill profile with ${detectedSkills.length} relevant technologies detected.`);
  } else if (detectedSkills.length >= 4) {
    list.push(`Good foundational skills identified including ${detectedSkills.slice(0, 4).join(", ")}.`);
  }

  if (sections.experience) list.push("Structured work experience or internship section included.");
  if (sections.education) list.push("Clear educational qualifications documented.");
  if (sections.projects) list.push("Dedicated projects section demonstrates practical implementation ability.");
  if (sections.summary) list.push("Professional summary provides a quick candidate profile.");
  if (sections.certifications) list.push("Certifications listed, validating domain knowledge.");
  if (sections.achievements) list.push("Achievements or awards listed to distinguish credentials.");
  if (contactInfo.linkedin) list.push("Professional LinkedIn profile link included.");
  if (contactInfo.github) list.push("Developer GitHub profile link included.");
  if (scores.formatting >= 70) list.push("Clean and ATS-readable document layout.");

  return list.length > 0 ? list : ["Resume content successfully validated and parsed."];
}

function generateImprovements(sections, contactInfo, detectedSkills, scores) {
  const list = [];
  if (!contactInfo.email) list.push("Email address is missing or could not be detected.");
  if (!contactInfo.phone) list.push("Phone number is missing or unformatted.");
  if (!sections.summary) list.push("No professional summary or career objective found.");
  if (!sections.skills) list.push("No dedicated skills section detected.");
  if (!sections.experience && !sections.projects) list.push("Lacks both professional experience and project entries.");
  if (!sections.education) list.push("Educational background details are missing or unclear.");
  if (!sections.projects) list.push("Projects section is absent. Concrete projects significantly boost callback rates.");
  if (!sections.certifications) list.push("No industry certifications or continuous learning entries found.");
  if (detectedSkills.length < 4) list.push("Limited technical skills detected. Specify more tools and frameworks.");
  if (scores.experience > 0 && scores.experience < 35) {
    list.push("Work experience descriptions lack action verbs and measurable performance metrics.");
  }
  if (!contactInfo.linkedin) list.push("Consider adding your LinkedIn profile link.");
  if (scores.formatting < 60) list.push("Formatting density is low; use standard bullet points and clear headers.");

  return list;
}

function generateSuggestions(sections, contactInfo, detectedSkills, scores, missingSkills) {
  const list = [];
  if (!sections.summary) {
    list.push("Add a 2–3 sentence professional summary summarizing your primary domain, key achievements, and target roles.");
  }
  if (!contactInfo.linkedin) {
    list.push("Add your customized LinkedIn URL at the top with your contact details.");
  }
  if (!sections.projects) {
    list.push("Add 2–3 projects detailing the problem statement, technologies used, and business outcome.");
  }
  if (detectedSkills.length < 6) {
    list.push("Categorize skills into Languages, Frameworks, Databases, and Tools for better readability.");
  }
  if (scores.experience < 45 && (sections.experience || sections.projects)) {
    list.push("Apply the XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'.");
  }
  if (missingSkills && missingSkills.length > 0) {
    list.push(`Incorporate target role keywords such as: ${missingSkills.slice(0, 5).join(", ")}.`);
  }
  if (!sections.certifications) {
    list.push("Include recognized certifications (e.g. AWS, Microsoft, Coursera) to validate technical proficiency.");
  }
  if (scores.formatting < 65) {
    list.push("Ensure consistent fonts, 1-inch margins, and chronological ordering of experiences.");
  }

  return list.slice(0, 8);
}

/**
 * Master analysis function.
 * @param {string} text - Normalized resume text
 * @param {string} fileName - File name
 * @param {string} jobDescription - Optional target job description
 * @returns {Object} Comprehensive analysis result object
 */
function analyzeResumeText(text, fileName = "resume.pdf", jobDescription = "") {
  const sections = extractSections(text);
  const contactInfo = extractContactInfo(text);
  const detectedSkills = extractSkills(text);

  // Validate that document is actually a resume
  const validation = validateResume(text, sections, contactInfo, detectedSkills);

  // Debug: safe metadata (no full text ever logged)
  console.log("[ResumeValidator] wordCount=%d | resumeDetected=%s | confidence=%d | signals=%s",
    text.split(/\s+/).filter(Boolean).length,
    validation.isResume,
    validation.confidence,
    validation.detectedSignals.join(", ")
  );

  if (!validation.isResume) {
    return {
      isValid: false,
      resumeDetected: false,
      confidence: validation.confidence,
      detectedSignals: validation.detectedSignals,
      missingSignals: validation.missingSignals,
      message: validation.rejectionReason || "The uploaded document does not appear to be a resume."
    };
  }

  // Calculate scores
  const skillsScore = calcSkillsScore(detectedSkills);
  const experienceScore = calcExperienceScore(text, sections);
  const educationScore = calcEducationScore(text, sections);
  const projectsScore = calcProjectsScore(text, sections, detectedSkills);
  const formattingScore = calcFormattingScore(text, sections);
  const contactScore = calcContactScore(contactInfo);
  const keywordScore = calcKeywordScore(detectedSkills, jobDescription);
  const atsScore = calcATSScore(text, sections, contactInfo, detectedSkills);

  const scores = {
    overall: 0,
    ats: atsScore,
    keyword: keywordScore,
    skills: skillsScore,
    experience: experienceScore,
    education: educationScore,
    projects: projectsScore,
    formatting: formattingScore,
    contact: contactScore
  };
  scores.overall = calcOverallScore(scores);

  // Job description matching
  let matchedSkills = [];
  let missingSkills = [];
  const hasJobDescription = Boolean(jobDescription && jobDescription.trim().length >= 10);
  if (hasJobDescription) {
    const jdSkills = extractSkills(jobDescription);
    matchedSkills = jdSkills.filter(s => detectedSkills.includes(s));
    missingSkills = jdSkills.filter(s => !detectedSkills.includes(s));
  }

  // Dynamic feedback
  const strengths = generateStrengths(sections, contactInfo, detectedSkills, scores);
  const improvements = generateImprovements(sections, contactInfo, detectedSkills, scores);
  const suggestions = generateSuggestions(sections, contactInfo, detectedSkills, scores, missingSkills);
  const structuredInfo = extractStructuredInfo(text, sections, contactInfo, detectedSkills);

  const overallLabel =
    scores.overall >= 80 ? "Excellent" :
    scores.overall >= 65 ? "Good" :
    scores.overall >= 45 ? "Average" : "Needs Improvement";

  const atsLabel =
    scores.ats >= 70 ? "High ATS Compatibility" :
    scores.ats >= 50 ? "Moderate ATS Compatibility" : "Low ATS Compatibility";

  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return {
    isValid: true,
    id: `res_${Date.now().toString(36)}_${process.hrtime.bigint().toString(36)}`,
    fileName,
    wordCount,
    confidence: validation.confidence,
    resumeDetected: validation.resumeDetected,
    detectedSignals: validation.detectedSignals,
    overallLabel,
    atsLabel,
    hasJobDescription,
    personalInfo: structuredInfo.personalInfo,
    summary: structuredInfo.summary,
    skills: structuredInfo.skills,
    education: structuredInfo.education,
    experience: structuredInfo.experience,
    projects: structuredInfo.projects,
    certifications: structuredInfo.certifications,
    scores,
    detectedSkills,
    matchedSkills,
    missingSkills,
    sections,
    strengths,
    improvements,
    suggestions,
    analyzedAt: new Date().toISOString()
  };
}

module.exports = {
  extractSections,
  extractContactInfo,
  extractSkills,
  analyzeResumeText
};
