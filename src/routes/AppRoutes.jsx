import { Routes, Route, Navigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// Pages
import Home from "../pages/Home/Home";
import Books from "../pages/Books/Books";
import BookDetails from "../pages/BookDetails/BookDetails";
import Categories from "../pages/Categories/Categories";
import CategoryBooks from "../pages/Categories/CategoryBooks";
import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import Checkout from "../pages/Checkout/Checkout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Profile from "../pages/Profile/Profile";
import Orders from "../pages/Orders/Orders";
import Contact from "../pages/Contact/Contact";
import NotFound from "../pages/NotFound/NotFound";

function CategoryRedirect() {
  const { name } = useParams();
  return <Navigate to={`/categories/${name || ""}`} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Book catalogue & details */}
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />

        {/* Categories */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:name" element={<CategoryBooks />} />
        {/* Redirect singular /category/:name to plural /categories/:name */}
        <Route path="/category/:name" element={<CategoryRedirect />} />

        {/* Cart, wishlist, checkout */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Authentication & User Account */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />

        {/* Support & Contact */}
        <Route path="/contact" element={<Contact />} />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
