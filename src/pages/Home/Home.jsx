import BookCard from "../../Components/BookCard/BookCard";
import "./Home.css";

const books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    price: 499,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 299,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },
  {
    id: 3,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: 399,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
  },
  {
    id: 4,
    title: "Ikigai",
    author: "Hector Garcia",
    price: 349,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc",
  },
];

function Home() {
  return (
    <div className="home">

      <section className="hero">
        <h1>Welcome to BookHub</h1>
        <p>Discover your next favourite book.</p>
      </section>

      <section className="featured-books">
        <div className="section-heading">
          <h2>Featured Books</h2>
          <a href="/books">View All</a>
        </div>

        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;