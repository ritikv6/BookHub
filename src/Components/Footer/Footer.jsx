import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        {/* Brand column */}
        <div className="footer-col footer-col--brand">
          <Link to="/" className="footer-logo">BookHub</Link>
          <p className="footer-tagline">
            Your modern digital destination for book discovery, exploration, and reading management.
          </p>
          <p className="footer-disclaimer">
            Book metadata and covers are powered by the official Google Books API. All book copyrights belong to their respective publishers and authors.
          </p>
        </div>

        {/* Explore Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Explore</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/books">All Books</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/wishlist">Your Wishlist</Link></li>
          </ul>
        </div>

        {/* Shopping & Tools */}
        <div className="footer-col">
          <h4 className="footer-heading">Shopping Demo</h4>
          <ul className="footer-links">
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/checkout">Checkout Demo</Link></li>
            <li><Link to="/contact">Contact & FAQs</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div className="footer-col">
          <h4 className="footer-heading">Account</h4>
          <ul className="footer-links">
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Create Account</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} BookHub Bookstore. Built with React, Vite & React Router.</p>
      </div>
    </footer>
  );
}

export default Footer;
