import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiGetOrders } from "../../services/backendApi";
import LoadingState from "../../Components/LoadingState/LoadingState";
import EmptyState from "../../Components/EmptyState/EmptyState";
import "./Orders.css";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");

  const loadOrders = useCallback(async (email) => {
    setLoading(true);
    try {
      const data = await apiGetOrders(email);
      setOrders(data.orders || []);
    } catch {
      // Fallback: check local storage orders
      try {
        const local = localStorage.getItem("bookhub_local_orders");
        setOrders(local ? JSON.parse(local) : []);
      } catch {
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders(user ? user.email : "");
  }, [user, loadOrders]);

  const handleLookup = (e) => {
    e.preventDefault();
    if (searchEmail.trim()) {
      loadOrders(searchEmail.trim());
    }
  };

  return (
    <main className="orders-page">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <p>Review and track your recent BookHub book purchases and demo orders.</p>
      </div>

      {!user && (
        <form className="order-lookup-bar" onSubmit={handleLookup}>
          <input
            type="email"
            placeholder="Enter order email address…"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="lookup-input"
            required
          />
          <button type="submit" className="lookup-btn">
            Find Orders
          </button>
        </form>
      )}

      {loading && <LoadingState message="Loading your orders…" />}

      {!loading && orders.length === 0 && (
        <EmptyState
          title="No orders found"
          message={
            user
              ? "You haven't placed any book orders yet. Browse our catalogue to get started!"
              : "No orders found for this lookup. If you placed an order, please verify your email address."
          }
          action={<Link to="/books" className="btn-browse-orders">Browse Books</Link>}
        />
      )}

      {!loading && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order.id || order.orderNumber} className="order-card">
              <header className="order-card-header">
                <div>
                  <span className="order-number-label">Order Number</span>
                  <h3 className="order-number">{order.orderNumber}</h3>
                  <span className="order-date">
                    Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent"}
                  </span>
                </div>
                <div className="order-status-wrap">
                  <span className={`status-pill status-pill--${(order.status || "confirmed").toLowerCase()}`}>
                    ● {order.status || "Confirmed"}
                  </span>
                </div>
              </header>

              <div className="order-card-body">
                <div className="order-meta">
                  <p><strong>Deliver to:</strong> {order.customerName}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                  <p><strong>Total Items:</strong> {order.totalItems}</p>
                </div>

                <div className="order-items-preview">
                  <h4>Books in this Order:</h4>
                  <ul className="order-items-list">
                    {(order.items || []).map((item, idx) => (
                      <li key={idx} className="order-item-row">
                        <span className="order-item-title">{item.title}</span>
                        <span className="order-item-qty">Qty: {item.quantity || 1}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Orders;
