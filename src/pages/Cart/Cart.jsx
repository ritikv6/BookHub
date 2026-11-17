import { Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import EmptyState from "../../Components/EmptyState/EmptyState";
import "./Cart.css";

const FALLBACK_COVER = "https://via.placeholder.com/80x110/f0eee8/687783?text=Book";

function Cart() {
  const { items, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <h1 className="cart-title">Your Cart</h1>
        <EmptyState
          title="Your cart is empty"
          message="Browse books and add some to your cart."
          action={<Link to="/books" className="cart-browse-btn">Browse Books</Link>}
        />
      </main>
    );
  }

  // Note: These items come from Google Books metadata.
  // Prices shown are from the Google Books API and may not reflect actual purchase prices.
  // BookHub does not currently process real purchases.
  const hasRealPrices = items.some((i) => i.price != null);

  return (
    <main className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">Your Cart</h1>
        <button className="cart-clear-btn" onClick={clearCart} aria-label="Clear all items from cart">
          Clear cart
        </button>
      </div>

      <div className="cart-layout">
        {/* Item list */}
        <ul className="cart-items" aria-label="Cart items">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <Link to={`/books/${item.id}`} className="cart-item-cover-link" tabIndex={-1} aria-hidden="true">
                <img
                  src={item.coverUrl || FALLBACK_COVER}
                  alt=""
                  className="cart-item-cover"
                  onError={(e) => { e.currentTarget.src = FALLBACK_COVER; }}
                />
              </Link>

              <div className="cart-item-details">
                <Link to={`/books/${item.id}`} className="cart-item-title">
                  {item.title}
                </Link>
                <p className="cart-item-author">
                  {Array.isArray(item.authors) ? item.authors.join(", ") : item.authors}
                </p>

                <div className="cart-item-qty">
                  <button
                    className="qty-btn"
                    onClick={() => decreaseQuantity(item.id)}
                    aria-label={`Decrease quantity of ${item.title}`}
                  >
                    −
                  </button>
                  <span className="qty-value" aria-label={`Quantity: ${item.quantity}`}>
                    {item.quantity}
                  </span>
                  <button
                    className="qty-btn"
                    onClick={() => increaseQuantity(item.id)}
                    aria-label={`Increase quantity of ${item.title}`}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item-right">
                {item.price != null ? (
                  <span className="cart-item-price">
                    {item.currency === "INR" ? "₹" : (item.currency ?? "")}
                    {(item.price * item.quantity).toFixed(2)}
                  </span>
                ) : (
                  <span className="cart-item-price-na">Price unavailable</span>
                )}
                <button
                  className="cart-remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.title} from cart`}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="cart-summary" aria-label="Order summary">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-row">
            <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
            {hasRealPrices ? (
              <span>
                {items[0]?.currency === "INR" ? "₹" : ""}
                {items
                  .filter((i) => i.price != null)
                  .reduce((s, i) => s + i.price * i.quantity, 0)
                  .toFixed(2)}
              </span>
            ) : (
              <span className="summary-na">—</span>
            )}
          </div>

          {!hasRealPrices && (
            <p className="summary-price-note">
              Pricing information is not available for the books in your cart. BookHub is currently a discovery experience — real purchase pricing requires a future commerce integration.
            </p>
          )}

          <Link to="/checkout" className="summary-checkout-btn">
            Proceed to Checkout
          </Link>

          <Link to="/books" className="summary-continue-link">
            ← Continue browsing
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default Cart;
