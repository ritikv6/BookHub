import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import BookCard from "../../Components/BookCard/BookCard";
import LoadingState from "../../Components/LoadingState/LoadingState";
import ErrorState from "../../Components/ErrorState/ErrorState";
import EmptyState from "../../Components/EmptyState/EmptyState";
import { getBooksBySubject } from "../../Services/Api";
import { mapBooks } from "../../Services/BookMapper";
import "./CategoryBooks.css";

// Map URL-safe subject keys to display labels
const SUBJECT_LABELS = {
  fiction: "Fiction",
  science: "Science",
  history: "History",
  biography: "Biography",
  business: "Business",
  computers: "Programming",
  "self-help": "Self-Help",
  philosophy: "Philosophy",
  psychology: "Psychology",
  travel: "Travel",
  art: "Art & Design",
  health: "Health",
};

const PAGE_SIZE = 20;

function CategoryBooks() {
  const { name } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [books, setBooks] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayLabel = SUBJECT_LABELS[name] ?? name;

  const fetchBooks = useCallback(async (subject, pg) => {
     
    setLoading(true);
    setError(null);
    try {
      const startIndex = (pg - 1) * PAGE_SIZE;
      const { items, totalItems: total } = await getBooksBySubject(subject, startIndex, PAGE_SIZE);
      setBooks(mapBooks(items));
      setTotalItems(Math.min(total, 400));
    } catch {
      setError("Failed to load books for this category. Please try again.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (name) fetchBooks(name, page);
  }, [name, page, fetchBooks]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  return (
    <main className="category-books-page">
      {/* Breadcrumb */}
      <nav className="cat-breadcrumb" aria-label="Breadcrumb">
        <Link to="/categories" className="cat-breadcrumb-link">← All Categories</Link>
      </nav>

      <header className="category-books-header">
        <h1>{displayLabel}</h1>
        {!loading && !error && totalItems > 0 && (
          <p>Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, totalItems)} of ~{totalItems.toLocaleString()} books</p>
        )}
      </header>

      {loading && <LoadingState message={`Loading ${displayLabel} books…`} />}
      {!loading && error && <ErrorState message={error} onRetry={() => fetchBooks(name, page)} />}
      {!loading && !error && books.length === 0 && (
        <EmptyState
          title="No books found"
          message={`We couldn't find any books for "${displayLabel}". Try browsing other categories.`}
          action={<Link to="/categories" className="btn-browse-categories">Browse Categories</Link>}
        />
      )}

      {!loading && !error && books.length > 0 && (
        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <nav className="pagination" aria-label="Page navigation">
          <button className="page-btn" onClick={() => handlePageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
            ← Previous
          </button>
          <span className="page-info" aria-current="page">Page {page} of {totalPages}</span>
          <button className="page-btn" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages} aria-label="Next page">
            Next →
          </button>
        </nav>
      )}
    </main>
  );
}

export default CategoryBooks;
