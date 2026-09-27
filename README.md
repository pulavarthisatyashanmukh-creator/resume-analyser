# Resume Analyzer - React Frontend

Migrated from the supplied HTML/CSS/JavaScript frontend into a Vite + React application.

## Pages
- `/` Home
- `/upload` Upload Resume
- `/analysis` Analysis Report
- `/tips` Resume Tips
- `/about` About
- `/contact` Contact

## Run
```bash
npm install
npm run dev
```
Then open the local Vite URL shown in the terminal.

## Current behavior
- React Router handles page navigation.
- Upload page validates PDF/DOCX and 10 MB maximum size.
- Selected filename is displayed.
- Drag and drop is supported.
- Resume is uploaded to the backend, parsed, validated, and analyzed.
- Analysis is saved to MongoDB Atlas and returned to the frontend.
- Analysis results are stored in sessionStorage and displayed on the Analysis page.
- Analysis scores animate with real backend data.
- Contact page submits messages to the backend API.

## Important
The frontend sends resumes to the backend (`POST /api/resumes/upload`) for content-based analysis. Scores are calculated dynamically from extracted content — no hardcoded or demo values are used.
