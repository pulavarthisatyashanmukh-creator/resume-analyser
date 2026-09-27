# Resume Analyzer — Backend REST API

A production-ready Node.js & Express.js REST API backend for extracting, validating, scoring, and analyzing candidate resumes against industry standards and job descriptions.

---

## 1. Project Architecture & Folder Structure

```
backend/
├── .env                              # Environment variables (PORT, NODE_ENV, CLIENT_URL)
├── .gitignore                        # Git exclusion rules (node_modules, .env, uploads)
├── package.json                      # Dependencies and script definitions
├── README.md                         # Full documentation & Postman guide
├── test-backend.js                   # Automated verification test suite (11 tests / 36 assertions)
└── src/
    ├── server.js                     # Express application entry point, middleware & route mounting
    ├── controllers/
    │   ├── analysisController.js     # Handlers for GET /api/analysis/:id, POST direct text, POST compare
    │   ├── contactController.js      # Handler for POST /api/contact
    │   └── resumeController.js       # Handler for POST /api/resumes/upload
    ├── middleware/
    │   ├── errorHandler.js           # Standardized error handling middleware (Multer, 404, 500)
    │   └── uploadMiddleware.js       # Multer memory storage (10MB limit, .pdf & .docx only)
    ├── routes/
    │   ├── analysisRoutes.js         # /api/analysis routes
    │   ├── contactRoutes.js          # /api/contact routes
    │   ├── healthRoutes.js           # /api/health route
    │   └── resumeRoutes.js           # /api/resumes routes
    ├── services/
    │   ├── resumeAnalyzer.js         # Content-derived scoring algorithms & dynamic recommendations
    │   ├── resumeParser.js           # Text extraction from PDF (pdf-parse) & DOCX (mammoth)
    │   └── resumeValidator.js        # Multi-signal resume vs non-resume document validator
    └── utils/
        ├── constants.js              # Skills dictionary, section patterns, negative signals
        └── storage.js                # Phase 1 in-memory data stores (analysisStore, contactMessagesStore)
```

---

## 2. Getting Started & Running Locally

### Prerequisites
- Node.js (v18, v20, v22, or v24)
- npm (v9+)

### Installation
From the `backend/` directory, install all required dependencies:
```bash
cd backend
npm install
```

### Environment Configuration (`.env`)
The backend is preconfigured with defaults in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Starting the Server
- **Production Mode**:
  ```bash
  npm start
  ```
- **Development Mode (with auto-reload via nodemon)**:
  ```bash
  npm run dev
  ```
Server will start and listen on `http://localhost:5000`:
```
[Server] Resume Analyzer Backend running in development mode on port 5000
[Server] CORS enabled for origin: http://localhost:5173
[Server] Health check available at http://localhost:5000/api/health
```

### Running Automated Test Suite
To run the automated backend test suite:
```bash
npm test
```
This executes all 11 integration tests covering health checks, file uploads, dynamic scoring differences, rejection of non-resume documents (HTTP 400), contact form validation, and job description skill matching.

---

## 3. Data Flow & Request Lifecycle

```
[React Frontend / Postman / Client]
               │
               ▼ HTTP Request
      [Express.js Server]
               │
               ├── CORS Middleware (Allows frontend on :5173)
               ├── Body Parser Middleware (JSON & URL-encoded)
               └── Route Dispatcher (/api/...)
                        │
                        ▼
           [Multer Upload Middleware]
          (Filters for .pdf / .docx, 10MB limit)
                        │
                        ▼
           [Controller (resumeController)]
                        │
                        ├──────────────────────────┐
                        ▼                          ▼
             [resumeParser Service]     [resumeValidator Service]
            - PDF (pdf-parse)           - Email & phone check
            - DOCX (mammoth)            - Section headers check
            - Whitespace normalization  - Negative signal check
                        │                          │
                        └──────────┬───────────────┘
                                   ▼
                       [resumeAnalyzer Service]
                      - Dynamic scoring (0-100)
                      - Extract skills & sections
                      - Strengths & improvements
                      - Job description comparison
                                   │
                                   ▼
                      [MongoDB Atlas Storage]
                      (ResumeAnalysis collection)
                                   │
                                   ▼
                         HTTP 200 / 400 JSON
```

---

## 4. Complete Postman API Reference

Base URL: `http://localhost:5000`

### 1. Health Check
Checks if the backend API server is alive and operational.
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/health`
- **Headers**: `Accept: application/json`
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Resume Analyzer Backend is running",
  "environment": "development",
  "timestamp": "2026-09-08T17:21:55.120Z"
}
```

---

### 2. Upload & Analyze Resume
Uploads a `.pdf` or `.docx` resume file and returns a content-derived analysis report.
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/resumes/upload`
- **Headers**: `None` (Multer sets `multipart/form-data` boundary automatically)
- **Body**: `form-data`
  - `resume`: `[File]` *(Select a .pdf or .docx file)*
  - `jobDescription`: `[Text]` *(Optional job description for ATS matching)*
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Resume analyzed successfully",
  "data": {
    "id": "analysis_1725816115120_abc12345",
    "fileName": "john_frontend_resume.pdf",
    "fileType": "pdf",
    "fileSize": 2497,
    "candidateName": "John Doe",
    "contactInfo": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1-555-0192",
      "linkedin": "linkedin.com/in/johndoe",
      "github": null
    },
    "scores": {
      "overall": 65,
      "ats": 72,
      "keyword": 55,
      "skills": 70,
      "experience": 60,
      "education": 70,
      "projects": 60,
      "formatting": 70,
      "contact": 80
    },
    "overallLabel": "Good",
    "sections": {
      "summary": true,
      "experience": true,
      "education": true,
      "skills": true,
      "projects": true,
      "certifications": true,
      "achievements": false,
      "languages": false
    },
    "detectedSkills": [
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
      "React",
      "Bootstrap",
      "Tailwind CSS",
      "Redux",
      "Git",
      "GitHub"
    ],
    "categorizedSkills": {
      "Frontend": ["JavaScript", "TypeScript", "HTML", "CSS", "React", "Bootstrap", "Tailwind CSS", "Redux"],
      "DevOps / Tools": ["Git", "GitHub"]
    },
    "matchedSkills": [],
    "missingSkills": [],
    "strengths": [
      "Detected 10 industry-standard technical skills highlighting strong functional capability.",
      "Professional Experience section is present and structured.",
      "Education background is clearly stated."
    ],
    "improvements": [
      "Include quantitative impact metrics (e.g., % growth, latency reduction, revenue impact) to validate claims.",
      "Add a GitHub profile link to showcase public code repositories."
    ],
    "suggestions": [
      "Quantify your accomplishments using the Google X-Y-Z formula: 'Accomplished [X], as measured by [Y], by doing [Z]'.",
      "Include active links to deployed live demos or GitHub code repositories."
    ],
    "createdAt": "2026-09-08T17:21:55.120Z"
  }
}
```
- **Non-Resume Document Rejection Response (`400 Bad Request`)**:
```json
{
  "success": false,
  "type": "INVALID_RESUME",
  "message": "Detected non-resume pattern (exam/assignment)",
  "confidence": 0,
  "evidence": []
}
```

---

### 3. Direct Text Analysis
Analyzes resume text directly from a JSON payload (useful for pasted resume text).
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/analysis`
- **Headers**: `Content-Type: application/json`
- **Body**: `raw (JSON)`
```json
{
  "text": "Jane Doe\nEmail: jane.doe@example.com\nSkills: React, Node.js, Python, PostgreSQL\nExperience: Senior Software Engineer at Tech Corp...",
  "fileName": "direct_input.txt",
  "jobDescription": "Looking for a React developer with Node.js and AWS experience."
}
```
- **Success Response (`200 OK`)**:
Returns structured analysis data identical to the upload response.

---

### 4. Job Description Comparison
Compares an existing resume analysis against a targeted job description.
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/analysis/compare`
- **Headers**: `Content-Type: application/json`
- **Body**: `raw (JSON)`
```json
{
  "analysisId": "analysis_1725816115120_abc12345",
  "jobDescription": "We are seeking a Senior React Developer with experience in TypeScript, Redux, Docker, and AWS."
}
```
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Job description comparison completed",
  "data": {
    "analysisId": "analysis_1725816115120_abc12345",
    "matchPercentage": 75,
    "matchedSkills": ["React", "TypeScript", "Redux"],
    "missingSkills": ["Docker", "AWS"],
    "totalJdSkills": 5,
    "recommendations": [
      "Consider learning or emphasizing missing skills: Docker, AWS.",
      "Add projects or certifications demonstrating experience with Docker, AWS."
    ]
  }
}
```

---

### 5. Get Analysis by ID
Retrieves a previously analyzed resume report by ID.
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/analysis/:id`
- **Headers**: `Accept: application/json`
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "id": "analysis_1725816115120_abc12345",
    "fileName": "john_frontend_resume.pdf",
    "scores": { "overall": 65, "ats": 72, "skills": 70 }
  }
}
```
- **Not Found Response (`404 Not Found`)**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "No analysis found with ID 'analysis_invalid_123'. Note: Server uses in-memory store in Phase 1 before MongoDB integration."
  }
}
```

---

### 6. Submit Contact Inquiry
Submits a message from the contact form.
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/contact`
- **Headers**: `Content-Type: application/json`
- **Body**: `raw (JSON)`
```json
{
  "name": "Sarah Connor",
  "email": "sarah@example.com",
  "subject": "ATS Integration Inquiry",
  "message": "Hello, how frequently is the technical skills dictionary updated?"
}
```
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Thank you for reaching out! Your message has been received.",
  "data": {
    "id": "contact_1725816115200_def67890",
    "name": "Sarah Connor",
    "email": "sarah@example.com",
    "subject": "ATS Integration Inquiry",
    "createdAt": "2026-09-08T17:21:55.200Z"
  }
}
```
- **Validation Error Response (`400 Bad Request`)**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_EMAIL",
    "message": "Please provide a valid email address."
  }
}
```

---

## 5. Scoring, Validation & Extraction Algorithms

### 1. Zero Hardcoding Guarantee
- **No Mock Scores**: Scores are calculated dynamically from extracted content.
- **No Random Numbers**: `Math.random()` is strictly prohibited in scoring logic.
- **Pure Determinism**: Re-analyzing the same document produces identical, reproducible results.

### 2. Multi-Signal Document Validation
The validator checks multiple positive and negative structural signals:
- **Contact Info**: Detection of valid email (+12), phone (+10), LinkedIn (+6), GitHub (+5).
- **Section Headers**: Detection of experience (+14), education (+14), skills (+10), summary (+6), projects (+8).
- **Skill Density**: Each identified technical skill adds +3 confidence (up to +18).
- **Word Count**: Documents between 120 and 1500 words receive +10 confidence.
- **Negative Signal Disqualification**: Documents matching patterns for exam questions, certificates of merit, marksheets, invoices, timetables, or academic citations are disqualified immediately and return **HTTP 400**.

### 3. Component Scoring Formulas
| Component | Weight | Calculation Logic |
|---|---|---|
| **Skills Score** | 20% | Number of detected skills scaled logarithmically (1-2 skills: 35, 3-5 skills: 55, 6-9 skills: 70, 10-14 skills: 85, 15+ skills: 95) + diversity across categories bonus. |
| **Experience Score** | 20% | Section presence (30pts) + action verb density (up to 35pts) + metric quantification presence (up to 35pts). |
| **Education Score** | 15% | Section presence (35pts) + degree mentions (B.Tech, MS, PhD: up to 35pts) + GPA / graduation year mentions (30pts). |
| **Projects Score** | 10% | Section presence (30pts) + project title patterns + technical stack mentions + live links. |
| **Formatting Score** | 10% | Optimal length (350-900 words: 40pts) + standard section count (30pts) + clean bullet/line formatting (30pts). |
| **Keyword Score** | 15% | If JD provided: % of JD keywords matched. If no JD: technical keyword richness vs benchmark. |
| **Contact Score** | 10% | Email (35pts) + phone (30pts) + LinkedIn (20pts) + GitHub/portfolio (15pts). |
| **Overall Score** | 100% | Weighted average of the above sub-scores. |

---

## 6. Storage — MongoDB Atlas

Resume analyses are persisted to **MongoDB Atlas** using Mongoose:
- **Resume Analyses**: Saved to the `resumeanalyses` collection via the `ResumeAnalysis` model on every successful upload.
- **Retrieval**: The `GET /api/analysis/:id` endpoint retrieves analyses from MongoDB by `_id`.
- **In-Memory Fallback**: The in-memory `analysisStore` is retained for backward compatibility with the direct text analysis API (`POST /api/analysis`).
- **Contact Submissions**: Currently stored in memory via `contactMessagesStore` (`Array`).
