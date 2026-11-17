import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../../Components/BookCard/BookCard";
import SearchBar from "../../Components/SearchBar/SearchBar";
import LoadingState from "../../Components/LoadingState/LoadingState";
import ErrorState from "../../Components/ErrorState/ErrorState";
import EmptyState from "../../Components/EmptyState/EmptyState";
import { getBooks } from "../../services/api";
import { mapBooks } from "../../services/BookMapper";
import "./Books.css";

const PAGE_SIZE = 20;
const DEFAULT_QUERY = "bestseller books";

const QUICK_CATEGORIES = [
  { id: "all", label: "All Topics" },
  { id: "fiction", label: "Fiction" },
  { id: "science", label: "Science" },
  { id: "history", label: "History" },
  { id: "business", label: "Business" },
  { id: "computers", label: "Technology" },
  { id: "philosophy", label: "Philosophy" },
  { id: "art", label: "Art" },
];

function Books() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const rawQuery = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "relevance";
  const lang = searchParams.get("lang") || "all";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  // Determine actual search query passed to API
  let effectiveQuery = rawQuery.trim();
  if (!effectiveQuery) {
    if (category !== "all") {
      effectiveQuery = `subject:${category}`;
    } else {
      effectiveQuery = DEFAULT_QUERY;
    }
  } else if (category !== "all") {
    effectiveQuery = `${effectiveQuery}+subject:${category}`;
  }

  const [books, setBooks] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async (q, pg, sort, language) => {
    setLoading(true);
    setError(null);
    try {
      const startIndex = (pg - 1) * PAGE_SIZE;
      const options = {
        orderBy: sort,
        langRestrict: language !== "all" ? language : undefined,
      };
      const { items, totalItems: total } = await getBooks(
        q,
        startIndex,
        PAGE_SIZE,
        options
      );
      setBooks(mapBooks(items));
      setTotalItems(Math.min(total, 400));
    } catch {
      setError("Failed to load books. Please check your connection and try again.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBooks(effectiveQuery, page, sortBy, lang);
  }, [effectiveQuery, page, sortBy, lang, fetchBooks]);

  const updateParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (!v || v === "all" || (k === "page" && v === "1") || (k === "sort" && v === "relevance")) {
        updated.delete(k);
      } else {
        updated.set(k, v);
      }
    });
    setSearchParams(updated);
  };

  const handleSearch = (newQuery) => {
    const trimmed = newQuery.trim();
    updateParams({ q: trimmed, page: "1" });
  };

  const handleCategoryChange = (catId) => {
    updateParams({ category: catId, page: "1" });
  };

  const handleSortChange = (e) => {
    updateParams({ sort: e.target.value, page: "1" });
  };

  const handleLangChange = (e) => {
    updateParams({ lang: e.target.value, page: "1" });
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const hasActiveFilters = Boolean(rawQuery || category !== "all" || sortBy !== "relevance" || lang !== "all");

  return (
    <section className="books-page">
      <div className="books-header">
        <h1>Explore Books</h1>
        <p>Discover your next great read from thousands of curated titles.</p>
      </div>

      {/* Search Bar */}
      <div className="books-search-wrap">
        <SearchBar value={rawQuery} onSearch={handleSearch} />
      </div>

      {/* Category Pills Filter */}
      <div className="books-category-filter" role="tablist" aria-label="Filter by category">
        {QUICK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={category === cat.id}
            className={`cat-filter-btn ${category === cat.id ? "active" : ""}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Controls Bar: Sort, Language, and Reset */}
      <div className="books-controls-bar">
        <div className="filter-select-group">
          <label htmlFor="sort-select" className="filter-label">Sort by:</label>
          <select
            id="sort-select"
            className="filter-select"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <div className="filter-select-group">
          <label htmlFor="lang-select" className="filter-label">Language:</label>
          <select
            id="lang-select"
            className="filter-select"
            value={lang}
            onChange={handleLangChange}
          >
            <option value="all">All Languages</option>
            <option value="en">English Only</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn-reset-filters"
            onClick={handleResetFilters}
          >
            Reset All
          </button>
        )}
      </div>

      {/* Results Count Banner */}
      {!loading && !error && books.length > 0 && (
        <p className="books-result-info" aria-live="polite">
          {rawQuery ? (
            <>
              Results for <strong>"{rawQuery}"</strong>
              {category !== "all" && <> in <em>{category}</em></>} — showing{" "}
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalItems)} of ~{totalItems.toLocaleString()}
            </>
          ) : (
            <>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalItems)} of ~{totalItems.toLocaleString()} books
              {category !== "all" && <> in <em>{category}</em></>}
            </>
          )}
        </p>
      )}

      {loading && <LoadingState message="Searching & loading books…" />}

      {!loading && error && (
        <ErrorState message={error} onRetry={() => fetchBooks(effectiveQuery, page, sortBy, lang)} />
      )}

      {!loading && !error && books.length === 0 && (
        <EmptyState
          title="No books found"
          message={
            hasActiveFilters
              ? "We couldn't find any books matching your exact search or filter options. Try clearing filters or using different keywords."
              : "No books available right now. Try searching for a title or author."
          }
          action={
            hasActiveFilters ? (
              <button className="btn-clear-search" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            ) : null
          }
        />
      )}

      {!loading && !error && books.length > 0 && (
        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <nav className="pagination" aria-label="Page navigation">
          <button
            className="page-btn"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            ← Previous
          </button>
          <span className="page-info" aria-current="page">
            Page {page} of {totalPages}
          </span>
          <button
            className="page-btn"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            Next →
          </button>
        </nav>
      )}
    </section>
  );
}

export default Books;
