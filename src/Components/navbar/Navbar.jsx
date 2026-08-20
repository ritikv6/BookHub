import ".navbar.css";

function Navbar() {
    return (<header className = "navbar" >
        <div className="navbar-container">
            <div className="logo">
                BookHub
            </div>
            <nav className="nav-links">
                <a href="/">Home</a>
                <a href="/books">Books</a>
                <a href="/categories">Categories</a>
                <a href="/cart">Cart</a>
                <a href="/wishlist">Wishlist</a>
            </nav>
        </div>
        </header>
    );

}