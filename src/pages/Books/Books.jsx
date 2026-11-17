import { useEffect, useState } from "react";
import BookCard from "../../Components/BookCard/BookCard";
import { getBooks } from "../../services/api";
import "./Books.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks("books");
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="books-page">
      <div className="books-header">
        <h1>Explore Books</h1>
        <p>Discover your next great read.</p>
      </div>

      {loading ? (
        <p className="loading">Loading books...</p>
      ) : (
        <div className="book-grid">
          {books.map((book) => {
            const info = book.volumeInfo;

            return (
              <BookCard
                key={book.id}
                book={{
                  id: book.id,
                  title: info.title || "Unknown Title",
                  author:
                    info.authors?.join(", ") || "Unknown Author",
                  price: 399,
                  rating: info.averageRating || 0,
                  image:
                    info.imageLinks?.thumbnail ||
                    "https://via.placeholder.com/300x400?text=No+Cover",
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Books;