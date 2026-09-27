/**
 * resumeParser.js
 * Service for extracting and normalizing text from PDF and DOCX documents.
 * Never returns synthetic text. Throws descriptive errors when extraction fails.
 */

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

/**
 * Normalizes extracted text: collapses whitespace, trims, fixes line endings.
 */
function normalizeText(raw) {
  if (!raw || typeof raw !== "string") return "";
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

let parseQueue = Promise.resolve();

/**
 * Extracts raw text from a PDF buffer using pdf-parse.
 * Serialized through parseQueue to ensure no concurrent worker collisions in pdf.js.
 */
async function extractTextFromPDF(buffer) {
  return new Promise((resolve, reject) => {
    parseQueue = parseQueue
      .then(async () => {
        try {
          const uint8 = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
          const clean = new Uint8Array(uint8.length);
          clean.set(uint8);
          const data = await pdfParse(clean);
          resolve(data.text || "");
        } catch (err) {
          reject(new Error(`PDF_EXTRACTION_ERROR: ${err.message || "Failed to parse PDF document"}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Extracts raw text from a DOCX buffer using mammoth.
 */
async function extractTextFromDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (err) {
    throw new Error(`DOCX_EXTRACTION_ERROR: ${err.message || "Failed to parse DOCX document"}`);
  }
}

/**
 * Main parser entry point: extracts and normalizes text from an uploaded file object or buffer.
 * @param {Object} file - Express multer file object (has .buffer or .path, .originalname, .mimetype)
 * @returns {Promise<{ rawText: string, normalizedText: string, wordCount: number, fileType: string }>}
 */
async function parseResumeFile(file) {
  if (!file) {
    throw new Error("MISSING_FILE: No file provided for parsing.");
  }

  const originalName = file.originalname || "resume";
  const ext = path.extname(originalName).toLowerCase().replace(".", "");

  let buffer = file.buffer;
  if (!buffer && file.path) {
    const fs = require("fs");
    buffer = fs.readFileSync(file.path);
  }

  if (!buffer || buffer.length === 0 || file.size === 0) {
    throw new Error("EMPTY_FILE: The uploaded file is 0 bytes.");
  }

  let rawText = "";

  if (ext === "pdf" || file.mimetype === "application/pdf") {
    rawText = await extractTextFromPDF(buffer);
  } else if (
    ext === "docx" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    rawText = await extractTextFromDOCX(buffer);
  } else if (ext === "doc" || file.mimetype === "application/msword") {
    throw new Error(
      "DOC_NOT_SUPPORTED: Legacy binary .doc format is not supported. Please save and upload as .pdf or .docx."
    );
  } else {
    throw new Error(`UNSUPPORTED_FORMAT: Unsupported file format (.${ext}). Only PDF and DOCX are allowed.`);
  }

  const normalizedText = normalizeText(rawText);
  const wordCount = normalizedText ? normalizedText.split(/\s+/).filter(Boolean).length : 0;

  if (wordCount < 10) {
    throw new Error(
      "INSUFFICIENT_TEXT: Unable to extract readable text. The document may be empty, image-scanned, or password-protected."
    );
  }

  return {
    rawText,
    normalizedText,
    wordCount,
    fileType: ext
  };
}

module.exports = {
  normalizeText,
  parseResumeFile
};
