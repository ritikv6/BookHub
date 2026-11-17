import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBookById } from "../../Services/Api";
import { mapBook } from "../../Services/BookMapper";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishlistContext";
import LoadingState from "../../Components/LoadingState/LoadingState";
import ErrorState from "../../Components/ErrorState/ErrorState";
import "./BookDetails.css";

const FALLBACK_COVER =
  "https://via.placeholder.com/400x540/f0eee8/687783?text=No+Cover";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart, items: cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    setBook(null);

    getBookById(id)
      .then((data) => {
        if (cancelled) return;
        const mapped = mapBook(data);
        if (!mapped) {
          setError("Book information could not be loaded.");
        } else {
          setBook(mapped);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err?.response?.status;
        if (status === 404) {
          setError("This book could not be found. It may have been removed or the link may be incorrect.");
        } else {
          setError("Failed to load book details. Please check your connection and try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  const inCart = book ? cartItems.some((i) => i.id === book.id) : false;
  const inWishlist = book ? isInWishlist(book.id) : false;

  const handleAddToCart = () => { if (book) addToCart(book); };
  const handleWishlist = () => {
    if (!book) return;
    if (inWishlist) removeFromWishlist(book.id);
    else addToWishlist(book);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    getBookById(id)
      .then((data) => { setBook(mapBook(data)); })
      .catch(() => { setError("Failed to load book details."); })
      .finally(() => setLoading(false));
  };

  return (
    <article className="book-details-page">
      {/* Back link */}
      <nav className="book-details-breadcrumb" aria-label="Breadcrumb">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          ← Back
        </button>
        <Link to="/books" className="breadcrumb-link">All Books</Link>
      </nav>

      {loading && <LoadingState message="Loading book details…" />}
      {error && <ErrorState message={error} onRetry={handleRetry} />}

      {!loading && !error && book && (
        <div className="book-details-layout">
          {/* Cover */}
          <aside className="book-details-cover-col">
            <img
              src={book.coverUrl || FALLBACK_COVER}
              alt={book.coverUrl ? `Cover of ${book.title}` : "No cover available"}
              className="book-details-cover"
              onError={(e) => { e.currentTarget.src = FALLBACK_COVER; }}
            />

            {/* Actions */}
            <div className="book-details-actions">
              <button
                className={`btn-cart${inCart ? " btn-cart--added" : ""}`}
                onClick={handleAddToCart}
                aria-label={inCart ? "Already in cart" : "Add to cart"}
              >
                {inCart ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <button
                className={`btn-wishlist${inWishlist ? " btn-wishlist--active" : ""}`}
                onClick={handleWishlist}
                aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
              >
                {inWishlist ? "♥ Saved" : "♡ Save to Wishlist"}
              </button>
            </div>
          </aside>

          {/* Info */}
          <div className="book-details-info">
            {book.categories.length > 0 && (
              <ul className="book-categories" aria-label="Categories">
                {book.categories.map((cat) => (
                  <li key={cat}>
                    <Link to={`/categories/${encodeURIComponent(cat)}`} className="category-pill">
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <h1 className="book-details-title">{book.title}</h1>

            <p className="book-details-authors">
              by {book.authors.join(", ")}
            </p>

            {book.rating != null && (
              <div className="book-details-rating" aria-label={`Average rating: ${book.rating} out of 5`}>
                <span className="stars" aria-hidden="true">⭐</span>
                <strong>{book.rating.toFixed(1)}</strong>
                {book.ratingsCount != null && (
                  <span className="rating-count">
                    &nbsp;({book.ratingsCount.toLocaleString()} ratings)
                  </span>
                )}
              </div>
            )}

            {book.description ? (
              <div className="book-details-desc">
                <h2 className="section-label">About this book</h2>
                <p>{book.description}</p>
              </div>
            ) : (
              <p className="book-details-no-desc">No description available for this book.</p>
            )}

            {/* Metadata table */}
            <div className="book-meta">
              <h2 className="section-label">Details</h2>
              <dl className="meta-list">
                {book.publisher && (
                  <>
                    <dt>Publisher</dt>
                    <dd>{book.publisher}</dd>
                  </>
                )}
                {book.publishedDate && (
                  <>
                    <dt>Published</dt>
                    <dd>{book.publishedDate}</dd>
                  </>
                )}
                {book.pageCount != null && (
                  <>
                    <dt>Pages</dt>
                    <dd>{book.pageCount}</dd>
                  </>
                )}
                {book.language && (
                  <>
                    <dt>Language</dt>
                    <dd>{book.language.toUpperCase()}</dd>
                  </>
                )}
                {book.isbn13 && (
                  <>
                    <dt>ISBN-13</dt>
                    <dd>{book.isbn13}</dd>
                  </>
                )}
                {book.isbn10 && (
                  <>
                    <dt>ISBN-10</dt>
                    <dd>{book.isbn10}</dd>
                  </>
                )}
              </dl>

              {!book.publisher && !book.publishedDate && !book.pageCount && !book.isbn13 && (
                <p className="meta-none">No additional details available.</p>
              )}
            </div>

            {/* Price / commerce */}
            <div className="book-price-block">
              {book.price != null ? (
                <p className="book-price-display">
                  {book.currency === "INR" ? "₹" : (book.currency ?? "")}
                  {book.price.toFixed(2)}
                </p>
              ) : (
                <p className="book-price-unavailable">
                  Price not available — this is a book discovery service. Pricing and purchase are not yet available.
                </p>
              )}
            </div>

            {/* External links */}
            <div className="book-external-links">
              {book.previewUrl && (
                <a
                  href={book.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-external"
                >
                  Preview on Google Books ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default BookDetails;
