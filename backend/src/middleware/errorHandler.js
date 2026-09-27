/**
 * errorHandler.js
 * Centralized error handling middleware.
 * Formats errors into consistent JSON responses.
 */

const multer = require("multer");

function errorHandler(err, req, res, next) {
  // Multer error handling
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: {
          code: "FILE_TOO_LARGE",
          message: "Uploaded file exceeds the 10 MB size limit."
        }
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        error: {
          code: "UNEXPECTED_FIELD",
          message: `Unexpected file field '${err.field}'. Please use the field name 'resume'.`
        }
      });
    }
    return res.status(400).json({
      success: false,
      error: {
        code: err.code || "UPLOAD_ERROR",
        message: err.message || "File upload failed."
      }
    });
  }

  // Custom known errors
  if (err.code === "INVALID_FILE_TYPE" || err.message?.startsWith("INVALID_FILE_TYPE")) {
    return res.status(400).json({
      success: false,
      error: {
        code: "UNSUPPORTED_FORMAT",
        message: err.message.replace("INVALID_FILE_TYPE: ", "")
      }
    });
  }

  if (err.code === "DOC_NOT_SUPPORTED" || err.message?.startsWith("DOC_NOT_SUPPORTED")) {
    return res.status(400).json({
      success: false,
      error: {
        code: "DOC_NOT_SUPPORTED",
        message: err.message.replace("DOC_NOT_SUPPORTED: ", "")
      }
    });
  }

  if (err.code === "EMPTY_FILE" || err.message?.startsWith("EMPTY_FILE")) {
    return res.status(400).json({
      success: false,
      error: {
        code: "EMPTY_FILE",
        message: "The uploaded file is empty (0 bytes)."
      }
    });
  }

  if (err.code === "INSUFFICIENT_TEXT" || err.message?.startsWith("INSUFFICIENT_TEXT")) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INSUFFICIENT_TEXT",
        message: "Unable to extract meaningful text from the document. Please ensure it contains selectable text."
      }
    });
  }

  // General server error
  console.error("[ServerError]", err);
  return res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: err.message || "An unexpected error occurred while processing your request."
    }
  });
}

function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `The endpoint ${req.method} ${req.originalUrl} does not exist.`
    }
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
