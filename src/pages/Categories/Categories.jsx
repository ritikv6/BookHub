import { Link } from "react-router-dom";
import "./Categories.css";

const CATEGORIES = [
  { label: "Fiction",       subject: "fiction",       emoji: "📖", description: "Novels, stories, and imaginative worlds." },
  { label: "Science",       subject: "science",       emoji: "🔬", description: "Physics, biology, astronomy, and more." },
  { label: "History",       subject: "history",       emoji: "🏛️", description: "Events, eras, and civilisations past." },
  { label: "Biography",     subject: "biography",     emoji: "👤", description: "Lives of remarkable people." },
  { label: "Business",      subject: "business",      emoji: "💼", description: "Strategy, entrepreneurship, and finance." },
  { label: "Programming",   subject: "computers",     emoji: "💻", description: "Software, algorithms, and technology." },
  { label: "Self-Help",     subject: "self-help",     emoji: "🌱", description: "Mindset, habits, and personal growth." },
  { label: "Philosophy",    subject: "philosophy",    emoji: "🤔", description: "Ideas, ethics, and the nature of existence." },
  { label: "Psychology",    subject: "psychology",    emoji: "🧠", description: "Mind, behaviour, and human nature." },
  { label: "Travel",        subject: "travel",        emoji: "✈️", description: "Destinations and adventures around the world." },
  { label: "Art & Design",  subject: "art",           emoji: "🎨", description: "Visual art, architecture, and creativity." },
  { label: "Health",        subject: "health",        emoji: "❤️", description: "Wellness, nutrition, and medicine." },
];

function Categories() {
  return (
    <main className="categories-page">
      <div className="categories-header">
        <h1>Browse by Category</h1>
        <p>Find books in the subjects that interest you most.</p>
      </div>

      <ul className="categories-grid" role="list" aria-label="Book categories">
        {CATEGORIES.map((cat) => (
          <li key={cat.subject}>
            <Link
              to={`/categories/${encodeURIComponent(cat.subject)}`}
              className="cat-card"
              aria-label={`Browse ${cat.label} books`}
            >
              <span className="cat-emoji" aria-hidden="true">{cat.emoji}</span>
              <span className="cat-label">{cat.label}</span>
              <span className="cat-desc">{cat.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Categories;
