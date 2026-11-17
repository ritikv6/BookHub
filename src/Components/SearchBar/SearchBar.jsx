import { useState } from "react";
import "./SearchBar.css";

/**
 * SearchBar
 *
 * @param {string}   value       - controlled search query value
 * @param {function} onSearch    - called with the query string when submitted or cleared
 * @param {string}   [placeholder]
 */
function SearchBar({ value, onSearch, placeholder = "Search by title, author, or subject…" }) {
  const [input, setInput] = useState(value ?? "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  const handleClear = () => {
    setInput("");
    onSearch("");
  };

  // Keep local input in sync when parent resets value (e.g. navigating)
  // only on mount or when value prop changes from outside
  const handleChange = (e) => setInput(e.target.value);

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <label htmlFor="search-input" className="sr-only">
        Search books
      </label>
      <input
        id="search-input"
        type="search"
        className="search-input"
        value={input}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Search books"
      />
      {input && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
      <button type="submit" className="search-submit" aria-label="Search">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
