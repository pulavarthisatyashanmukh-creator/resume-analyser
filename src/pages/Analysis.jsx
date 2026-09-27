import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─────────────────────────────────────────────────────────────────────────────
// CSS — original design preserved exactly
// ─────────────────────────────────────────────────────────────────────────────
const pageCss = `
:root {
  --green: #2e7d5b; --light-green: #dcefe5; --navy: #102a43;
  --off-white: #f8f6f0; --cement: #c8c5bc; --white: #ffffff;
}
body { margin:0; font-family:Arial,sans-serif; background-color:var(--off-white); color:var(--navy); }

.navbar { background-color:var(--navy); padding:15px 0; }
.navbar-brand { color:white !important; font-size:25px; font-weight:bold; }
.navbar-brand span { color:#7acb9a; }
.nav-link { color:white !important; margin-left:15px; font-weight:500; }
.nav-link:hover { color:#7acb9a !important; }

.report-header { background-color:var(--light-green); padding:55px 20px; text-align:center; }
.report-header h1 { font-size:40px; font-weight:bold; }
.report-header h1 span { color:var(--green); }
.report-header p { color:#667; font-size:17px; margin:0; }

.report-section { padding:50px 0; }

.report-card { background-color:white; border-radius:15px; padding:30px; height:100%; box-shadow:0 5px 20px rgba(0,0,0,.08); }
.report-card h3 { color:var(--navy); font-weight:bold; margin-bottom:25px; display:flex; align-items:center; gap:8px; }

.score-circle {
  width:170px; height:170px; border-radius:50%; background-color:var(--light-green);
  border:12px solid var(--green); display:flex; flex-direction:column;
  align-items:center; justify-content:center; margin:auto;
}
.score-circle h2 { font-size:48px; font-weight:bold; color:var(--green); margin:0; }
.score-circle span { color:#666; font-size:14px; }
.score-title { text-align:center; margin-top:20px; font-weight:bold; font-size:16px; }

.skill { margin-bottom:22px; }
.skill-header { display:flex; justify-content:space-between; margin-bottom:7px; font-weight:bold; }
.progress { height:10px; border-radius:10px; background:#e9ecef; overflow:hidden; }
.progress-bar { background-color:var(--green); height:100%; border-radius:10px; transition:width 0.9s ease; }

.ats-box { background-color:var(--light-green); border-radius:12px; padding:20px; text-align:center; }
.ats-box h2 { color:var(--green); font-size:38px; font-weight:bold; margin:0; }
.ats-box p { margin:8px 0 0; }

.report-list { list-style:none; padding:0; margin:0; }
.report-list li { padding:12px 0; border-bottom:1px solid #eee; display:flex; align-items:flex-start; gap:8px; line-height:1.5; }
.report-list li:last-child { border-bottom:none; }
.check { color:var(--green); flex-shrink:0; }
.warning { color:#c48a00; flex-shrink:0; }
.missing-i { color:#c62828; flex-shrink:0; }

.skill-badge { display:inline-block; background:var(--light-green); color:var(--navy); border-radius:20px; padding:4px 14px; font-size:13px; font-weight:600; margin:4px; }
.skill-badge.matched { background:#d4edda; color:#1a5c2a; }
.skill-badge.missing  { background:#fce4e4; color:#b71c1c; }

.suggestion { background-color:#f7fbf8; border-left:5px solid var(--green); padding:15px; margin-bottom:12px; border-radius:5px; }
.suggestion strong { color:var(--navy); display:block; margin-bottom:4px; }
.suggestion p { margin:0; color:#555; font-size:14px; }

.upload-again { display:inline-block; background-color:var(--green); color:white; text-decoration:none; padding:13px 25px; border-radius:8px; margin-top:20px; font-size:15px; }
.upload-again:hover { background-color:var(--navy); color:white; }

.invalid-card { max-width:650px; margin:60px auto; background:white; border-radius:18px; box-shadow:0 8px 30px rgba(0,0,0,.1); padding:45px; text-align:center; }
.invalid-icon { font-size:60px; margin-bottom:20px; }
.invalid-card h2 { font-weight:bold; margin-bottom:12px; }
.invalid-card p { color:#555; font-size:16px; margin-bottom:8px; line-height:1.6; }
.invalid-sub { font-size:14px; color:#888; margin-bottom:28px; }
.btn-try-again { background:var(--green); color:white; border:none; padding:13px 30px; border-radius:8px; font-size:16px; cursor:pointer; text-decoration:none; display:inline-block; }
.btn-try-again:hover { background:var(--navy); color:white; }

.no-data-card { max-width:550px; margin:80px auto; text-align:center; padding:40px; }

footer { background-color:#091c2c; color:var(--cement); text-align:center; padding:20px; }
footer p { margin:0; }

@media(max-width:768px){
  .report-header h1 { font-size:32px; }
  .report-card { margin-bottom:20px; }
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// Animated counter — counts up from 0 to target
// ─────────────────────────────────────────────────────────────────────────────
function useCountUp(target, duration = 700) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === null || target === undefined) return;
    cancelAnimationFrame(rafRef.current);
    const startTime = performance.now();
    const animate = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      setVal(Math.round(p * target));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return val;
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated progress bar component
// ─────────────────────────────────────────────────────────────────────────────
function ScoreBar({ label, value }) {
  const animated = useCountUp(value, 800);
  return (
    <div className="skill">
      <div className="skill-header">
        <span>{label}</span>
        <span>{animated}%</span>
      </div>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${animated}%` }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Analysis page
// ─────────────────────────────────────────────────────────────────────────────
export default function Analysis() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = "Analysis Report | Resume Analyzer";

    // Always clear stale localStorage from the old hardcoded implementation
    localStorage.removeItem("resumeAnalysis");

    // Read from sessionStorage — populated by Upload.jsx after real analysis
    const raw = sessionStorage.getItem("resumeAnalysis");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setData(parsed);
      } catch {
        setData(null);
      }
    } else {
      setData(null);
    }
    setReady(true);
  }, []);

  // Animated top-level numbers — run after real data loads
  const overallAnim = useCountUp(data?.isValid ? data.overallScore : 0);
  const atsAnim     = useCountUp(data?.isValid ? data.atsScore     : 0);
  const kwAnim      = useCountUp(data?.isValid ? data.keywordScore  : 0);

  // ── Wait for data load ──────────────────────────────────────────────────
  if (!ready) return null;

  // ── No analysis data at all ─────────────────────────────────────────────
  if (!data) {
    return (
      <>
        <style>{pageCss}</style>
        <Navbar />
        <main>
          <div className="no-data-card">
            <i className="bi bi-file-earmark-x" style={{ fontSize: 60, color: "#c48a00" }}></i>
            <h2 style={{ marginTop: 20, color: "var(--navy)" }}>No Analysis Found</h2>
            <p style={{ color: "#666", marginTop: 12 }}>
              No resume analysis found. Please upload a resume first.
            </p>
            <a href="/upload" className="upload-again" style={{ marginTop: 25 }}>
              <i className="bi bi-upload"></i>&nbsp; Upload Resume
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Document is not a resume / extraction failed ─────────────────────────
  if (!data.isValid) {
    const isNotResume   = data.error === "NOT_A_RESUME" || data.error === "INVALID_RESUME";
    const isEmpty       = data.error === "INSUFFICIENT_TEXT" || data.error === "EMPTY_FILE";
    const isDocError    = data.error === "DOC_NOT_SUPPORTED" || data.error === "UNSUPPORTED_FORMAT";
    const isFailed      = data.error === "EXTRACTION_FAILED" || data.error === "NETWORK_ERROR" || data.error === "SERVER_ERROR";

    return (
      <>
        <style>{pageCss}</style>
        <Navbar />
        <main>
          <div className="container">
            <div className="invalid-card">
              <div className="invalid-icon" style={{ color: isNotResume ? "#c62828" : "#c48a00" }}>
                <i className={isNotResume ? "bi bi-file-earmark-x" : "bi bi-exclamation-triangle"}></i>
              </div>

              <h2 style={{ color: isNotResume ? "#b71c1c" : "#7d5200" }}>
                {isNotResume   ? "Invalid Resume Document"     :
                 isEmpty       ? "Unable to Extract Content"   :
                 isDocError    ? "Unsupported File Format"     :
                 data.error === "NETWORK_ERROR" ? "Connection Error" :
                 "Document Error"}
              </h2>

              {isNotResume ? (
                <>
                  <p style={{ fontSize: "16px", color: "#333", marginBottom: "12px", fontWeight: "600" }}>
                    The uploaded document does not appear to be a resume.
                  </p>
                  {data.rejectionReason && (
                    <div style={{ background: "#fdf2f2", borderLeft: "4px solid #b71c1c", padding: "10px 16px", margin: "14px auto", maxWidth: "520px", textAlign: "left", borderRadius: "4px" }}>
                      <strong style={{ color: "#b71c1c", fontSize: "13px" }}>Document Reason:</strong>
                      <span style={{ color: "#444", fontSize: "13px", marginLeft: "6px" }}>{data.rejectionReason}</span>
                    </div>
                  )}
                  <p className="invalid-sub">
                    Please upload a genuine resume containing sections such as
                    Skills, Education, Experience, Projects, or a professional summary.
                  </p>
                </>
              ) : (
                <p>{data.message}</p>
              )}
              {isEmpty && (
                <p className="invalid-sub">
                  If this is a scanned PDF, please use a text-based PDF or DOCX version of your resume.
                </p>
              )}
              {isDocError && (
                <p className="invalid-sub">
                  Old .doc files cannot be reliably parsed in the browser.<br />
                  Please save your resume as PDF or DOCX and re-upload.
                </p>
              )}

              <br />
              <a href="/upload" className="btn-try-again">
                <i className="bi bi-arrow-repeat"></i>&nbsp; Upload Another Resume
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Valid resume — render full dynamic report ────────────────────────────
  const {
    fileName, overallLabel, atsLabel, keywordScore,
    skillsScore, experienceScore, educationScore,
    projectsScore, formattingScore,
    detectedSkills, matchedSkills, missingSkills,
    sections, contactInfo,
    strengths, weaknesses, recommendations,
    hasJobDescription, analyzedAt, wordCount,
  } = data;

  const sectionChecklist = [
    { key: "summary",        label: "Professional Summary / Objective" },
    { key: "experience",     label: "Work Experience / Internship" },
    { key: "education",      label: "Education" },
    { key: "skills",         label: "Technical Skills" },
    { key: "projects",       label: "Projects" },
    { key: "certifications", label: "Certifications" },
    { key: "achievements",   label: "Achievements" },
    { key: "languages",      label: "Languages" },
  ];

  return (
    <>
      <style>{pageCss}</style>
      <Navbar />

      <main>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <section className="report-header">
          <h1>Resume <span>Analysis Report</span></h1>
          <p>Performance report for <strong>{fileName}</strong></p>
          {analyzedAt && (
            <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
              Analyzed on {new Date(analyzedAt).toLocaleString()} &nbsp;·&nbsp; {wordCount} words extracted
            </p>
          )}
        </section>

        {/* ── Report body ────────────────────────────────────────────────── */}
        <section className="report-section">
          <div className="container">

            {/* Row 1 — Overall Score · ATS · Keyword */}
            <div className="row g-4 mb-4">

              <div className="col-lg-4">
                <div className="report-card text-center">
                  <h3 style={{ justifyContent: "center" }}>Overall Resume Score</h3>
                  <div className="score-circle">
                    <h2>{overallAnim}</h2>
                    <span>out of 100</span>
                  </div>
                  <div className="score-title">{overallLabel}</div>
                  <p className="text-muted mt-2" style={{ fontSize: 14 }}>
                    {data.overallScore >= 80
                      ? "Your resume is strong. Keep refining it for each application."
                      : data.overallScore >= 60
                      ? "Good foundation — some targeted improvements will make a big difference."
                      : "Your resume needs improvement in several key areas."}
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="report-card">
                  <h3><i className="bi bi-robot"></i> ATS Compatibility</h3>
                  <div className="ats-box">
                    <h2>{atsAnim}%</h2>
                    <p>{atsLabel}</p>
                  </div>
                  <p className="text-muted mt-3" style={{ fontSize: 14 }}>
                    {data.atsScore >= 75
                      ? "Your resume is well-optimised for Applicant Tracking Systems."
                      : data.atsScore >= 50
                      ? "Moderate ATS compatibility — add more standard sections and keywords."
                      : "Your resume may not pass ATS filters. Ensure all key sections are present and clearly labelled."}
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="report-card">
                  <h3><i className="bi bi-key"></i> Keyword Score</h3>
                  <div className="ats-box">
                    <h2>{kwAnim}%</h2>
                    <p>{hasJobDescription ? "Job Description Match" : "General Keyword Readiness"}</p>
                  </div>
                  <p className="text-muted mt-3" style={{ fontSize: 14 }}>
                    {hasJobDescription
                      ? `Your resume matches ${matchedSkills.length} out of ${matchedSkills.length + missingSkills.length} detected job keywords.`
                      : "Paste a job description on the Upload page for precise keyword matching."}
                  </p>
                </div>
              </div>
            </div>

            {/* Row 2 — Performance bars + Sections checklist */}
            <div className="row g-4 mb-4">

              <div className="col-lg-7">
                <div className="report-card">
                  <h3><i className="bi bi-bar-chart"></i> Resume Performance</h3>
                  <ScoreBar label="Skills"     value={skillsScore} />
                  <ScoreBar label="Experience" value={experienceScore} />
                  <ScoreBar label="Education"  value={educationScore} />
                  <ScoreBar label="Projects"   value={projectsScore} />
                  <ScoreBar label="Formatting" value={formattingScore} />
                  <ScoreBar label="Keywords"   value={keywordScore} />
                </div>
              </div>

              <div className="col-lg-5">
                <div className="report-card">
                  <h3><i className="bi bi-file-text"></i> Resume Sections</h3>
                  <ul className="report-list">
                    {sectionChecklist.map(({ key, label }) => (
                      <li key={key}>
                        {sections[key]
                          ? <i className="bi bi-check-circle-fill check"></i>
                          : <i className="bi bi-exclamation-circle-fill warning"></i>}
                        <span>
                          {label}
                          {!sections[key] && <span style={{ fontSize: 11, color: "#bbb", marginLeft: 4 }}>(not detected)</span>}
                        </span>
                      </li>
                    ))}
                    <li>
                      {contactInfo?.email
                        ? <i className="bi bi-check-circle-fill check"></i>
                        : <i className="bi bi-exclamation-circle-fill warning"></i>}
                      Email Address
                    </li>
                    <li>
                      {contactInfo?.phone
                        ? <i className="bi bi-check-circle-fill check"></i>
                        : <i className="bi bi-exclamation-circle-fill warning"></i>}
                      Phone Number
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Row 3 — Detected Skills */}
            <div className="row g-4 mb-4">
              <div className="col-12">
                <div className="report-card">
                  <h3>
                    <i className="bi bi-code-slash"></i>
                    Detected Technical Skills
                    <span style={{ fontWeight: "normal", fontSize: 14, color: "#888" }}>
                      &nbsp;({detectedSkills.length} found)
                    </span>
                  </h3>
                  {detectedSkills.length > 0
                    ? detectedSkills.map(s => <span key={s} className="skill-badge">{s}</span>)
                    : (
                      <p className="text-muted" style={{ fontSize: 14 }}>
                        No recognisable technical skills detected. Make sure your resume lists skills clearly in a dedicated section.
                      </p>
                    )
                  }
                </div>
              </div>
            </div>

            {/* Row 4 — Matched / Missing (only with job description) */}
            {hasJobDescription && (
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="report-card">
                    <h3 style={{ color: "#1a5c2a" }}>
                      <i className="bi bi-check-circle"></i>
                      Matched Skills
                      <span style={{ fontWeight: "normal", fontSize: 14, color: "#888" }}>
                        &nbsp;({matchedSkills.length})
                      </span>
                    </h3>
                    {matchedSkills.length > 0
                      ? matchedSkills.map(s => <span key={s} className="skill-badge matched">{s}</span>)
                      : <p className="text-muted" style={{ fontSize: 14 }}>No matching skills detected for this job description.</p>
                    }
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="report-card">
                    <h3 style={{ color: "#b71c1c" }}>
                      <i className="bi bi-x-circle"></i>
                      Missing Skills
                      <span style={{ fontWeight: "normal", fontSize: 14, color: "#888" }}>
                        &nbsp;({missingSkills.length})
                      </span>
                    </h3>
                    {missingSkills.length > 0
                      ? missingSkills.map(s => <span key={s} className="skill-badge missing">{s}</span>)
                      : <p style={{ color: "#1a5c2a", fontSize: 14 }}>Your resume covers all the skills detected in this job description!</p>
                    }
                  </div>
                </div>
              </div>
            )}

            {/* Row 5 — Strengths / Weaknesses */}
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="report-card">
                  <h3><i className="bi bi-check-circle"></i> Strengths</h3>
                  {strengths.length > 0
                    ? (
                      <ul className="report-list">
                        {strengths.map((s, i) => (
                          <li key={i}><i className="bi bi-check-circle-fill check"></i>{s}</li>
                        ))}
                      </ul>
                    )
                    : <p className="text-muted" style={{ fontSize: 14 }}>No specific strengths detected — try improving the sections listed above.</p>
                  }
                </div>
              </div>

              <div className="col-md-6">
                <div className="report-card">
                  <h3><i className="bi bi-exclamation-triangle"></i> Areas to Improve</h3>
                  {weaknesses.length > 0
                    ? (
                      <ul className="report-list">
                        {weaknesses.map((w, i) => (
                          <li key={i}><i className="bi bi-exclamation-circle-fill warning"></i>{w}</li>
                        ))}
                      </ul>
                    )
                    : (
                      <p style={{ color: "var(--green)", fontWeight: "bold", fontSize: 14 }}>
                        Excellent — no major weaknesses detected!
                      </p>
                    )
                  }
                </div>
              </div>
            </div>

            {/* Row 6 — Recommendations */}
            <div className="row">
              <div className="col-12">
                <div className="report-card">
                  <h3><i className="bi bi-lightbulb"></i> Improvement Suggestions</h3>

                  {recommendations.length > 0
                    ? recommendations.map((r, i) => (
                      <div className="suggestion" key={i}>
                        <strong>{i + 1}. {r}</strong>
                      </div>
                    ))
                    : (
                      <div className="suggestion">
                        <strong>Your resume looks strong!</strong>
                        <p>Keep it updated as you gain new skills and experience.</p>
                      </div>
                    )
                  }

                  <div className="text-center">
                    <a href="/upload" className="upload-again">
                      <i className="bi bi-arrow-repeat"></i>&nbsp; Analyze Another Resume
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
