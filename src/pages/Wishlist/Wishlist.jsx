import { Link } from "react-router-dom";
import { useWishlist } from "../../Context/WishlistContext";
import { useCart } from "../../Context/CartContext";
import BookCard from "../../Components/BookCard/BookCard";
import EmptyState from "../../Components/EmptyState/EmptyState";
import "./Wishlist.css";

function Wishlist() {
  const { items, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    items.forEach((book) => addToCart(book));
  };

  if (items.length === 0) {
    return (
      <main className="wishlist-page">
        <h1 className="wishlist-title">Your Wishlist</h1>
        <EmptyState
          title="Your wishlist is empty"
          message="Browse books and tap the heart icon to save books you love."
          action={<Link to="/books" className="wishlist-browse-btn">Browse Books</Link>}
        />
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <div className="wishlist-header">
        <div>
          <h1 className="wishlist-title">Your Wishlist</h1>
          <p className="wishlist-count">{items.length} {items.length === 1 ? "book" : "books"} saved</p>
        </div>
        <div className="wishlist-actions">
          <button className="wishlist-add-all-btn" onClick={handleAddAllToCart}>
            Add all to Cart
          </button>
          <button className="wishlist-clear-btn" onClick={clearWishlist}>
            Clear wishlist
          </button>
        </div>
      </div>

      <div className="book-grid">
        {items.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </main>
  );
}

export default Wishlist;
