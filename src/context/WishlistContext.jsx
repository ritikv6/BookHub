import { createContext, useContext, useReducer, useEffect } from "react";

// ─── Storage helpers ─────────────────────────────────────────────────────────

const STORAGE_KEY = "bookhub_wishlist";

function loadWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveWishlist(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function wishlistReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      if (state.some((i) => i.id === action.book.id)) return state; // already saved
      return [...state, action.book];
    }
    case "REMOVE_ITEM":
      return state.filter((i) => i.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

 
const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, dispatch] = useReducer(wishlistReducer, [], loadWishlist);

  useEffect(() => {
    saveWishlist(items);
  }, [items]);

  const addToWishlist = (book) => dispatch({ type: "ADD_ITEM", book });
  const removeFromWishlist = (id) => dispatch({ type: "REMOVE_ITEM", id });
  const clearWishlist = () => dispatch({ type: "CLEAR" });
  const isInWishlist = (id) => items.some((i) => i.id === id);

  return (
    <WishlistContext.Provider
      value={{ items, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist, totalItems: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
