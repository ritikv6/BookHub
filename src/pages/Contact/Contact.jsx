import { useState } from "react";
import "./Contact.css";

const FAQS = [
  {
    q: "Where does BookHub get its book information?",
    a: "BookHub queries the official Google Books API in real time. We display metadata including verified authors, titles, descriptions, categories, page counts, publishers, and ISBNs.",
  },
  {
    q: "Can I buy physical books through this website?",
    a: "Currently, BookHub is a frontend discovery and exploration application. Book information is loaded for discovery purposes. Real checkout, physical inventory, and real payments require a server-backed commerce system.",
  },
  {
    q: "How does the Cart and Wishlist save my items?",
    a: "Your selected cart items and wishlist are saved locally in your browser via localStorage. They persist when you refresh or revisit the site on the same device.",
  },
  {
    q: "Why are some book prices or covers unavailable?",
    a: "Google Books contains millions of catalogue entries, including rare and historical volumes. Some entries lack cover scans or retail pricing data. When missing, BookHub displays elegant fallback placeholders rather than broken images.",
  },
];

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.message.trim()) {
      errs.message = "Message cannot be empty.";
    } else if (formData.message.trim().length < 10) {
      errs.message = "Please provide at least 10 characters.";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
  };

  return (
    <main className="contact-page">
      <div className="contact-header">
        <h1>Contact & Support</h1>
        <p>Have a question about BookHub or want to get in touch? We're here to help.</p>
      </div>

      <div className="contact-layout">
        {/* Contact Form Section */}
        <section className="contact-form-section" aria-labelledby="form-heading">
          <h2 id="form-heading">Send us a Message</h2>

          {submitted ? (
            <div className="contact-success-card" role="status" aria-live="polite">
              <span className="contact-success-icon" aria-hidden="true">✉️</span>
              <h3>Message Sent!</h3>
              <p>
                Thank you for reaching out, <strong>{formData.name}</strong>. In this frontend demonstration, your message has been recorded.
              </p>
              <button
                type="button"
                className="btn-new-message"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", subject: "general", message: "" });
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-field">
                <label htmlFor="contact-name" className="contact-label">
                  Your name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={`contact-input ${errors.name ? "contact-input--error" : ""}`}
                  placeholder="Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.name ? "name-err" : undefined}
                />
                {errors.name && <span id="name-err" className="contact-error">{errors.name}</span>}
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email" className="contact-label">
                  Email address <span aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`contact-input ${errors.email ? "contact-input--error" : ""}`}
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.email ? "email-err" : undefined}
                />
                {errors.email && <span id="email-err" className="contact-error">{errors.email}</span>}
              </div>

              <div className="contact-field">
                <label htmlFor="contact-subject" className="contact-label">
                  Topic
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  className="contact-select"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option value="general">General Inquiry</option>
                  <option value="catalogue">Book Catalogue / Data</option>
                  <option value="bug">Report an Issue</option>
                  <option value="feedback">Product Feedback</option>
                </select>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-message" className="contact-label">
                  Message <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  className={`contact-textarea ${errors.message ? "contact-input--error" : ""}`}
                  placeholder="Tell us what's on your mind…"
                  value={formData.message}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.message ? "msg-err" : undefined}
                />
                {errors.message && <span id="msg-err" className="contact-error">{errors.message}</span>}
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Message
              </button>
            </form>
          )}
        </section>

        {/* Sidebar Info & FAQ */}
        <aside className="contact-sidebar">
          <div className="contact-card">
            <h3>Quick Information</h3>
            <ul className="contact-info-list">
              <li>
                <strong>Project:</strong> BookHub Bookstore
              </li>
              <li>
                <strong>API Provider:</strong> Google Books API
              </li>
              <li>
                <strong>Support Hours:</strong> Mon – Fri, 9am – 6pm
              </li>
              <li>
                <strong>Email:</strong> support@bookhub.local
              </li>
            </ul>
          </div>

          <div className="contact-faq">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-list">
              {FAQS.map((faq, idx) => (
                <details key={idx} className="faq-item">
                  <summary className="faq-question">{faq.q}</summary>
                  <p className="faq-answer">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Contact;
