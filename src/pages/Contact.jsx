import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const pageHtml = `
<!-- ================= HEADER ================= -->

<section class="contact-header">

    <h1>
        Contact <span>Us</span>
    </h1>

    <p>
        Have a question, suggestion or feedback?
        Send us a message and we will be happy to hear from you.
    </p>

</section>


<!-- ================= CONTACT SECTION ================= -->

<section class="contact-section">

    <div class="container">

        <div class="row g-4">

            <!-- ================= CONTACT INFORMATION ================= -->

            <div class="col-lg-5">

                <div class="contact-info">

                    <h2>
                        Get in Touch
                    </h2>

                    <p>
                        If you have any questions about Resume Analyzer,
                        feel free to contact us using the information below
                        or send us a message through the contact form.
                    </p>


                    <!-- Email -->

                    <div class="contact-item">

                        <div class="contact-icon">

                            <i class="bi bi-envelope"></i>

                        </div>

                        <div>

                            <h5>Email</h5>

                            <p>
                                support@resumeanalyzer.com
                            </p>

                        </div>

                    </div>


                    <!-- Phone -->

                    <div class="contact-item">

                        <div class="contact-icon">

                            <i class="bi bi-telephone"></i>

                        </div>

                        <div>

                            <h5>Phone</h5>

                            <p>
                                +91 98765 43210
                            </p>

                        </div>

                    </div>


                    <!-- Location -->

                    <div class="contact-item">

                        <div class="contact-icon">

                            <i class="bi bi-geo-alt"></i>

                        </div>

                        <div>

                            <h5>Location</h5>

                            <p>
                                India
                            </p>

                        </div>

                    </div>


                    <!-- Social Media -->

                    <div class="social-icons">

                        <a href="#" aria-label="Facebook">
                            <i class="bi bi-facebook"></i>
                        </a>

                        <a href="#" aria-label="Instagram">
                            <i class="bi bi-instagram"></i>
                        </a>

                        <a href="#" aria-label="LinkedIn">
                            <i class="bi bi-linkedin"></i>
                        </a>

                        <a href="#" aria-label="GitHub">
                            <i class="bi bi-github"></i>
                        </a>

                    </div>

                </div>

            </div>


            <!-- ================= CONTACT FORM ================= -->

            <div class="col-lg-7">

                <div class="contact-form">

                    <h2>
                        Send Us a Message
                    </h2>

                    <form id="contactForm">


                        <!-- Name -->

                        <div class="mb-3">

                            <label for="name" class="form-label">
                                Full Name
                            </label>

                            <input
                                type="text"
                                class="form-control"
                                id="name"
                                placeholder="Enter your name"
                                required>

                        </div>


                        <!-- Email -->

                        <div class="mb-3">

                            <label for="email" class="form-label">
                                Email Address
                            </label>

                            <input
                                type="email"
                                class="form-control"
                                id="email"
                                placeholder="Enter your email"
                                required>

                        </div>


                        <!-- Subject -->

                        <div class="mb-3">

                            <label for="subject" class="form-label">
                                Subject
                            </label>

                            <select
                                class="form-select"
                                id="subject"
                                required>

                                <option value="">
                                    Select a subject
                                </option>

                                <option value="question">
                                    General Question
                                </option>

                                <option value="feedback">
                                    Feedback
                                </option>

                                <option value="suggestion">
                                    Suggestion
                                </option>

                                <option value="support">
                                    Technical Support
                                </option>

                            </select>

                        </div>


                        <!-- Message -->

                        <div class="mb-3">

                            <label for="message" class="form-label">
                                Message
                            </label>

                            <textarea
                                class="form-control"
                                id="message"
                                rows="6"
                                placeholder="Write your message here..."
                                required></textarea>

                        </div>


                        <!-- Submit -->

                        <button
                            type="submit"
                            class="submit-btn">

                            <i class="bi bi-send"></i>
                            Send Message

                        </button>

                    </form>

                </div>

            </div>

        </div>

    </div>

</section>


<!-- ================= FAQ ================= -->

<section class="faq-section">

    <div class="container">

        <div class="section-title">

            <h2>
                Frequently Asked Questions
            </h2>

            <p>
                Some common questions about Resume Analyzer.
            </p>

        </div>


        <div class="accordion" id="faqAccordion">


            <!-- FAQ 1 -->

            <div class="accordion-item">

                <h2 class="accordion-header">

                    <button
                        class="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq1">

                        What is Resume Analyzer?

                    </button>

                </h2>

                <div
                    id="faq1"
                    class="accordion-collapse collapse show"
                    data-bs-parent="#faqAccordion">

                    <div class="accordion-body">

                        Resume Analyzer is a web-based tool that
                        helps users analyze their resumes and identify
                        areas that can be improved.

                    </div>

                </div>

            </div>


            <!-- FAQ 2 -->

            <div class="accordion-item">

                <h2 class="accordion-header">

                    <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq2">

                        What resume formats are supported?

                    </button>

                </h2>

                <div
                    id="faq2"
                    class="accordion-collapse collapse"
                    data-bs-parent="#faqAccordion">

                    <div class="accordion-body">

                        The current upload page supports
                        PDF and DOCX resume formats.

                    </div>

                </div>

            </div>


            <!-- FAQ 3 -->

            <div class="accordion-item">

                <h2 class="accordion-header">

                    <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq3">

                        What does the analysis report contain?

                    </button>

                </h2>

                <div
                    id="faq3"
                    class="accordion-collapse collapse"
                    data-bs-parent="#faqAccordion">

                    <div class="accordion-body">

                        The report can include an overall resume score,
                        ATS compatibility, keyword score, strengths,
                        weaknesses and improvement suggestions.

                    </div>

                </div>

            </div>


            <!-- FAQ 4 -->

            <div class="accordion-item">

                <h2 class="accordion-header">

                    <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq4">

                        Can students use Resume Analyzer?

                    </button>

                </h2>

                <div
                    id="faq4"
                    class="accordion-collapse collapse"
                    data-bs-parent="#faqAccordion">

                    <div class="accordion-body">

                        Yes. Resume Analyzer is especially useful
                        for students and fresh graduates who want
                        to improve their resumes before applying
                        for internships and jobs.

                    </div>

                </div>

            </div>


        </div>

    </div>

</section>


<!-- ================= CTA ================= -->

<section class="cta">

    <h2>
        Ready to Improve Your Resume?
    </h2>

    <p>
        Upload your resume and start analyzing it today.
    </p>

    <a href="/upload" class="cta-btn">

        <i class="bi bi-upload"></i>
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

        .contact-header {
            background-color: var(--light-green);
            text-align: center;
            padding: 60px 20px;
        }

        .contact-header h1 {
            font-size: 42px;
            font-weight: bold;
            color: var(--navy);
        }

        .contact-header h1 span {
            color: var(--green);
        }

        .contact-header p {
            max-width: 700px;
            margin: 15px auto 0;
            color: #667;
            font-size: 18px;
            line-height: 1.7;
        }

        /* ================= CONTACT SECTION ================= */

        .contact-section {
            padding: 70px 0;
        }

        /* ================= CONTACT INFO ================= */

        .contact-info {
            background-color: var(--navy);
            color: white;
            border-radius: 15px;
            padding: 40px;
            height: 100%;
        }

        .contact-info h2 {
            font-weight: bold;
            margin-bottom: 15px;
        }

        .contact-info > p {
            color: var(--cement);
            line-height: 1.7;
            margin-bottom: 30px;
        }

        .contact-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 25px;
        }

        .contact-icon {
            min-width: 48px;
            height: 48px;
            background-color: var(--green);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            margin-right: 15px;
        }

        .contact-item h5 {
            margin: 0 0 5px;
            font-weight: bold;
        }

        .contact-item p {
            margin: 0;
            color: var(--cement);
        }

        /* ================= SOCIAL ================= */

        .social-icons {
            margin-top: 30px;
        }

        .social-icons a {
            width: 42px;
            height: 42px;
            background-color: var(--green);
            color: white;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            text-decoration: none;
            margin-right: 8px;
            font-size: 19px;
            transition: 0.3s;
        }

        .social-icons a:hover {
            background-color: white;
            color: var(--navy);
        }

        /* ================= FORM ================= */

        .contact-form {
            background-color: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
            height: 100%;
        }

        .contact-form h2 {
            color: var(--navy);
            font-weight: bold;
            margin-bottom: 25px;
        }

        .form-label {
            color: var(--navy);
            font-weight: bold;
        }

        .form-control,
        .form-select {
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }

        .form-control:focus,
        .form-select:focus {
            border-color: var(--green);
            box-shadow: 0 0 0 0.2rem rgba(46, 125, 91, 0.15);
        }

        .submit-btn {
            background-color: var(--green);
            color: white;
            border: none;
            padding: 13px 30px;
            border-radius: 8px;
            font-size: 17px;
            width: 100%;
        }

        .submit-btn:hover {
            background-color: var(--navy);
        }

        /* ================= FAQ ================= */

        .faq-section {
            background-color: var(--light-green);
            padding: 65px 0;
        }

        .section-title {
            text-align: center;
            margin-bottom: 40px;
        }

        .section-title h2 {
            color: var(--navy);
            font-size: 35px;
            font-weight: bold;
        }

        .section-title p {
            color: #667;
        }

        .accordion-item {
            border: none;
            margin-bottom: 10px;
            border-radius: 8px !important;
            overflow: hidden;
        }

        .accordion-button {
            font-weight: bold;
            color: var(--navy);
            background-color: white;
        }

        .accordion-button:not(.collapsed) {
            color: var(--green);
            background-color: white;
            box-shadow: none;
        }

        .accordion-button:focus {
            box-shadow: none;
        }

        .accordion-body {
            color: #667;
            line-height: 1.7;
        }

        /* ================= CTA ================= */

        .cta {
            background-color: var(--navy);
            color: white;
            text-align: center;
            padding: 60px 20px;
        }

        .cta h2 {
            font-size: 35px;
            font-weight: bold;
        }

        .cta p {
            color: var(--cement);
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

            .contact-header h1 {
                font-size: 34px;
            }

            .contact-info,
            .contact-form {
                padding: 30px 20px;
            }

            .section-title h2 {
                font-size: 29px;
            }

        }

    `;

export default function Contact() {
  useEffect(() => {
    document.title = "Contact | Resume Analyzer";
    const form = document.getElementById("contactForm");
    if (!form) return;
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const button = form.querySelector('button[type="submit"]');

    const submit = async (event) => {
      event.preventDefault();
      if (!form.checkValidity()) { form.classList.add("was-validated"); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { alert("Please enter a valid email address."); email.focus(); return; }
      if (message.value.trim().length < 10) { alert("Please enter a message with at least 10 characters."); message.focus(); return; }

      const nameVal = document.getElementById("name")?.value.trim() || "";
      const emailVal = email.value.trim();
      const subjectVal = document.getElementById("subject")?.value || "";
      const messageVal = message.value.trim();

      const original = button.innerHTML;
      button.disabled = true;
      button.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            subject: subjectVal,
            message: messageVal,
          }),
        });

        const resData = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(resData?.error?.message || "Failed to submit message. Please try again.");
        }

        const messages = JSON.parse(localStorage.getItem("contactMessages") || "[]");
        messages.push({
          name: nameVal,
          email: emailVal,
          subject: subjectVal,
          message: messageVal,
          sentAt: new Date().toISOString()
        });
        localStorage.setItem("contactMessages", JSON.stringify(messages));

        button.disabled = false;
        button.innerHTML = original;
        form.reset();
        form.classList.remove("was-validated");
        const alertBox = document.createElement("div");
        alertBox.className = "alert alert-success mt-3";
        alertBox.innerHTML = '<i class="bi bi-check-circle-fill"></i> ' + (resData?.message || 'Thank you! Your message has been submitted successfully.');
        form.parentElement.appendChild(alertBox);
        setTimeout(() => alertBox.remove(), 5000);
      } catch (err) {
        button.disabled = false;
        button.innerHTML = original;
        const alertBox = document.createElement("div");
        alertBox.className = "alert alert-danger mt-3";
        alertBox.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> ' + (err.message || 'Error sending message. Please try again.');
        form.parentElement.appendChild(alertBox);
        setTimeout(() => alertBox.remove(), 5000);
      }
    };

    form.addEventListener("submit", submit);
    return () => form.removeEventListener("submit", submit);
  }, []);

  return <><style>{pageCss}</style><Navbar /><main dangerouslySetInnerHTML={{__html: pageHtml}} /><Footer /></>;
}
