import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const pageHtml = `
<!-- ================= HERO SECTION ================= -->

<section class="hero">

    <div class="container">

        <div class="row align-items-center">

            <!-- Left Content -->
            <div class="col-lg-6">

                <h1>
                    Build a Better
                    <span>Resume</span>
                </h1>

                <p>
                    Analyze your resume, identify missing skills,
                    improve your content and make your resume
                    more effective for job opportunities.
                </p>

                <a href="/upload" class="btn-start">
                    <i class="bi bi-upload"></i>
                    Analyze My Resume
                </a>

                <a href="/about" class="btn-learn">
                    Learn More
                </a>

            </div>


            <!-- Right Resume Preview -->
            <div class="col-lg-6">

                <div class="resume-card">

                    <div class="resume-icon">
                        <i class="bi bi-file-earmark-person"></i>
                    </div>

                    <h3>Resume Analysis</h3>

                    <p class="text-muted">
                        Your resume performance
                    </p>


                    <div class="skill">

                        <div class="skill-name">
                            <span>Skills</span>
                            <span>85%</span>
                        </div>

                        <div class="progress">
                            <div class="progress-bar"
                                 style="width: 85%;">
                            </div>
                        </div>

                    </div>


                    <div class="skill">

                        <div class="skill-name">
                            <span>Experience</span>
                            <span>75%</span>
                        </div>

                        <div class="progress">
                            <div class="progress-bar"
                                 style="width: 75%;">
                            </div>
                        </div>

                    </div>


                    <div class="skill">

                        <div class="skill-name">
                            <span>Formatting</span>
                            <span>90%</span>
                        </div>

                        <div class="progress">
                            <div class="progress-bar"
                                 style="width: 90%;">
                            </div>
                        </div>

                    </div>


                    <div class="skill">

                        <div class="skill-name">
                            <span>Keywords</span>
                            <span>80%</span>
                        </div>

                        <div class="progress">
                            <div class="progress-bar"
                                 style="width: 80%;">
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</section>


<!-- ================= FEATURES ================= -->

<section class="features">

    <div class="container">

        <div class="section-title">

            <h2>Why Use Resume Analyzer?</h2>

            <p>
                Improve your resume with simple and useful analysis.
            </p>

        </div>


        <div class="row g-4">

            <!-- Feature 1 -->
            <div class="col-md-4">

                <div class="feature-card">

                    <div class="feature-icon">
                        <i class="bi bi-search"></i>
                    </div>

                    <h4>Resume Analysis</h4>

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
                        <i class="bi bi-lightbulb"></i>
                    </div>

                    <h4>Skill Suggestions</h4>

                    <p>
                        Get useful skill suggestions based on
                        your resume and career goals.
                    </p>

                </div>

            </div>


            <!-- Feature 3 -->
            <div class="col-md-4">

                <div class="feature-card">

                    <div class="feature-icon">
                        <i class="bi bi-graph-up-arrow"></i>
                    </div>

                    <h4>Improve Your Resume</h4>

                    <p>
                        Find missing keywords, improve formatting
                        and make your resume more effective.
                    </p>

                </div>

            </div>

        </div>

    </div>

</section>


<!-- ================= CTA ================= -->

<section class="cta">

    <h2>Ready to Improve Your Resume?</h2>

    <p>
        Upload your resume and start your analysis today.
    </p>

    <a href="/upload" class="btn-start">
        <i class="bi bi-file-earmark-arrow-up"></i>
        Upload Resume
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

        /* Navbar */
        .navbar {
            background-color: var(--navy);
            padding: 15px 0;
        }

        .navbar-brand {
            color: var(--white) !important;
            font-size: 25px;
            font-weight: bold;
        }

        .navbar-brand span {
            color: #7acb9a;
        }

        .nav-link {
            color: var(--white) !important;
            margin-left: 15px;
            font-weight: 500;
        }

        .nav-link:hover {
            color: #7acb9a !important;
        }

        /* Hero Section */
        .hero {
            min-height: 620px;
            display: flex;
            align-items: center;
            background-color: var(--light-green);
            padding: 60px 0;
        }

        .hero h1 {
            font-size: 52px;
            font-weight: 700;
            color: var(--navy);
        }

        .hero h1 span {
            color: var(--green);
        }

        .hero p {
            font-size: 19px;
            line-height: 1.7;
            color: #40515f;
            margin-top: 20px;
        }

        .btn-start {
            background-color: var(--green);
            color: white;
            border: none;
            padding: 13px 28px;
            border-radius: 8px;
            font-size: 17px;
            margin-top: 15px;
            text-decoration: none;
            display: inline-block;
        }

        .btn-start:hover {
            background-color: var(--navy);
            color: white;
        }

        .btn-learn {
            border: 2px solid var(--navy);
            color: var(--navy);
            padding: 11px 26px;
            border-radius: 8px;
            font-size: 17px;
            margin-top: 15px;
            margin-left: 10px;
            text-decoration: none;
            display: inline-block;
        }

        .btn-learn:hover {
            background-color: var(--navy);
            color: white;
        }

        /* Resume Card */
        .resume-card {
            background-color: var(--white);
            border-radius: 20px;
            padding: 35px;
            box-shadow: 0 10px 35px rgba(16, 42, 67, 0.15);
        }

        .resume-icon {
            width: 75px;
            height: 75px;
            background-color: var(--green);
            color: white;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 38px;
            margin-bottom: 20px;
        }

        .resume-card h3 {
            color: var(--navy);
            font-weight: bold;
        }

        .skill {
            margin-top: 20px;
        }

        .skill-name {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: bold;
        }

        .progress {
            height: 9px;
            margin-top: 7px;
        }

        .progress-bar {
            background-color: var(--green);
        }

        /* Features */
        .features {
            padding: 70px 0;
            background-color: var(--off-white);
        }

        .section-title {
            text-align: center;
            margin-bottom: 50px;
        }

        .section-title h2 {
            font-size: 36px;
            font-weight: bold;
            color: var(--navy);
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
            box-shadow: 0 5px 20px rgba(0,0,0,0.07);
            transition: 0.3s;
        }

        .feature-card:hover {
            transform: translateY(-7px);
        }

        .feature-icon {
            font-size: 42px;
            color: var(--green);
            margin-bottom: 18px;
        }

        .feature-card h4 {
            color: var(--navy);
            font-weight: bold;
        }

        .feature-card p {
            color: #667;
            line-height: 1.6;
        }

        /* CTA */
        .cta {
            background-color: var(--navy);
            padding: 70px 20px;
            text-align: center;
            color: white;
        }

        .cta h2 {
            font-size: 36px;
            font-weight: bold;
        }

        .cta p {
            color: var(--cement);
            font-size: 17px;
            margin: 15px 0 25px;
        }

        /* Footer */
        footer {
            background-color: #091c2c;
            color: var(--cement);
            text-align: center;
            padding: 20px;
        }

        /* Mobile */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 38px;
            }

            .hero {
                text-align: center;
            }

            .resume-card {
                margin-top: 40px;
            }

            .btn-learn {
                margin-left: 0;
            }
        }
    `;

export default function Home() {
  useEffect(() => {
    document.title = "Resume Analyzer | Home";
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
