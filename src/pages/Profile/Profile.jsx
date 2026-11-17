import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-card profile-card--guest">
          <h1>Account Required</h1>
          <p>Please sign in to view your profile and saved activity.</p>
          <div className="profile-actions">
            <Link to="/login" className="btn-profile-primary">Sign In</Link>
            <Link to="/register" className="btn-profile-secondary">Create Account</Link>
          </div>
        </div>
      </main>
    );
  }

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <main className="profile-page">
      <div className="profile-container">
        {/* Header card */}
        <section className="profile-header-card">
          <div className="profile-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="profile-header-info">
            <h1>{user.name || "Reader"}</h1>
            <p className="profile-email">{user.email}</p>
            <span className="profile-status-badge">
              {user.isDemo ? "Guest Demo Session" : "Verified Reader Account"}
            </span>
          </div>
          <button type="button" className="btn-sign-out" onClick={handleSignOut}>
            Sign Out
          </button>
        </section>

        {/* Quick Stats Grid */}
        <section className="profile-stats-grid">
          <Link to="/wishlist" className="stat-card">
            <span className="stat-icon" aria-hidden="true">♥</span>
            <div className="stat-info">
              <span className="stat-value">{wishlistCount}</span>
              <span className="stat-label">Saved in Wishlist</span>
            </div>
          </Link>

          <Link to="/cart" className="stat-card">
            <span className="stat-icon" aria-hidden="true">🛒</span>
            <div className="stat-info">
              <span className="stat-value">{cartCount}</span>
              <span className="stat-label">Books in Cart</span>
            </div>
          </Link>

          <Link to="/orders" className="stat-card">
            <span className="stat-icon" aria-hidden="true">📦</span>
            <div className="stat-info">
              <span className="stat-value">View</span>
              <span className="stat-label">Order History</span>
            </div>
          </Link>
        </section>

        {/* Account Details & Preferences */}
        <section className="profile-details-section">
          <h2>Account Details</h2>
          <div className="details-table">
            <div className="details-row">
              <span className="details-label">Full Name:</span>
              <span className="details-value">{user.name}</span>
            </div>
            <div className="details-row">
              <span className="details-label">Email Address:</span>
              <span className="details-value">{user.email}</span>
            </div>
            <div className="details-row">
              <span className="details-label">Account ID:</span>
              <span className="details-value font-mono">{user.id || "N/A"}</span>
            </div>
            <div className="details-row">
              <span className="details-label">Data Storage:</span>
              <span className="details-value">BookHub Server SQLite + Local Cache</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;
