import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { analyzeResume } from "../utils/resumeAnalyzer";

// ── Preserve all original CSS ────────────────────────────────────────────────
const pageCss = `
:root { --green:#2e7d5b; --light-green:#dcefe5; --navy:#102a43; --off-white:#f8f6f0; --cement:#c8c5bc; --white:#fff; }
body { margin:0; font-family:Arial,sans-serif; background:var(--off-white); color:var(--navy); }
.upload-section { min-height:650px; display:flex; align-items:center; padding:60px 0; }
.upload-container { max-width:750px; margin:auto; background:white; padding:45px; border-radius:20px; box-shadow:0 10px 35px rgba(16,42,67,.12); text-align:center; }
.upload-icon { width:90px;height:90px;margin:auto;background:var(--light-green);color:var(--green);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:45px; }
.upload-container h1 { margin-top:25px;font-weight:bold;color:var(--navy); }
.upload-container h1 span { color:var(--green); }
.upload-container > p { color:#667;font-size:17px; }
.upload-box { margin-top:30px;padding:45px 20px;border:2px dashed var(--green);border-radius:15px;background:#f7fbf8;cursor:pointer;transition:.3s;display:block; }
.upload-box:hover, .upload-box.drag-active { background:var(--light-green); }
.upload-box i { font-size:50px;color:var(--green); }
.upload-box h4 { margin-top:15px;font-weight:bold; }
.upload-box p { font-size:14px;color:#777;margin:0; }
.file-name { margin-top:15px;color:var(--green);font-weight:bold;min-height:24px; }
.analyze-btn { margin-top:25px;background:var(--green);color:white;border:none;padding:13px 35px;border-radius:8px;font-size:17px;cursor:pointer;transition:.2s; }
.analyze-btn:hover:not(:disabled) { background:var(--navy); }
.analyze-btn:disabled { opacity:.6;cursor:not-allowed; }
.info { margin-top:25px;font-size:14px;color:#777; }

/* Job description */
.jd-toggle { margin-top:22px;font-size:14px;color:var(--green);cursor:pointer;text-decoration:underline;background:none;border:none;padding:0; }
.jd-area { margin-top:12px;text-align:left; }
.jd-area label { font-size:14px;font-weight:bold;color:var(--navy);display:block;margin-bottom:6px; }
.jd-area textarea { width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;resize:vertical;min-height:100px;box-sizing:border-box; }
.jd-area textarea:focus { outline:none;border-color:var(--green);box-shadow:0 0 0 .2rem rgba(46,125,91,.15); }

/* Loading */
.loading-overlay { padding:30px 0; }
.loading-spinner { width:60px;height:60px;margin:auto;border:6px solid var(--light-green);border-top:6px solid var(--green);border-radius:50%;animation:spin .9s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
.loading-step { margin-top:20px;font-size:16px;font-weight:bold;color:var(--navy); }
.loading-progress { margin-top:8px;font-size:13px;color:#777; }

/* Inline error */
.upload-error { margin-top:20px;background:#fff3f3;border:1px solid #e57373;border-radius:10px;padding:16px 20px;color:#b71c1c;text-align:left;font-size:14px; }
.upload-error strong { display:block;margin-bottom:4px; }
`;

const LOADING_STEPS = [
  { label: "Reading Resume…",          sub: "Loading your document" },
  { label: "Extracting Information…",  sub: "Parsing text content" },
  { label: "Analyzing Resume…",        sub: "Calculating scores" },
  { label: "Generating Report…",       sub: "Preparing your results" },
];

const ALLOWED_EXT = [".pdf", ".docx"];
const MAX_SIZE    = 10 * 1024 * 1024; // 10 MB

export default function Upload() {
  const navigate = useNavigate();
  const inputRef  = useRef(null);
  const boxRef    = useRef(null);

  const [selectedFile,  setSelectedFile]  = useState(null);
  const [isDragging,    setIsDragging]    = useState(false);
  const [jobDesc,       setJobDesc]       = useState("");
  const [showJD,        setShowJD]        = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [loadingStep,   setLoadingStep]   = useState(0);
  const [error,         setError]         = useState("");

  // ── File validation ────────────────────────────────────────────────────────
  const validateFile = useCallback((file) => {
    if (!file) return "Please select a resume file.";
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) return "Unsupported file format. Please upload a PDF or DOCX file.";
    if (file.size > MAX_SIZE) return "File is too large. Maximum size is 10 MB.";
    return null;
  }, []);

  const handleFileChange = (file) => {
    setError("");
    if (!file) { setSelectedFile(null); return; }
    const err = validateFile(file);
    if (err) { setError(err); setSelectedFile(null); return; }
    setSelectedFile(file);
  };

  // ── Drag & drop ────────────────────────────────────────────────────────────
  const onDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop      = (e) => {
    e.preventDefault(); setIsDragging(false);
    handleFileChange(e.dataTransfer.files[0] || null);
  };

  // ── Analyse ────────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!selectedFile) { setError("Please select your resume first."); return; }
    const err = validateFile(selectedFile);
    if (err) { setError(err); return; }

    // Clear any old analysis from previous uploads
    sessionStorage.removeItem("resumeAnalysis");
    localStorage.removeItem("resumeAnalysis");
    setError("");
    setLoading(true);

    try {
      // Step 0: Reading
      setLoadingStep(0);
      await tick(200);

      // Step 1: Extracting
      setLoadingStep(1);
      await tick(100);

      // Step 2: Analyzing — actual work happens here (no demo data)
      setLoadingStep(2);
      const result = await analyzeResume(selectedFile, jobDesc);

      // Step 3: Generating report
      setLoadingStep(3);
      await tick(300);

      // Store result — sessionStorage only (not persisted across sessions)
      // Never stores raw resume text, only the structured analysis object
      sessionStorage.setItem("resumeAnalysis", JSON.stringify(result));
      navigate("/analysis");
    } catch (ex) {
      // NEVER fall back to demo data on exception
      console.error("[ResumeAnalyzer] Unexpected error:", ex?.message || ex);
      // Store error result and navigate so Analysis page shows a proper error card
      const errResult = {
        isValid: false,
        error: "EXTRACTION_FAILED",
        message:
          "Unable to read or analyze this document. " +
          "Please ensure the file is a valid, non-corrupted PDF or DOCX resume and try again.",
      };
      sessionStorage.setItem("resumeAnalysis", JSON.stringify(errResult));
      setLoading(false);
      navigate("/analysis");
    }
  };

  return (
    <>
      <style>{pageCss}</style>
      <Navbar />

      <main>
        <section className="upload-section">
          <div className="container">
            <div className="upload-container">

              <div className="upload-icon">
                <i className="bi bi-cloud-arrow-up"></i>
              </div>

              <h1>Upload Your <span>Resume</span></h1>
              <p>Upload your resume to analyze skills, experience, keywords and formatting.</p>

              {/* ── Drop zone ── */}
              {!loading && (
                <label
                  htmlFor="resumeFile"
                  className={`upload-box${isDragging ? " drag-active" : ""}`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  ref={boxRef}
                >
                  <i className="bi bi-file-earmark-text"></i>
                  <h4>Choose your resume</h4>
                  <p>PDF or DOCX files only &nbsp;·&nbsp; Drag & drop supported</p>
                  <input
                    type="file"
                    id="resumeFile"
                    accept=".pdf,.docx"
                    ref={inputRef}
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e.target.files[0] || null)}
                  />
                </label>
              )}

              {/* ── File name ── */}
              {!loading && (
                <div className="file-name">
                  {selectedFile ? `✓ Selected: ${selectedFile.name}` : "No file selected"}
                </div>
              )}

              {/* ── Job description toggle ── */}
              {!loading && (
                <>
                  <button
                    className="jd-toggle"
                    onClick={() => setShowJD(v => !v)}
                    type="button"
                  >
                    {showJD ? "▲ Hide Job Description (optional)" : "▼ Add Job Description for Better Keyword Matching (optional)"}
                  </button>

                  {showJD && (
                    <div className="jd-area">
                      <label htmlFor="jobDescInput">
                        Paste the job description here — we'll match your resume keywords against it.
                      </label>
                      <textarea
                        id="jobDescInput"
                        placeholder="E.g. We are looking for a Python developer with experience in Django, REST APIs, AWS, Docker…"
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}

              {/* ── Inline error ── */}
              {error && (
                <div className="upload-error" role="alert">
                  <strong>⚠ Error</strong>
                  {error}
                </div>
              )}

              {/* ── Loading UI ── */}
              {loading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                  <div className="loading-step">{LOADING_STEPS[loadingStep].label}</div>
                  <div className="loading-progress">{LOADING_STEPS[loadingStep].sub}</div>
                </div>
              )}

              {/* ── Analyze button ── */}
              {!loading && (
                <button
                  className="analyze-btn"
                  id="analyzeResumeBtn"
                  type="button"
                  disabled={!selectedFile || loading}
                  onClick={handleAnalyze}
                >
                  <i className="bi bi-search"></i> Analyze Resume
                </button>
              )}

              <div className="info">Maximum file size: 10 MB &nbsp;·&nbsp; Supported: PDF, DOCX</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// micro-delay so loading steps are visible to the user
function tick(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
