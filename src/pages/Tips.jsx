import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const pageHtml = `
<!-- ================= HEADER ================= -->

<section class="tips-header">

    <h1>
        Resume <span>Tips</span>
    </h1>

    <p>
        Learn how to create a professional, clear and
        ATS-friendly resume that can improve your job opportunities.
    </p>

</section>


<!-- ================= MAIN TIPS ================= -->

<section class="tips-section">

    <div class="container">

        <div class="row g-4">


            <!-- Tip 1 -->

            <div class="col-lg-4 col-md-6">

                <div class="tip-card">

                    <div class="tip-icon">
                        <i class="bi bi-file-earmark-text"></i>
                    </div>

                    <h3>Keep It Simple</h3>

                    <p>
                        Use a clean and professional resume
                        design. Avoid unnecessary graphics,
                        complicated layouts and excessive colors.
                    </p>

                    <ul class="tip-list">

                        <li>Use clear headings.</li>
                        <li>Keep consistent formatting.</li>
                        <li>Use readable fonts.</li>

                    </ul>

                </div>

            </div>


            <!-- Tip 2 -->

            <div class="col-lg-4 col-md-6">

                <div class="tip-card">

                    <div class="tip-icon">
                        <i class="bi bi-person-badge"></i>
                    </div>

                    <h3>Professional Summary</h3>

                    <p>
                        Write a short summary that explains
                        your skills, experience and career goals.
                    </p>

                    <ul class="tip-list">

                        <li>Keep it short.</li>
                        <li>Highlight your strengths.</li>
                        <li>Match it with the job.</li>

                    </ul>

                </div>

            </div>


            <!-- Tip 3 -->

            <div class="col-lg-4 col-md-6">

                <div class="tip-card">

                    <div class="tip-icon">
                        <i class="bi bi-code-slash"></i>
                    </div>

                    <h3>Highlight Skills</h3>

                    <p>
                        Include technical and soft skills that
                        are relevant to the job you are applying for.
                    </p>

                    <ul class="tip-list">

                        <li>Programming languages.</li>
                        <li>Tools and technologies.</li>
                        <li>Communication and teamwork.</li>

                    </ul>

                </div>

            </div>


            <!-- Tip 4 -->

            <div class="col-lg-4 col-md-6">

                <div class="tip-card">

                    <div class="tip-icon">
                        <i class="bi bi-kanban"></i>
                    </div>

                    <h3>Showcase Projects</h3>

                    <p>
                        Projects are especially important for
                        students and fresh graduates.
                    </p>

                    <ul class="tip-list">

                        <li>Give the project title.</li>
                        <li>Mention technologies used.</li>
                        <li>Explain your contribution.</li>

                    </ul>

                </div>

            </div>


            <!-- Tip 5 -->

            <div class="col-lg-4 col-md-6">

                <div class="tip-card">

                    <div class="tip-icon">
                        <i class="bi bi-search"></i>
                    </div>

                    <h3>Use Keywords</h3>

                    <p>
                        Add relevant keywords from the job
                        description to improve ATS compatibility.
                    </p>

                    <ul class="tip-list">

                        <li>Read the job description.</li>
                        <li>Identify important skills.</li>
                        <li>Use relevant keywords naturally.</li>

                    </ul>

                </div>

            </div>


            <!-- Tip 6 -->

            <div class="col-lg-4 col-md-6">

                <div class="tip-card">

                    <div class="tip-icon">
                        <i class="bi bi-award"></i>
                    </div>

                    <h3>Add Achievements</h3>

                    <p>
                        Include certifications, awards,
                        competitions and other achievements.
                    </p>

                    <ul class="tip-list">

                        <li>Technical certifications.</li>
                        <li>Academic achievements.</li>
                        <li>Hackathons and competitions.</li>

                    </ul>

                </div>

            </div>

        </div>

    </div>

</section>


<!-- ================= BEST PRACTICES ================= -->

<section class="best-practices">

    <div class="container">

        <div class="section-title">

            <h2>Best Resume Practices</h2>

            <p>
                Follow these simple practices to make your resume stronger.
            </p>

        </div>


        <div class="row g-4">

            <div class="col-md-4">

                <div class="practice-box">

                    <h4>
                        <i class="bi bi-check-circle"></i>
                        Use Action Words
                    </h4>

                    <p>
                        Use strong words such as Developed,
                        Designed, Created, Implemented and Managed
                        to describe your work.
                    </p>

                </div>

            </div>


            <div class="col-md-4">

                <div class="practice-box">

                    <h4>
                        <i class="bi bi-bar-chart"></i>
                        Show Results
                    </h4>

                    <p>
                        Whenever possible, use numbers and
                        measurable results to demonstrate your
                        achievements.
                    </p>

                </div>

            </div>


            <div class="col-md-4">

                <div class="practice-box">

                    <h4>
                        <i class="bi bi-check2-square"></i>
                        Proofread
                    </h4>

                    <p>
                        Check your resume carefully for
                        spelling mistakes, grammar errors and
                        inconsistent formatting.
                    </p>

                </div>

            </div>

        </div>

    </div>

</section>


<!-- ================= DO AND DON'T ================= -->

<section class="dos-donts">

    <div class="container">

        <div class="section-title">

            <h2>Resume Do's and Don'ts</h2>

            <p>
                Avoid common mistakes while creating your resume.
            </p>

        </div>


        <div class="row g-4">

            <!-- DO -->

            <div class="col-md-6">

                <div class="do-box">

                    <h3>
                        <i class="bi bi-check-circle-fill"></i>
                        Do's
                    </h3>

                    <ul class="mt-4">

                        <li>Keep your resume clear and organized.</li>

                        <li>Use professional language.</li>

                        <li>Customize your resume for each job.</li>

                        <li>Highlight relevant skills.</li>

                        <li>Include projects and achievements.</li>

                        <li>Proofread before submitting.</li>

                    </ul>

                </div>

            </div>


            <!-- DON'T -->

            <div class="col-md-6">

                <div class="dont-box">

                    <h3>
                        <i class="bi bi-x-circle-fill"></i>
                        Don'ts
                    </h3>

                    <ul class="mt-4">

                        <li>Don't use too many colors or graphics.</li>

                        <li>Don't include unnecessary personal information.</li>

                        <li>Don't use spelling or grammar mistakes.</li>

                        <li>Don't include false information.</li>

                        <li>Don't make the resume difficult to read.</li>

                        <li>Don't use the same resume for every job.</li>

                    </ul>

                </div>

            </div>

        </div>

    </div>

</section>


<!-- ================= CTA ================= -->

<section class="cta">

    <h2>Ready to Check Your Resume?</h2>

    <p>
        Upload your resume and get a detailed analysis report.
    </p>

    <a href="/upload" class="cta-btn">

        <i class="bi bi-upload"></i>
        Analyze My Resume

    </a>

</section>


<!-- ================= FOOTER ================= -->
<!-- Bootstrap JavaScript -->





`;
const pageCss = `

        :root {
            --green: #2e7d5b;
            --light-green: #dcefe5;
            --navy: #102a43;
            --off-white: #f8f6f0;
            --cement: #c8c5bc;
            --white: #ffffff;
        }

        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: var(--off-white);
            color: var(--navy);
        }

        /* ================= NAVBAR ================= */

        .navbar {
            background-color: var(--navy);
            padding: 15px 0;
        }

        .navbar-brand {
            color: white !important;
            font-size: 25px;
            font-weight: bold;
        }

        .navbar-brand span {
            color: #7acb9a;
        }

        .nav-link {
            color: white !important;
            margin-left: 15px;
            font-weight: 500;
        }

        .nav-link:hover {
            color: #7acb9a !important;
        }

        /* ================= HEADER ================= */

        .tips-header {
            background-color: var(--light-green);
            text-align: center;
            padding: 60px 20px;
        }

        .tips-header h1 {
            font-size: 42px;
            font-weight: bold;
            color: var(--navy);
        }

        .tips-header h1 span {
            color: var(--green);
        }

        .tips-header p {
            color: #667;
            font-size: 18px;
            max-width: 700px;
            margin: 15px auto 0;
        }

        /* ================= TIPS SECTION ================= */

        .tips-section {
            padding: 60px 0;
        }

        .tip-card {
            background-color: var(--white);
            border-radius: 15px;
            padding: 30px;
            height: 100%;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
            transition: 0.3s;
        }

        .tip-card:hover {
            transform: translateY(-6px);
        }

        .tip-icon {
            width: 65px;
            height: 65px;
            border-radius: 12px;
            background-color: var(--light-green);
            color: var(--green);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin-bottom: 20px;
        }

        .tip-card h3 {
            color: var(--navy);
            font-weight: bold;
            margin-bottom: 15px;
        }

        .tip-card p {
            color: #667;
            line-height: 1.7;
        }

        .tip-list {
            padding-left: 20px;
            color: #555;
        }

        .tip-list li {
            margin-bottom: 10px;
        }

        /* ================= BEST PRACTICES ================= */

        .best-practices {
            background-color: var(--light-green);
            padding: 60px 0;
        }

        .section-title {
            text-align: center;
            margin-bottom: 40px;
        }

        .section-title h2 {
            font-size: 35px;
            font-weight: bold;
            color: var(--navy);
        }

        .section-title p {
            color: #667;
        }

        .practice-box {
            background-color: white;
            padding: 25px;
            border-radius: 12px;
            height: 100%;
        }

        .practice-box h4 {
            color: var(--green);
            font-weight: bold;
        }

        .practice-box p {
            color: #666;
            line-height: 1.6;
        }

        /* ================= DO AND DON'T ================= */

        .dos-donts {
            padding: 60px 0;
        }

        .do-box,
        .dont-box {
            background-color: white;
            border-radius: 15px;
            padding: 30px;
            height: 100%;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }

        .do-box {
            border-top: 5px solid var(--green);
        }

        .dont-box {
            border-top: 5px solid #b85c5c;
        }

        .do-box h3 {
            color: var(--green);
            font-weight: bold;
        }

        .dont-box h3 {
            color: #b85c5c;
            font-weight: bold;
        }

        .do-box li,
        .dont-box li {
            margin-bottom: 12px;
            color: #555;
        }

        /* ================= CTA ================= */

        .cta {
            background-color: var(--navy);
            color: white;
            text-align: center;
            padding: 65px 20px;
        }

        .cta h2 {
            font-size: 35px;
            font-weight: bold;
        }

        .cta p {
            color: var(--cement);
            font-size: 17px;
            margin: 15px 0 25px;
        }

        .cta-btn {
            display: inline-block;
            background-color: var(--green);
            color: white;
            text-decoration: none;
            padding: 13px 28px;
            border-radius: 8px;
            font-size: 17px;
        }

        .cta-btn:hover {
            background-color: white;
            color: var(--navy);
        }

        /* ================= FOOTER ================= */

        footer {
            background-color: #091c2c;
            color: var(--cement);
            text-align: center;
            padding: 20px;
        }

        /* ================= MOBILE ================= */

        @media (max-width: 768px) {

            .tips-header h1 {
                font-size: 34px;
            }

            .section-title h2 {
                font-size: 29px;
            }

        }

    `;

export default function Tips() {
  useEffect(() => {
    document.title = "Resume Tips | Resume Analyzer";
  }, []);

  return (
    <>
      <style>{pageCss}</style>
      <Navbar />
      <main dangerouslySetInnerHTML={{ __html: pageHtml }} />
      <Footer />
    </>
  );
}
