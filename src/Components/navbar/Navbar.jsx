import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="logo" aria-label="BookHub home">
          BookHub
        </NavLink>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/books" className={({ isActive }) => (isActive ? "active" : "")}>
            Books
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => (isActive ? "active" : "")}>
            Categories
          </NavLink>
          <NavLink
            to="/wishlist"
            className={({ isActive }) => `nav-badge-link${isActive ? " active" : ""}`}
            aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ""}`}
          >
            Wishlist
            {wishlistCount > 0 && (
              <span className="nav-badge" aria-hidden="true">{wishlistCount}</span>
            )}
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-badge-link${isActive ? " active" : ""}`}
            aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
          >
            Cart
            {cartCount > 0 && (
              <span className="nav-badge" aria-hidden="true">{cartCount}</span>
            )}
          </NavLink>

          {user ? (
            <NavLink
              to="/profile"
              className={({ isActive }) => `nav-user-pill${isActive ? " active" : ""}`}
              aria-label={`Signed in as ${user.name}`}
            >
              <span className="user-avatar-tiny" aria-hidden="true">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
              <span className="user-name-short">{user.name ? user.name.split(" ")[0] : "Account"}</span>
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => `nav-auth-link${isActive ? " active" : ""}`}
            >
              Sign In
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
