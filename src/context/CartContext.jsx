import { createContext, useContext, useReducer, useEffect } from "react";

// ─── Storage helpers ────────────────────────────────────────────────────────

const STORAGE_KEY = "bookhub_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded or private-browsing — silently ignore
  }
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((i) => i.id === action.book.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.book.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...state, { ...action.book, quantity: 1 }];
    }

    case "REMOVE_ITEM":
      return state.filter((i) => i.id !== action.id);

    case "INCREASE_QTY":
      return state.map((i) =>
        i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i
      );

    case "DECREASE_QTY":
      return state
        .map((i) =>
          i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0);

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

 
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  // Persist on every change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addToCart = (book) => dispatch({ type: "ADD_ITEM", book });
  const removeFromCart = (id) => dispatch({ type: "REMOVE_ITEM", id });
  const increaseQuantity = (id) => dispatch({ type: "INCREASE_QTY", id });
  const decreaseQuantity = (id) => dispatch({ type: "DECREASE_QTY", id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
