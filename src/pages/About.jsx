import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const pageHtml = `
<!-- ================= HEADER ================= -->

<section class="about-header">

    <h1>
        About <span>Resume Analyzer</span>
    </h1>

    <p>
        Resume Analyzer is a web-based platform designed to help
        students and job seekers understand the strengths and
        weaknesses of their resumes and improve them for better
        career opportunities.
    </p>

</section>


<!-- ================= ABOUT ================= -->

<section class="about-section">

    <div class="container">

        <div class="row g-4 align-items-stretch">

            <!-- About Content -->

            <div class="col-lg-7">

                <div class="about-content">

                    <h2>
                        What is <span>Resume Analyzer?</span>
                    </h2>

                    <p>
                        Resume Analyzer is a resume improvement tool
                        that evaluates important sections of a resume,
                        including skills, education, experience,
                        projects, keywords and formatting.
                    </p>

                    <p>
                        The system provides an analysis report that
                        helps users identify areas that need improvement.
                        It also provides useful suggestions for creating
                        a more professional and job-ready resume.
                    </p>

                    <p>
                        The main goal of this project is to make resume
                        improvement simple and accessible, especially
                        for students and fresh graduates who are starting
                        their careers.
                    </p>

                </div>

            </div>


            <!-- Icon Area -->

            <div class="col-lg-5">

                <div class="about-icon-box">

                    <div class="about-icon">

                        <i class="bi bi-file-earmark-person"></i>

                    </div>

                    <h3>
                        Build a Better Resume
                    </h3>

                    <p>
                        Analyze. Improve. Succeed.
                    </p>

                </div>

            </div>

        </div>

    </div>

</section>


<!-- ================= FEATURES ================= -->

<section class="features-section">

    <div class="container">

        <div class="section-title">

            <h2>
                What Our <span>System Provides</span>
            </h2>

            <p>
                Useful features to help improve your resume.
            </p>

        </div>


        <div class="row g-4">

            <!-- Feature 1 -->

            <div class="col-md-4">

                <div class="feature-card">

                    <div class="feature-icon">

                        <i class="bi bi-search"></i>

                    </div>

                    <h4>
                        Resume Analysis
                    </h4>

                    <p>
                        Analyze your resume and identify
                        important areas that can be improved.
                    </p>

                </div>

            </div>


            <!-- Feature 2 -->

            <div class="col-md-4">

                <div class="feature-card">

                    <div class="feature-icon">

                        <i class="bi bi-bar-chart"></i>

                    </div>

                    <h4>
                        Resume Score
                    </h4>

                    <p>
                        Get a simple score based on important
                        resume factors such as skills, formatting
                        and keywords.
                    </p>

                </div>

            </div>


            <!-- Feature 3 -->

            <div class="col-md-4">

                <div class="feature-card">

                    <div class="feature-icon">

                        <i class="bi bi-lightbulb"></i>

                    </div>

                    <h4>
                        Improvement Suggestions
                    </h4>

                    <p>
                        Receive useful suggestions to improve
                        your resume and make it more effective.
                    </p>

                </div>

            </div>


            <!-- Feature 4 -->

            <div class="col-md-4">

                <div class="feature-card">

                    <div class="feature-icon">

                        <i class="bi bi-key"></i>

                    </div>

                    <h4>
                        Keyword Analysis
                    </h4>

                    <p>
                        Identify important keywords that can
                        improve the relevance of your resume.
                    </p>

                </div>

            </div>


            <!-- Feature 5 -->

            <div class="col-md-4">

                <div class="feature-card">

                    <div class="feature-icon">

                        <i class="bi bi-robot"></i>

                    </div>

                    <h4>
                        ATS Awareness
                    </h4>

                    <p>
                        Understand how well your resume follows
                        common Applicant Tracking System practices.
                    </p>

                </div>

            </div>


            <!-- Feature 6 -->

            <div class="col-md-4">

                <div class="feature-card">

                    <div class="feature-icon">

                        <i class="bi bi-check-circle"></i>

                    </div>

                    <h4>
                        Resume Tips
                    </h4>

                    <p>
                        Learn simple techniques for creating a
                        clear, professional and effective resume.
                    </p>

                </div>

            </div>

        </div>

    </div>

</section>


<!-- ================= HOW IT WORKS ================= -->

<section class="how-section">

    <div class="container">

        <div class="section-title">

            <h2>
                How It <span>Works</span>
            </h2>

            <p>
                Analyze your resume in three simple steps.
            </p>

        </div>


        <div class="row g-4">

            <!-- Step 1 -->

            <div class="col-md-4">

                <div class="step-card">

                    <div class="step-number">
                        1
                    </div>

                    <h4>
                        Upload Resume
                    </h4>

                    <p>
                        Select and upload your resume in a
                        supported format.
                    </p>

                </div>

            </div>


            <!-- Step 2 -->

            <div class="col-md-4">

                <div class="step-card">

                    <div class="step-number">
                        2
                    </div>

                    <h4>
                        Analyze Resume
                    </h4>

                    <p>
                        The system checks important resume
                        sections, skills, keywords and formatting.
                    </p>

                </div>

            </div>


            <!-- Step 3 -->

            <div class="col-md-4">

                <div class="step-card">

                    <div class="step-number">
                        3
                    </div>

                    <h4>
                        Get Report
                    </h4>

                    <p>
                        View your resume score, strengths,
                        weaknesses and improvement suggestions.
                    </p>

                </div>

            </div>

        </div>

    </div>

</section>


<!-- ================= TECHNOLOGY ================= -->

<section class="technology-section">

    <div class="container">

        <h2>
            Technologies Used
        </h2>

        <p>
            The Resume Analyzer project uses modern web technologies
            to create a responsive and user-friendly interface.
        </p>


        <div class="tech-badges">

            <span class="tech-badge">
                HTML5
            </span>

            <span class="tech-badge">
                CSS3
            </span>

            <span class="tech-badge">
                Bootstrap
            </span>

            <span class="tech-badge">
                JavaScript
            </span>

        </div>

    </div>

</section>


<!-- ================= CTA ================= -->

<section class="cta">

    <h2>
        Start Improving Your Resume
    </h2>

    <p>
        Upload your resume and discover ways to make it better.
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

        .about-header {
            background-color: var(--light-green);
            text-align: center;
            padding: 65px 20px;
        }

        .about-header h1 {
            font-size: 42px;
            font-weight: bold;
            color: var(--navy);
        }

        .about-header h1 span {
            color: var(--green);
        }

        .about-header p {
            max-width: 750px;
            margin: 15px auto 0;
            color: #667;
            font-size: 18px;
            line-height: 1.7;
        }

        /* ================= ABOUT SECTION ================= */

        .about-section {
            padding: 70px 0;
        }

        .about-content {
            background-color: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }

        .about-content h2 {
            color: var(--navy);
            font-weight: bold;
            margin-bottom: 20px;
        }

        .about-content h2 span {
            color: var(--green);
        }

        .about-content p {
            color: #5f6b75;
            line-height: 1.8;
            font-size: 16px;
        }

        /* ================= ICON ================= */

        .about-icon-box {
            background-color: var(--light-green);
            border-radius: 15px;
            min-height: 100%;
            padding: 45px 25px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .about-icon {
            width: 110px;
            height: 110px;
            background-color: var(--green);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 55px;
            margin-bottom: 25px;
        }

        .about-icon-box h3 {
            color: var(--navy);
            font-weight: bold;
        }

        .about-icon-box p {
            color: #667;
            line-height: 1.6;
        }

        /* ================= FEATURES ================= */

        .features-section {
            background-color: var(--light-green);
            padding: 70px 0;
        }

        .section-title {
            text-align: center;
            margin-bottom: 45px;
        }

        .section-title h2 {
            color: var(--navy);
            font-size: 35px;
            font-weight: bold;
        }

        .section-title h2 span {
            color: var(--green);
        }

        .section-title p {
            color: #667;
        }

        .feature-card {
            background-color: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            height: 100%;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.06);
            transition: 0.3s;
        }

        .feature-card:hover {
            transform: translateY(-7px);
        }

        .feature-icon {
            width: 65px;
            height: 65px;
            background-color: var(--light-green);
            color: var(--green);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 32px;
        }

        .feature-card h4 {
            color: var(--navy);
            font-weight: bold;
            margin-bottom: 15px;
        }

        .feature-card p {
            color: #667;
            line-height: 1.7;
        }

        /* ================= HOW IT WORKS ================= */

        .how-section {
            padding: 70px 0;
        }

        .step-card {
            text-align: center;
            padding: 25px;
        }

        .step-number {
            width: 60px;
            height: 60px;
            margin: auto;
            border-radius: 50%;
            background-color: var(--green);
            color: white;
            font-size: 25px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .step-card h4 {
            margin-top: 20px;
            color: var(--navy);
            font-weight: bold;
        }

        .step-card p {
            color: #667;
            line-height: 1.6;
        }

        /* ================= TECHNOLOGY ================= */

        .technology-section {
            background-color: var(--navy);
            color: white;
            padding: 65px 20px;
            text-align: center;
        }

        .technology-section h2 {
            font-size: 35px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .technology-section p {
            color: var(--cement);
            max-width: 750px;
            margin: auto;
            line-height: 1.7;
        }

        .tech-badges {
            margin-top: 30px;
        }

        .tech-badge {
            display: inline-block;
            background-color: var(--green);
            color: white;
            padding: 10px 18px;
            border-radius: 20px;
            margin: 5px;
            font-weight: bold;
        }

        /* ================= CTA ================= */

        .cta {
            background-color: var(--light-green);
            text-align: center;
            padding: 60px 20px;
        }

        .cta h2 {
            color: var(--navy);
            font-size: 35px;
            font-weight: bold;
        }

        .cta p {
            color: #667;
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
            background-color: var(--navy);
            color: white;
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

            .about-header h1 {
                font-size: 34px;
            }

            .section-title h2 {
                font-size: 29px;
            }

            .about-content {
                padding: 30px 20px;
            }

        }

    `;

export default function About() {
  useEffect(() => {
    document.title = "About | Resume Analyzer";
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
