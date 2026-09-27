const mongoose = require("mongoose");

const ResumeAnalysisSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    analyzedAt: {
      type: Date,
      default: Date.now,
    },

    candidate: {
      name: String,
      email: String,
      phone: String,
      linkedin: String,
      github: String,
    },

    scores: {
      overall: Number,
      ats: Number,
      keywords: Number,
      skills: Number,
      experience: Number,
      education: Number,
      projects: Number,
      formatting: Number,
      contact: Number,
    },

    skills: [String],

    education: [mongoose.Schema.Types.Mixed],

    projects: [mongoose.Schema.Types.Mixed],

    certifications: [mongoose.Schema.Types.Mixed],

    improvements: [String],

    suggestions: [String],

    validation: {
      resumeDetected: Boolean,
      confidence: Number,
      signals: [mongoose.Schema.Types.Mixed],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ResumeAnalysis", ResumeAnalysisSchema);