import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { apiCreateOrder } from "../../services/backendApi";
import "./Checkout.css";

/**
 * Checkout
 * Connects with BookHub Backend SQLite order storage,
 * with graceful fallback to simulated order creation.
 */

function Checkout() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Pre-fill user data if signed in
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  if (items.length === 0 && !confirmedOrder) {
    return (
      <main className="checkout-page">
        <h1>Checkout</h1>
        <p className="checkout-empty">Your cart is empty. <Link to="/books">Browse books</Link> to add items.</p>
      </main>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.address.trim()) e.address = "Delivery address is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.pincode.trim()) e.pincode = "Postcode is required.";
    else if (!/^\d{4,10}$/.test(form.pincode.trim())) e.pincode = "Enter a valid postcode (4–10 digits).";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    const orderPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      pincode: form.pincode.trim(),
      items: items.map((i) => ({
        id: i.id,
        title: i.title,
        quantity: i.quantity,
        authors: i.authors,
      })),
    };

    try {
      const res = await apiCreateOrder(orderPayload);
      clearCart();
      setConfirmedOrder(res.order);
    } catch {
      // Fallback: save to client storage
      const fallbackOrder = {
        orderNumber: `BH-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
        customerName: form.name,
        customerEmail: form.email,
        totalItems: items.reduce((s, i) => s + i.quantity, 0),
        status: "Confirmed",
        createdAt: new Date().toISOString(),
        items,
        address: `${form.address}, ${form.city} ${form.pincode}`,
      };

      try {
        const existing = JSON.parse(localStorage.getItem("bookhub_local_orders") || "[]");
        localStorage.setItem("bookhub_local_orders", JSON.stringify([fallbackOrder, ...existing]));
      } catch {
        // quota exceeded
      }

      clearCart();
      setConfirmedOrder(fallbackOrder);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <main className="checkout-page checkout-page--confirm">
        <div className="confirm-box">
          <span className="confirm-icon" aria-hidden="true">✅</span>
          <h1 className="confirm-title">Order Confirmed!</h1>
          <p className="confirm-order-number">
            Order Reference: <strong>{confirmedOrder.orderNumber}</strong>
          </p>
          <p className="confirm-message">
            Thank you, <strong>{confirmedOrder.customerName || form.name}</strong>. Your order for {confirmedOrder.totalItems} book(s) has been placed and recorded.
          </p>
          <div className="confirm-actions">
            <Link to="/orders" className="confirm-btn-primary">View My Orders</Link>
            <Link to="/books" className="confirm-btn-secondary">Browse More Books</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-layout">
        {/* Form */}
        <section className="checkout-form-section" aria-labelledby="checkout-heading">
          <h1 id="checkout-heading" className="checkout-title">Checkout</h1>

          <div className="checkout-demo-notice" role="note">
            <strong>Order Processing:</strong> Your order will be stored and tracked in your BookHub account. No real financial transaction will take place.
          </div>

          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <fieldset className="form-group">
              <legend className="form-legend">Contact Details</legend>

              <div className="form-field">
                <label htmlFor="name" className="form-label">Full name <span aria-hidden="true">*</span></label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`form-input${errors.name ? " form-input--error" : ""}`}
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  aria-required="true"
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && <span id="name-error" className="form-error" role="alert">{errors.name}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="email" className="form-label">Email address <span aria-hidden="true">*</span></label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input${errors.email ? " form-input--error" : ""}`}
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-required="true"
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && <span id="email-error" className="form-error" role="alert">{errors.email}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="phone" className="form-label">Phone (optional)</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
            </fieldset>

            <fieldset className="form-group">
              <legend className="form-legend">Delivery Address</legend>

              <div className="form-field">
                <label htmlFor="address" className="form-label">Street address <span aria-hidden="true">*</span></label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className={`form-input${errors.address ? " form-input--error" : ""}`}
                  value={form.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                  aria-required="true"
                  aria-describedby={errors.address ? "address-error" : undefined}
                />
                {errors.address && <span id="address-error" className="form-error" role="alert">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="city" className="form-label">City <span aria-hidden="true">*</span></label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className={`form-input${errors.city ? " form-input--error" : ""}`}
                    value={form.city}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    aria-required="true"
                    aria-describedby={errors.city ? "city-error" : undefined}
                  />
                  {errors.city && <span id="city-error" className="form-error" role="alert">{errors.city}</span>}
                </div>

                <div className="form-field">
                  <label htmlFor="pincode" className="form-label">Postcode <span aria-hidden="true">*</span></label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    inputMode="numeric"
                    className={`form-input${errors.pincode ? " form-input--error" : ""}`}
                    value={form.pincode}
                    onChange={handleChange}
                    autoComplete="postal-code"
                    aria-required="true"
                    aria-describedby={errors.pincode ? "pincode-error" : undefined}
                  />
                  {errors.pincode && <span id="pincode-error" className="form-error" role="alert">{errors.pincode}</span>}
                </div>
              </div>
            </fieldset>

            <button type="submit" className="checkout-submit-btn" disabled={submitting}>
              {submitting ? "Placing Order…" : "Place Order"}
            </button>
          </form>
        </section>

        {/* Order summary */}
        <aside className="checkout-summary" aria-label="Order summary">
          <h2 className="summary-title">Order Summary</h2>
          <ul className="checkout-item-list">
            {items.map((item) => (
              <li key={item.id} className="checkout-item">
                <span className="checkout-item-title">{item.title}</span>
                <span className="checkout-item-qty">× {item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="checkout-summary-footer">
            <p className="checkout-total-label">Total items: {items.reduce((s, i) => s + i.quantity, 0)}</p>
          </div>
          <Link to="/cart" className="checkout-edit-cart-link">← Edit cart</Link>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;
