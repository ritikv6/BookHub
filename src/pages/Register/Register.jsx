import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [registeredUser, setRegisteredUser] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    if (!formData.agreeTerms) {
      errs.agreeTerms = "You must agree to the terms of service.";
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await register(formData.name.trim(), formData.email.trim(), formData.password);
    if (result.success) {
      setRegisteredUser(result.user.name);
    } else {
      setServerError(result.error || "Registration failed. Please try again.");
    }
  };

  if (registeredUser) {
    return (
      <main className="auth-page">
        <div className="auth-card auth-card--success">
          <span className="auth-icon" aria-hidden="true">🎉</span>
          <h1>Account Created!</h1>
          <p className="auth-subtitle">
            Welcome to BookHub, <strong>{registeredUser}</strong>. Your account has been registered and you are now signed in.
          </p>
          <div className="auth-actions">
            <button
              type="button"
              className="auth-btn-primary"
              onClick={() => navigate("/profile")}
            >
              Go to Profile
            </button>
            <button
              type="button"
              className="auth-btn-secondary"
              onClick={() => navigate("/books")}
            >
              Explore Catalogue
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">BookHub</Link>
          <h1>Create an account</h1>
          <p className="auth-subtitle">
            Join BookHub to track your reading list, wishlist, and orders across devices.
          </p>
        </div>

        {serverError && (
          <div className="auth-server-error" role="alert">
            {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="reg-name" className="auth-label">
              Full name <span aria-hidden="true">*</span>
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              autoComplete="name"
              className={`auth-input ${errors.name ? "auth-input--error" : ""}`}
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleChange}
              aria-required="true"
              aria-describedby={errors.name ? "reg-name-error" : undefined}
            />
            {errors.name && (
              <span id="reg-name-error" className="auth-error-text" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email" className="auth-label">
              Email address <span aria-hidden="true">*</span>
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              className={`auth-input ${errors.email ? "auth-input--error" : ""}`}
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
              aria-required="true"
              aria-describedby={errors.email ? "reg-email-error" : undefined}
            />
            {errors.email && (
              <span id="reg-email-error" className="auth-error-text" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="auth-field">
            <div className="auth-field-row">
              <label htmlFor="reg-password" className="auth-label">
                Password <span aria-hidden="true">*</span>
              </label>
              <span className="auth-hint">Min. 6 chars</span>
            </div>
            <input
              id="reg-password"
              name="password"
              type="password"
              autoComplete="new-password"
              className={`auth-input ${errors.password ? "auth-input--error" : ""}`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              aria-required="true"
              aria-describedby={errors.password ? "reg-pass-error" : undefined}
            />
            {errors.password && (
              <span id="reg-pass-error" className="auth-error-text" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="reg-confirm-password" className="auth-label">
              Confirm Password <span aria-hidden="true">*</span>
            </label>
            <input
              id="reg-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={`auth-input ${errors.confirmPassword ? "auth-input--error" : ""}`}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              aria-required="true"
              aria-describedby={errors.confirmPassword ? "reg-confirm-pass-error" : undefined}
            />
            {errors.confirmPassword && (
              <span id="reg-confirm-pass-error" className="auth-error-text" role="alert">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="auth-checkbox-row">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span>I agree to the Terms of Service & Privacy Policy</span>
            </label>
            {errors.agreeTerms && (
              <span className="auth-error-text" role="alert" style={{ display: "block", marginTop: "4px" }}>
                {errors.agreeTerms}
              </span>
            )}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Creating Account…" : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
          <p>
            <Link to="/books" className="auth-secondary-link">
              ← Continue browsing books
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;
