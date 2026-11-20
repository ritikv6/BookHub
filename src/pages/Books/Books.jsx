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

const PAGE_SIZE = 20; // 20 books per page as requested
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

  // Read URL query parameters
  const rawQuery = searchParams.get("q") || "";
  const searchType = searchParams.get("type") || "all"; // 'all' | 'title' | 'author' | 'isbn'
  const category = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "relevance";
  const lang = searchParams.get("lang") || "all";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  // Build target query string for Google Books API
  let effectiveQuery = "";
  const trimmed = rawQuery.trim();

  if (trimmed) {
    if (searchType === "title") {
      effectiveQuery = `intitle:${trimmed}`;
    } else if (searchType === "author") {
      effectiveQuery = `inauthor:${trimmed}`;
    } else if (searchType === "isbn") {
      const cleanIsbn = trimmed.replace(/[-\s]/g, "");
      effectiveQuery = `isbn:${cleanIsbn}`;
    } else {
      // Auto-detect ISBN if user typed ISBN under "all"
      const cleanIsbn = trimmed.replace(/[-\s]/g, "");
      if (/^(978|979)?\d{9}[\dX]$/i.test(cleanIsbn)) {
        effectiveQuery = `isbn:${cleanIsbn}`;
      } else {
        effectiveQuery = trimmed;
      }
    }

    if (category !== "all") {
      effectiveQuery = `${effectiveQuery}+subject:${category}`;
    }
  } else {
    if (category !== "all") {
      effectiveQuery = `subject:${category}`;
    } else {
      effectiveQuery = DEFAULT_QUERY;
    }
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
      setTotalItems(Math.min(total, 400)); // Google Books caps useful results
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
      if (
        !v ||
        v === "all" ||
        (k === "page" && v === "1") ||
        (k === "sort" && v === "relevance") ||
        (k === "type" && v === "all")
      ) {
        updated.delete(k);
      } else {
        updated.set(k, v);
      }
    });
    setSearchParams(updated);
  };

  const handleSearch = (newQuery, newType = "all") => {
    updateParams({
      q: newQuery.trim(),
      type: newType,
      page: "1",
    });
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

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const hasActiveFilters = Boolean(
    rawQuery ||
    category !== "all" ||
    sortBy !== "relevance" ||
    lang !== "all" ||
    searchType !== "all"
  );

  // Generate numbered pagination buttons
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <section className="books-page">
      <div className="books-header">
        <h1>Explore Books</h1>
        <p>Discover your next great read from thousands of curated titles.</p>
      </div>

      {/* Search Bar with Title, Author, ISBN selector */}
      <div className="books-search-wrap">
        <SearchBar
          value={rawQuery}
          searchType={searchType}
          onSearch={handleSearch}
        />
      </div>

      {/* Category Pills Filter */}
      <div
        className="books-category-filter"
        role="tablist"
        aria-label="Filter books by category"
      >
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
          <label htmlFor="sort-select" className="filter-label">
            Sort by:
          </label>
          <select
            id="sort-select"
            className="filter-select"
            value={sortBy}
            onChange={handleSortChange}
            aria-label="Sort books order"
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <div className="filter-select-group">
          <label htmlFor="lang-select" className="filter-label">
            Language:
          </label>
          <select
            id="lang-select"
            className="filter-select"
            value={lang}
            onChange={handleLangChange}
            aria-label="Filter books language"
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
            aria-label="Reset all search filters"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Results Count & Scope Info */}
      {!loading && !error && books.length > 0 && (
        <p className="books-result-info" aria-live="polite">
          {rawQuery ? (
            <>
              Results for <strong>"{rawQuery}"</strong>
              {searchType !== "all" && (
                <span className="search-scope-badge">
                  by {searchType.toUpperCase()}
                </span>
              )}
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
        <ErrorState
          message={error}
          onRetry={() => fetchBooks(effectiveQuery, page, sortBy, lang)}
        />
      )}

      {!loading && !error && books.length === 0 && (
        <EmptyState
          title="No books found"
          message={
            hasActiveFilters
              ? "We couldn't find any books matching your exact search query or filters. Try adjusting keywords, author, or ISBN."
              : "No books available right now. Try searching for a title, author, or ISBN."
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

      {/* Dynamic Book Grid */}
      {!loading && !error && books.length > 0 && (
        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Numbered Pagination (20 books per page) */}
      {!loading && !error && totalPages > 1 && (
        <nav className="pagination" aria-label="Book catalogue pagination">
          <button
            className="page-btn page-btn--nav"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Go to previous page"
          >
            ← Previous
          </button>

          <div className="page-numbers">
            {getPageNumbers().map((pgNum) => (
              <button
                key={pgNum}
                type="button"
                className={`page-num-btn ${pgNum === page ? "active" : ""}`}
                onClick={() => handlePageChange(pgNum)}
                aria-current={pgNum === page ? "page" : undefined}
                aria-label={`Page ${pgNum}`}
              >
                {pgNum}
              </button>
            ))}
          </div>

          <button
            className="page-btn page-btn--nav"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Go to next page"
          >
            Next →
          </button>
        </nav>
      )}
    </section>
  );
}

export default Books;
