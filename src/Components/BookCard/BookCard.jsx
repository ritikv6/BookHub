import { Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishlistContext";
import "./BookCard.css";

const FALLBACK_COVER =
  "https://via.placeholder.com/300x400/f0eee8/687783?text=No+Cover";

function BookCard({ book }) {
  const { addToCart, items: cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inCart = cartItems.some((i) => i.id === book.id);
  const inWishlist = isInWishlist(book.id);

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent Link navigation when clicking button
    addToCart(book);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  return (
    <Link to={`/books/${book.id}`} className="book-card" aria-label={`View details for ${book.title}`}>
      <div className="book-card-cover-wrap">
        <img
          src={book.coverUrl || FALLBACK_COVER}
          alt={book.coverUrl ? `Cover of ${book.title}` : "No cover available"}
          className="book-card-image"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = FALLBACK_COVER; }}
        />
        <button
          className={`wishlist-btn${inWishlist ? " wishlist-btn--active" : ""}`}
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {inWishlist ? "♥" : "♡"}
        </button>
      </div>

      <div className="book-card-content">
        <h3>{book.title}</h3>
        <p className="book-author">
          {Array.isArray(book.authors)
            ? book.authors.join(", ")
            : book.authors ?? "Unknown Author"}
        </p>

        {book.rating != null ? (
          <div className="book-rating" aria-label={`Rating: ${book.rating} out of 5`}>
            ⭐ {book.rating.toFixed(1)}
            {book.ratingsCount != null && (
              <span className="ratings-count"> ({book.ratingsCount.toLocaleString()})</span>
            )}
          </div>
        ) : (
          <div className="book-rating book-rating--none">Not yet rated</div>
        )}

        <div className="book-bottom">
          {book.price != null ? (
            <span className="book-price">
              {book.currency === "INR" ? "₹" : (book.currency ?? "")}
              {book.price.toFixed(2)}
            </span>
          ) : (
            <span className="book-price book-price--unavailable">Price unavailable</span>
          )}

          <button
            className={`add-to-cart-btn${inCart ? " add-to-cart-btn--added" : ""}`}
            onClick={handleAddToCart}
            aria-label={inCart ? "Added to cart" : "Add to cart"}
          >
            {inCart ? "✓ In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
