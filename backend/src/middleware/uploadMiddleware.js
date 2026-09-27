/**
 * uploadMiddleware.js
 * Multer configuration for resume uploads.
 * Restricts to PDF and DOCX, max size 10MB, field name 'resume'.
 */

const multer = require("multer");
const path = require("path");

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  const allowedExtensions = ["pdf", "docx"];

  if (!allowedExtensions.includes(ext)) {
    const error = new Error(`INVALID_FILE_TYPE: Only PDF and DOCX files are supported. Received .${ext}`);
    error.code = "INVALID_FILE_TYPE";
    return cb(error, false);
  }

  cb(null, true);
}

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  },
  fileFilter
});

const uploadSingle = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "resume", maxCount: 1 }
]);

const uploadResumeMiddleware = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) return next(err);
    if (req.files) {
      if (req.files.file && req.files.file[0]) {
        req.file = req.files.file[0];
      } else if (req.files.resume && req.files.resume[0]) {
        req.file = req.files.resume[0];
      }
    }
    next();
  });
};

module.exports = {
  uploadResumeMiddleware,
  MAX_FILE_SIZE
};
