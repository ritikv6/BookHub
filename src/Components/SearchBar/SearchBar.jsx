import { useState, useEffect } from "react";
import "./SearchBar.css";

/**
 * SearchBar
 *
 * Supports searching across all fields or targeting specifically by:
 * - Title (`intitle:`)
 * - Author (`inauthor:`)
 * - ISBN (`isbn:`)
 *
 * @param {string}   value       - current search query value
 * @param {string}   searchType  - current search field ('all' | 'title' | 'author' | 'isbn')
 * @param {function} onSearch    - callback (query, searchType)
 * @param {string}   [placeholder]
 */
function SearchBar({
  value = "",
  searchType = "all",
  onSearch,
  placeholder = "Search by title, author, or ISBN…",
}) {
  const [input, setInput] = useState(value ?? "");
  const [type, setType] = useState(searchType ?? "all");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInput(value ?? "");
  }, [value]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setType(searchType ?? "all");
  }, [searchType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    // Auto-detect ISBN if user typed an ISBN while "all" is selected
    const cleanDigits = trimmed.replace(/[-\s]/g, "");
    let effectiveType = type;
    if (type === "all" && /^(978|979)?\d{9}[\dX]$/i.test(cleanDigits)) {
      effectiveType = "isbn";
    }

    onSearch(trimmed, effectiveType);
  };

  const handleClear = () => {
    setInput("");
    onSearch("", type);
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    if (input.trim()) {
      onSearch(input.trim(), newType);
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case "title":
        return "Search by book title (e.g. The Hobbit)…";
      case "author":
        return "Search by author name (e.g. J.K. Rowling)…";
      case "isbn":
        return "Enter 10 or 13 digit ISBN (e.g. 9780132350884)…";
      default:
        return placeholder;
    }
  };

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      {/* Target Field Dropdown */}
      <div className="search-type-wrapper">
        <label htmlFor="search-type-select" className="sr-only">
          Search by field
        </label>
        <select
          id="search-type-select"
          className="search-type-select"
          value={type}
          onChange={handleTypeChange}
          aria-label="Search filter field"
        >
          <option value="all">All Fields</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="isbn">ISBN</option>
        </select>
      </div>

      <label htmlFor="search-input" className="sr-only">
        Search books
      </label>
      <input
        id="search-input"
        type="search"
        className="search-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={getPlaceholder()}
        autoComplete="off"
        aria-label="Search query"
      />

      {input && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search input"
        >
          ✕
        </button>
      )}

      <button type="submit" className="search-submit" aria-label="Search catalogue">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
