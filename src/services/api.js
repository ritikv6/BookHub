import axios from "axios";

const API = axios.create({
  baseURL: "https://www.googleapis.com/books/v1",
});

/**
 * Search for books with query, pagination, sorting, and language options.
 *
 * @param {string} query        - search terms (title, author, subject, etc.)
 * @param {number} startIndex   - 0-based result offset for pagination
 * @param {number} maxResults   - number of results per page (max 40)
 * @param {object} [options]    - optional filters: { orderBy, langRestrict }
 * @returns {Promise<{ items: object[], totalItems: number }>}
 */
export const getBooks = async (
  query = "popular books",
  startIndex = 0,
  maxResults = 20,
  options = {}
) => {
  const params = {
    q: query || "popular books",
    startIndex,
    maxResults,
    printType: "books",
  };

  if (options.orderBy && ["relevance", "newest"].includes(options.orderBy)) {
    params.orderBy = options.orderBy;
  }

  if (options.langRestrict && options.langRestrict !== "all") {
    params.langRestrict = options.langRestrict;
  }

  const response = await API.get("/volumes", { params });

  return {
    items: response.data.items || [],
    totalItems: response.data.totalItems || 0,
  };
};

/**
 * Fetch a single book by its Google Books volume ID.
 *
 * @param {string} id  - Google Books volume ID
 * @returns {Promise<object>}  raw Google Books volume object
 */
export const getBookById = async (id) => {
  const response = await API.get(`/volumes/${id}`);
  return response.data;
};

/**
 * Search books by subject/category using Google Books subject query syntax.
 *
 * @param {string} subject      - subject label (e.g. "Fiction", "Science")
 * @param {number} startIndex
 * @param {number} maxResults
 * @param {object} [options]
 * @returns {Promise<{ items: object[], totalItems: number }>}
 */
export const getBooksBySubject = async (
  subject,
  startIndex = 0,
  maxResults = 20,
  options = {}
) => {
  return getBooks(`subject:${subject}`, startIndex, maxResults, options);
};
