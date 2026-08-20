import "./BookCard.css";

function BookCard({ book }) {
  return (
    <div className="book-card">
      <img
        src={book.image}
        alt={book.title}
        className="book-card-image"
      />

      <div className="book-card-content">
        <h3>{book.title}</h3>

        <p className="book-author">{book.author}</p>

        <div className="book-rating">
          ⭐ {book.rating}
        </div>

        <div className="book-bottom">
          <span className="book-price">₹{book.price}</span>

          <button>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;