/**
 * BookMapper.js
 * Converts a raw Google Books API volume object into the consistent
 * BookHub book shape used across all pages and components.
 *
 * Always use mapBook() or mapBooks() — never read volumeInfo directly
 * in page or component files.
 */

function cleanDescription(rawDesc) {
  if (!rawDesc) return null;
  return rawDesc
    .replace(/<[^>]*>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @param {object} volume  — a single Google Books API volume object
 * @returns {BookHubBook}
 */
export function mapBook(volume) {
  if (!volume) return null;

  const info = volume.volumeInfo || {};
  const sale = volume.saleInfo || {};
  const access = volume.accessInfo || {};

  // Cover: prefer the highest-quality thumbnail available
  const rawCover =
    info.imageLinks?.extraLarge ||
    info.imageLinks?.large ||
    info.imageLinks?.medium ||
    info.imageLinks?.thumbnail ||
    info.imageLinks?.smallThumbnail ||
    null;

  // Google Books returns http:// URLs — upgrade to https://
  const coverUrl = rawCover ? rawCover.replace(/^http:\/\//, "https://") : null;

  // ISBNs
  const identifiers = info.industryIdentifiers || [];
  const isbn13 =
    identifiers.find((i) => i.type === "ISBN_13")?.identifier ?? null;
  const isbn10 =
    identifiers.find((i) => i.type === "ISBN_10")?.identifier ?? null;

  // Commerce fields — only populated when the API provides real data
  // BookHub does not invent prices; leave null until a trusted source is added
  const listPrice = sale.listPrice;
  const price = listPrice?.amount ?? null;
  const currency = listPrice?.currencyCode ?? null;
  const purchaseUrl = sale.buyLink ?? null;

  return {
    id: volume.id ?? null,
    title: info.title ?? "Unknown Title",
    authors: Array.isArray(info.authors) && info.authors.length > 0
      ? info.authors
      : ["Unknown Author"],
    description: cleanDescription(info.description),
    coverUrl,
    categories: Array.isArray(info.categories) ? info.categories : [],
    rating: typeof info.averageRating === "number" ? info.averageRating : null,
    ratingsCount:
      typeof info.ratingsCount === "number" ? info.ratingsCount : null,
    publisher: info.publisher ?? null,
    publishedDate: info.publishedDate ?? null,
    pageCount: typeof info.pageCount === "number" ? info.pageCount : null,
    language: info.language ?? null,
    isbn10,
    isbn13,
    previewUrl: access.webReaderLink ?? info.previewLink ?? null,
    infoUrl: info.infoLink ?? null,
    // Commerce — intentionally null until BookHub controls its own catalogue
    price,
    currency,
    purchaseUrl,
  };
}

/**
 * @param {object[]} volumes  — array of Google Books API volume objects
 * @returns {BookHubBook[]}
 */
export function mapBooks(volumes) {
  if (!Array.isArray(volumes)) return [];
  return volumes.map(mapBook).filter(Boolean);
}
