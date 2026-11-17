import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [signedInUser, setSignedInUser] = useState(null);

  const validate = () => {
    const errs = {};
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

    const result = await login(formData.email.trim(), formData.password);
    if (result.success) {
      setSignedInUser(result.user.name || result.user.email.split("@")[0]);
    } else {
      setServerError(result.error || "Login failed. Please check your credentials.");
    }
  };

  if (signedInUser) {
    return (
      <main className="auth-page">
        <div className="auth-card auth-card--success">
          <span className="auth-icon" aria-hidden="true">🎉</span>
          <h1>Welcome back, {signedInUser}!</h1>
          <p className="auth-subtitle">
            You are signed in to BookHub. Your profile, reading lists, and cart are now synced.
          </p>
          <div className="auth-actions">
            <button
              type="button"
              className="auth-btn-primary"
              onClick={() => navigate("/profile")}
            >
              View My Profile
            </button>
            <button
              type="button"
              className="auth-btn-secondary"
              onClick={() => navigate("/books")}
            >
              Browse Catalogue
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
          <h1>Welcome back</h1>
          <p className="auth-subtitle">
            Sign in to access your saved books, wishlist, orders, and recommendations.
          </p>
        </div>

        {serverError && (
          <div className="auth-server-error" role="alert">
            {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">
              Email address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              className={`auth-input ${errors.email ? "auth-input--error" : ""}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              aria-required="true"
              aria-describedby={errors.email ? "login-email-error" : undefined}
            />
            {errors.email && (
              <span id="login-email-error" className="auth-error-text" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="auth-field">
            <div className="auth-field-row">
              <label htmlFor="login-password" className="auth-label">
                Password
              </label>
              <span className="auth-hint">Min. 6 chars</span>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={`auth-input ${errors.password ? "auth-input--error" : ""}`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              aria-required="true"
              aria-describedby={errors.password ? "login-pass-error" : undefined}
            />
            {errors.password && (
              <span id="login-pass-error" className="auth-error-text" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <div className="auth-checkbox-row">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Signing In…" : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </p>
          <p>
            <Link to="/books" className="auth-secondary-link">
              ← Continue browsing books as guest
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
