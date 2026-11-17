import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-box">
        <span className="not-found-emoji" aria-hidden="true">📭</span>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page not found</h2>
        <p className="not-found-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-btn-primary">Go home</Link>
          <Link to="/books" className="not-found-btn-secondary">Browse books</Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
