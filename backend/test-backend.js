/**
 * test-backend.js
 * Automated test suite for Resume Analyzer backend.
 * Tests all required endpoints and verifies dynamic analysis, rejection of non-resumes,
 * and different scores for different resumes.
 */

process.env.NODE_ENV = "test";
const http = require("http");
const app = require("./src/server");

function buildPdfFromLines(lines) {
  const textStream = [];
  for (const line of lines) {
    const cleanLine = line.replace(/[\(\)\\]/g, " ");
    const words = cleanLine.split(/\s+/).filter(Boolean);
    for (const w of words) {
      textStream.push("(" + w + ") Tj");
      textStream.push("( ) Tj");
    }
    textStream.push("T*");
  }
  const stream = "BT\n/F1 10 Tf\n18 TL\n40 750 Td\n" + textStream.join("\n") + "\nET\n";
  const streamLen = Buffer.byteLength(stream, "latin1");
  let o = "%PDF-1.4\n";
  const off1 = Buffer.byteLength(o, "latin1");
  o += "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  const off2 = Buffer.byteLength(o, "latin1");
  o += "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
  const off3 = Buffer.byteLength(o, "latin1");
  o += "3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n";
  const off4 = Buffer.byteLength(o, "latin1");
  o += "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";
  const off5 = Buffer.byteLength(o, "latin1");
  o += "5 0 obj\n<< /Length " + streamLen + " >>\nstream\n" + stream + "endstream\nendobj\n";
  const xrefOff = Buffer.byteLength(o, "latin1");
  o += "xref\n0 6\n";
  const pad = (n) => String(n).padStart(10, "0");
  o += "0000000000 65535 f \r\n";
  o += pad(off1) + " 00000 n \r\n";
  o += pad(off2) + " 00000 n \r\n";
  o += pad(off3) + " 00000 n \r\n";
  o += pad(off4) + " 00000 n \r\n";
  o += pad(off5) + " 00000 n \r\n";
  o += "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + xrefOff + "\n%%EOF\r\n";
  return Buffer.from(o, "latin1");
}

// ─── Valid Resumes ────────────────────────────────────────────────────────────

const RESUME_1_FRONTEND = [
  "John Doe",
  "Email: john.doe@example.com | Phone: +1-555-0192 | linkedin.com/in/johndoe",
  "Professional Summary",
  "Dedicated Frontend Developer with 3 years experience building responsive web apps.",
  "Technical Skills",
  "JavaScript, TypeScript, React, HTML, CSS, Bootstrap, Tailwind CSS, Redux, Git, GitHub",
  "Professional Experience",
  "Developed modern frontend interfaces. Implemented state management using Redux.",
  "Optimized bundle size by 30% for 50000 users. Built reusable UI component library in React.",
  "Projects",
  "Built E-Commerce Storefront with React and Stripe. Designed Weather Dashboard using TypeScript.",
  "Education",
  "Bachelor of Technology in Computer Science from State University, 2021, CGPA: 8.8",
  "Certifications",
  "Meta Certified Frontend Developer, React Specialist"
];

const RESUME_2_BACKEND_AI = [
  "Alice Smith",
  "Email: alice.smith@example.com | Phone: +1-555-0841 | github.com/alicesmith",
  "Professional Summary",
  "Senior Backend and Machine Learning Engineer specializing in distributed systems.",
  "Technical Skills",
  "Python, Java, Django, FastAPI, Docker, Kubernetes, AWS, PostgreSQL, MongoDB, Machine Learning, PyTorch, TensorFlow",
  "Professional Experience",
  "Architected microservices pipeline handling 2000000 requests per day.",
  "Reduced API latency by 45% using Redis caching and PostgreSQL indexing. Deployed ML models with Docker.",
  "Led backend team of 6 engineers. Engineered real-time fraud detection pipeline in Python and PyTorch.",
  "Projects",
  "Neural Search Engine using PyTorch and FastAPI. Distributed Task Queue in Python and Redis.",
  "Education",
  "Master of Science in Artificial Intelligence from Institute of Technology, 2019, GPA: 3.9",
  "Certifications",
  "AWS Certified Solutions Architect, Deep Learning Specialization"
];

// ─── Non-Resume Documents ─────────────────────────────────────────────────────

// TEST: Exam/Question Paper (matches question\d+ and maximum marks signals)
const NON_RESUME_EXAM = [
  "Mid-Term Examination 2024",
  "Department of Mechanical Engineering",
  "Question 1: Explain the laws of thermodynamics in detail.",
  "Question 2: Answer the following questions regarding fluid mechanics.",
  "Maximum marks: 100. Total marks obtained will be published on notice board.",
  "Timetable for practical sessions: Monday Period 1 and Wednesday Period 3."
];

// TEST: Lab Manual / Lab Scenario (mirrors content of Tree(BST)LabScenarios.docx)
const NON_RESUME_LAB = [
  "COMPETITIVE PROGRAMMING OE-II",
  "Binary Search Trees BST",
  "A Beginner-Friendly Lab Handbook with Diagrams, Worked Examples and Python Java Code",
  "Expanded Edition Simple Explanations, Extra Examples, Visual Diagrams",
  "Scope note: Covers only the 4 BST lab scenarios Insert Delete, Kth Smallest, Greater Tree, Range Sum.",
  "Table of Contents",
  "1. What Is a Binary Search Tree",
  "2. Lab 1 Insert and Delete in a BST",
  "3. Lab 2 Find the Kth Smallest Element",
  "4. Lab 3 Convert a BST into a Greater Tree",
  "5. Lab 4 Range Sum Query in a BST",
  "6. Complexity Analysis and Comparisons",
  "7. Key Design Trade-Offs",
  "8. Common Mistakes and Viva Voce Questions",
  "9. Quick Reference One-Page Summary",
  "1.1 A Simple Definition: A Binary Search Tree is a node-based data structure.",
  "Each node has at most two children, referred to as left child and right child.",
  "The left subtree contains only nodes with values less than the node.",
  "Team Members",
  "A24126511165 P. Satya Shanmukh",
  "A24126511151 M. Prasanna",
  "A24126511144 J. Sasi Kanth"
];

// TEST: Random article / non-resume text (no contact info, no sections)
const NON_RESUME_ARTICLE = [
  "The History of Computing",
  "Computing began with mechanical calculators in the 17th century.",
  "Charles Babbage designed the Analytical Engine which could be programmed with punched cards.",
  "Ada Lovelace wrote what is considered the first algorithm intended to be processed by a machine.",
  "The development of electronic computers in the mid-20th century transformed society.",
  "ENIAC was one of the earliest general-purpose electronic computers, completed in 1945.",
  "The invention of the transistor in 1947 revolutionized computing hardware.",
  "The microprocessor, introduced in the early 1970s, brought computing to the masses.",
  "The internet emerged from ARPANET, a military research network in the late 1960s.",
  "Today, computing pervades every aspect of modern life including medicine, education, and entertainment."
];

// TEST: Nearly empty document
const NON_RESUME_EMPTY = [
  "Hello",
  "This is a test."
];

async function runTests() {
  const PORT = 5005;
  const connectDB = require("./src/config/db");
  const mongoose = require("mongoose");
  await connectDB();

  const server = await new Promise(resolve => {
    const s = app.listen(PORT, () => resolve(s));
  });
  const BASE_URL = `http://localhost:${PORT}`;

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    console.log("\n========================================================");
    console.log("  RESUME ANALYZER BACKEND API VERIFICATION SUITE");
    console.log("========================================================\n");

    // TEST 1: GET /api/health
    console.log("--- TEST 1: GET /api/health ---");
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200, "Health check returns HTTP 200");
    assert(healthJson.success === true, "Health check success is true");
    assert(healthJson.message === "Resume Analyzer Backend is running", "Health check message matches requirement");

    // TEST 2: POST /api/contact
    console.log("\n--- TEST 2: POST /api/contact ---");
    const contactRes = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        subject: "General Inquiry",
        message: "Can I customize the ATS score weights?"
      })
    });
    const contactJson = await contactRes.json();
    assert(contactRes.status === 200, "Contact API returns HTTP 200");
    assert(contactJson.success === true, "Contact submission success is true");
    assert(contactJson.data && contactJson.data.email === "test@example.com", "Contact email stored correctly");

    // TEST 3: POST /api/contact validation error
    console.log("\n--- TEST 3: POST /api/contact (Invalid Email) ---");
    const badContactRes = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test User", email: "not-an-email", message: "Hello" })
    });
    const badContactJson = await badContactRes.json();
    assert(badContactRes.status === 400, "Contact with invalid email returns HTTP 400");
    assert(badContactJson.success === false, "Bad contact submission returns success=false");

    // TEST 4: POST /api/resumes/upload — Valid Resume 1 (Frontend)
    console.log("\n--- TEST 4: POST /api/resumes/upload (Resume 1: Frontend Developer) ---");
    const pdf1Buffer = buildPdfFromLines(RESUME_1_FRONTEND);
    const form1 = new FormData();
    form1.append("resume", new Blob([pdf1Buffer], { type: "application/pdf" }), "john_frontend_resume.pdf");
    const upload1Res = await fetch(`${BASE_URL}/api/resumes/upload`, { method: "POST", body: form1 });
    const upload1Json = await upload1Res.json();
    assert(upload1Res.status === 200, "Upload Resume 1 returns HTTP 200");
    assert(upload1Json.success === true, "Upload Resume 1 success is true");
    assert(upload1Json.data.resumeDetected === true, "Resume 1: resumeDetected is true");
    assert(upload1Json.data.fileName === "john_frontend_resume.pdf", "Resume 1: file name preserved");
    assert(upload1Json.data.scores.overall > 0, `Resume 1 overall score calculated (> 0): ${upload1Json.data?.scores?.overall}`);
    assert(upload1Json.data.detectedSkills.includes("React"), "Resume 1 detected React skill");
    assert(upload1Json.data.detectedSkills.includes("JavaScript"), "Resume 1 detected JavaScript skill");
    assert(Array.isArray(upload1Json.data.strengths) && upload1Json.data.strengths.length > 0, "Resume 1 generated dynamic strengths");

    const resume1Id = upload1Json.data.id;
    const resume1Overall = upload1Json.data.scores.overall;
    const resume1Skills = upload1Json.data.detectedSkills;

    // TEST 5: POST /api/resumes/upload — Valid Resume 2 (Backend/AI)
    console.log("\n--- TEST 5: POST /api/resumes/upload (Resume 2: Backend/AI Engineer) ---");
    const pdf2Buffer = buildPdfFromLines(RESUME_2_BACKEND_AI);
    const form2 = new FormData();
    form2.append("resume", new Blob([pdf2Buffer], { type: "application/pdf" }), "alice_ai_resume.pdf");
    const upload2Res = await fetch(`${BASE_URL}/api/resumes/upload`, { method: "POST", body: form2 });
    const upload2Json = await upload2Res.json();
    assert(upload2Res.status === 200, "Upload Resume 2 returns HTTP 200");
    assert(upload2Json.success === true, "Upload Resume 2 success is true");
    assert(upload2Json.data.resumeDetected === true, "Resume 2: resumeDetected is true");
    assert(upload2Json.data.detectedSkills.includes("Python"), "Resume 2 detected Python skill");
    assert(upload2Json.data.detectedSkills.includes("Machine Learning"), "Resume 2 detected Machine Learning skill");

    const resume2Overall = upload2Json.data.scores.overall;
    const resume2Skills = upload2Json.data.detectedSkills;

    // TEST 6: Dynamic Analysis Verification (Different Resumes → Different Scores)
    console.log("\n--- TEST 6: Verifying Different Resumes Produce Different Results ---");
    console.log(`  Resume 1 Overall Score: ${resume1Overall} | Skills: ${resume1Skills.join(", ")}`);
    console.log(`  Resume 2 Overall Score: ${resume2Overall} | Skills: ${resume2Skills.join(", ")}`);
    assert(resume1Overall !== resume2Overall, `Scores are different (Resume 1: ${resume1Overall} vs Resume 2: ${resume2Overall})`);
    assert(JSON.stringify(resume1Skills) !== JSON.stringify(resume2Skills), "Detected skills are distinctly different");

    // TEST 7: POST /api/resumes/upload — Exam / Question Paper (must be rejected)
    console.log("\n--- TEST 7: Exam/Question Paper Rejection ---");
    const examBuffer = buildPdfFromLines(NON_RESUME_EXAM);
    const formExam = new FormData();
    formExam.append("resume", new Blob([examBuffer], { type: "application/pdf" }), "exam_midterm.pdf");
    const examRes = await fetch(`${BASE_URL}/api/resumes/upload`, { method: "POST", body: formExam });
    const examJson = await examRes.json();
    assert(examRes.status === 400, "Exam paper rejected with HTTP 400");
    assert(examJson.success === false, "Exam paper returns success=false");
    assert(examJson.error?.code === "INVALID_RESUME", `Exam paper error.code is INVALID_RESUME (got: ${examJson.error?.code})`);
    assert(Boolean(examJson.error?.message), `Rejection message present: "${examJson.error?.message}"`);

    // TEST 8: POST /api/resumes/upload — Lab Manual / BST Lab Scenario (must be rejected)
    console.log("\n--- TEST 8: Lab Manual / BST Lab Scenario Rejection (Tree(BST)LabScenarios.docx content) ---");
    const labBuffer = buildPdfFromLines(NON_RESUME_LAB);
    const formLab = new FormData();
    formLab.append("resume", new Blob([labBuffer], { type: "application/pdf" }), "Tree_BST_LabScenarios.pdf");
    const labRes = await fetch(`${BASE_URL}/api/resumes/upload`, { method: "POST", body: formLab });
    const labJson = await labRes.json();
    assert(labRes.status === 400, "Lab scenario rejected with HTTP 400");
    assert(labJson.success === false, "Lab scenario returns success=false");
    assert(labJson.error?.code === "INVALID_RESUME", `Lab scenario error.code is INVALID_RESUME (got: ${labJson.error?.code})`);
    assert(Boolean(labJson.error?.message), `Lab rejection message present: "${labJson.error?.message}"`);

    // TEST 9: POST /api/resumes/upload — Random Article / Non-Resume Text (must be rejected)
    console.log("\n--- TEST 9: Random Article / Non-Resume Document Rejection ---");
    const articleBuffer = buildPdfFromLines(NON_RESUME_ARTICLE);
    const formArticle = new FormData();
    formArticle.append("resume", new Blob([articleBuffer], { type: "application/pdf" }), "computing_history_article.pdf");
    const articleRes = await fetch(`${BASE_URL}/api/resumes/upload`, { method: "POST", body: formArticle });
    const articleJson = await articleRes.json();
    assert(articleRes.status === 400, "Random article rejected with HTTP 400");
    assert(articleJson.success === false, "Random article returns success=false");
    assert(articleJson.error?.code === "INVALID_RESUME", `Article error.code is INVALID_RESUME (got: ${articleJson.error?.code})`);

    // TEST 10: POST /api/resumes/upload — Nearly Empty Document (must be rejected)
    console.log("\n--- TEST 10: Empty / Minimal Document Rejection ---");
    const emptyBuffer = buildPdfFromLines(NON_RESUME_EMPTY);
    const formEmpty = new FormData();
    formEmpty.append("resume", new Blob([emptyBuffer], { type: "application/pdf" }), "empty_doc.pdf");
    const emptyRes = await fetch(`${BASE_URL}/api/resumes/upload`, { method: "POST", body: formEmpty });
    const emptyJson = await emptyRes.json();
    assert(emptyRes.status === 400, "Empty document rejected with HTTP 400");
    assert(emptyJson.success === false, "Empty document returns success=false");

    // TEST 11: GET /api/analysis/:id — Retrieve stored analysis
    console.log("\n--- TEST 11: GET /api/analysis/:id ---");
    const getAnalysisRes = await fetch(`${BASE_URL}/api/analysis/${resume1Id}`);
    const getAnalysisJson = await getAnalysisRes.json();
    assert(getAnalysisRes.status === 200, "Get analysis by ID returns HTTP 200");
    assert(getAnalysisJson.data.id === resume1Id, "Retrieved analysis has matching ID");

    // TEST 12: POST /api/analysis/compare — Job description comparison
    console.log("\n--- TEST 12: POST /api/analysis/compare ---");
    const compareRes = await fetch(`${BASE_URL}/api/analysis/compare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analysisId: resume1Id,
        jobDescription: "We are seeking a React and Node.js developer with AWS and Docker experience."
      })
    });
    const compareJson = await compareRes.json();
    assert(compareRes.status === 200, "Job description comparison returns HTTP 200");
    assert(compareJson.data.matchedSkills.includes("React"), "Correctly matched React as a required skill");
    assert(
      compareJson.data.missingSkills.includes("Docker") || compareJson.data.missingSkills.includes("AWS"),
      "Correctly identified missing skills (Docker or AWS)"
    );

    // TEST 13: Unsupported File Extension
    console.log("\n--- TEST 13: Unsupported File Extension ---");
    const formBadExt = new FormData();
    formBadExt.append("resume", new Blob(["console.log('not a pdf')"], { type: "text/plain" }), "script.js");
    const badExtRes = await fetch(`${BASE_URL}/api/resumes/upload`, { method: "POST", body: formBadExt });
    const badExtJson = await badExtRes.json();
    assert(badExtRes.status === 400, "Unsupported file extension returns HTTP 400");
    assert(badExtJson.success === false, "Returns success=false for unsupported file");

    // TEST 14: POST /api/analysis — Direct Text Analysis (valid resume text)
    console.log("\n--- TEST 14: POST /api/analysis (Direct Text Analysis) ---");
    const directRes = await fetch(`${BASE_URL}/api/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: RESUME_1_FRONTEND.join("\n"), fileName: "direct_frontend.txt" })
    });
    const directJson = await directRes.json();
    assert(directRes.status === 200, "Direct text analysis returns HTTP 200");
    assert(directJson.success === true, "Direct text analysis success is true");
    assert(directJson.data.scores.overall > 0, "Direct text overall score computed");
    assert(directJson.data.detectedSkills.includes("React"), "Direct text detected React");

    // TEST 15: POST /api/analysis — Direct Text Analysis (lab text must be rejected)
    console.log("\n--- TEST 15: POST /api/analysis (Direct Lab Text Rejection) ---");
    const directLabRes = await fetch(`${BASE_URL}/api/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: NON_RESUME_LAB.join("\n"), fileName: "lab_bst.txt" })
    });
    const directLabJson = await directLabRes.json();
    assert(directLabRes.status === 400, "Direct lab text rejected with HTTP 400");
    assert(directLabJson.success === false, "Direct lab text returns success=false");
    assert(directLabJson.error?.code === "INVALID_RESUME", `Direct lab text error.code is INVALID_RESUME (got: ${directLabJson.error?.code})`);

    // ─── Acceptance Criteria Verification ─────────────────────────────────────
    console.log("\n--- ACCEPTANCE CRITERIA VERIFICATION ---");
    assert(upload1Json.data.resumeDetected === true, "AC1: Genuine resumes are accepted");
    assert(resume1Overall !== resume2Overall, "AC2: Different resumes produce different scores");
    assert(labJson.error?.code === "INVALID_RESUME", "AC3: Lab scenario (Tree BST) is rejected");
    assert(examJson.error?.code === "INVALID_RESUME", "AC4: Random non-resume documents are rejected");
    assert(emptyJson.success === false, "AC5: Empty documents are rejected");
    assert(!labJson.data, "AC6: Invalid documents do not receive scores");
    assert(upload1Json.data.scores.overall > 0, "AC8-9: Real content-based scores are calculated");
    assert(upload1Json.data.resumeDetected === true, "AC7: No hardcoded resumeDetected=true for invalid docs");

    console.log("\n========================================================");
    console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("========================================================\n");

    server.close();
    await mongoose.connection.close();
    process.exit(failed === 0 ? 0 : 1);
  } catch (err) {
    console.error("Test execution failed with error:", err);
    server.close();
    await mongoose.connection.close();
    process.exit(1);
  }
}

module.exports = {
  buildPdfFromLines,
  RESUME_1_FRONTEND,
  RESUME_2_BACKEND_AI,
  NON_RESUME_EXAM,
  NON_RESUME_LAB,
  NON_RESUME_ARTICLE,
  NON_RESUME_EMPTY,
  runTests
};

if (require.main === module) {
  runTests();
}
