/**
 * server.js
 * Express server entry point for Resume Analyzer Backend.
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const healthRoutes = require("./routes/healthRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const contactRoutes = require("./routes/contactRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development servers (5173, 5174) and tools
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: origin not allowed."));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body parsers
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Request logging in development
if (process.env.NODE_ENV !== "test") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// API Routes
app.use("/api", healthRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/contact", contactRoutes);

// 404 and Error Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Connect to MongoDB Atlas
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;