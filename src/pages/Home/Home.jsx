import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "../../Components/BookCard/BookCard";
import Hero from "../../Components/Hero/Hero";
import LoadingState from "../../Components/LoadingState/LoadingState";
import { getBooks } from "../../services/api";
import { mapBooks } from "../../services/BookMapper";
import "./Home.css";

const CATEGORIES = [
  { label: "Fiction",       subject: "fiction",       emoji: "📖" },
  { label: "Science",       subject: "science",       emoji: "🔬" },
  { label: "History",       subject: "history",       emoji: "🏛️" },
  { label: "Biography",     subject: "biography",     emoji: "👤" },
  { label: "Business",      subject: "business",      emoji: "💼" },
  { label: "Programming",   subject: "computers",     emoji: "💻" },
  { label: "Self-Help",     subject: "self-help",     emoji: "🌱" },
  { label: "Philosophy",    subject: "philosophy",    emoji: "🤔" },
];

function Home() {
  const [featured, setFeatured] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getBooks("popular fiction nonfiction", 0, 8)
      .then(({ items }) => {
        if (!cancelled) {
          setFeatured(mapBooks(items).slice(0, 8));
        }
      })
      .catch(() => {
        if (!cancelled) setFeaturedError(true);
      })
      .finally(() => {
        if (!cancelled) setFeaturedLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="home">
      {/* Reusable Hero Component */}
      <Hero />

      {/* Categories */}
      <section className="home-section" aria-labelledby="categories-heading">
        <div className="section-heading">
          <h2 id="categories-heading">Browse by Category</h2>
          <Link to="/categories">View all</Link>
        </div>
        <ul className="category-grid" role="list">
          {CATEGORIES.map((cat) => (
            <li key={cat.subject}>
              <Link
                to={`/categories/${encodeURIComponent(cat.subject)}`}
                className="category-card"
              >
                <span className="category-emoji" aria-hidden="true">{cat.emoji}</span>
                <span className="category-label">{cat.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured books */}
      <section className="home-section" aria-labelledby="featured-heading">
        <div className="section-heading">
          <h2 id="featured-heading">Discover Books</h2>
          <Link to="/books">View all</Link>
        </div>

        {featuredLoading && <LoadingState message="Loading books…" />}

        {!featuredLoading && featuredError && (
          <p className="home-section-error">
            Could not load books right now. <Link to="/books">Browse the full catalogue →</Link>
          </p>
        )}

        {!featuredLoading && !featuredError && (
          <div className="book-grid">
            {featured.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
