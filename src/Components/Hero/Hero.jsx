import { Link } from "react-router-dom";
import "./Hero.css";

function Hero({
  title = "Your next favourite book is here.",
  subtitle = "Explore thousands of titles across every genre — powered by the Google Books catalogue.",
  primaryCtaText = "Browse Books",
  primaryCtaLink = "/books",
  secondaryCtaText = "Browse by Category",
  secondaryCtaLink = "/categories",
}) {
  return (
    <section className="hero" aria-label="Welcome banner">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div className="hero-cta">
        <Link to={primaryCtaLink} className="hero-btn-primary">
          {primaryCtaText}
        </Link>
        <Link to={secondaryCtaLink} className="hero-btn-secondary">
          {secondaryCtaText}
        </Link>
      </div>
    </section>
  );
}

export default Hero;
