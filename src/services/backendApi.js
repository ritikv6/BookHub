import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const backendClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// Auto-attach Bearer token if available
backendClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("bookhub_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const apiRegister = async (data) => {
  const res = await backendClient.post("/auth/register", data);
  return res.data;
};

export const apiLogin = async (data) => {
  const res = await backendClient.post("/auth/login", data);
  return res.data;
};

export const apiGetMe = async () => {
  const res = await backendClient.get("/auth/me");
  return res.data;
};

// Cart
export const apiGetCart = async () => {
  const res = await backendClient.get("/cart");
  return res.data;
};

export const apiAddCartItem = async (book, quantity = 1) => {
  const res = await backendClient.post("/cart", { book, quantity });
  return res.data;
};

export const apiRemoveCartItem = async (bookId) => {
  const res = await backendClient.delete(`/cart/${bookId}`);
  return res.data;
};

export const apiClearCart = async () => {
  const res = await backendClient.post("/cart/clear");
  return res.data;
};

// Wishlist
export const apiGetWishlist = async () => {
  const res = await backendClient.get("/wishlist");
  return res.data;
};

export const apiAddWishlistItem = async (book) => {
  const res = await backendClient.post("/wishlist", { book });
  return res.data;
};

export const apiRemoveWishlistItem = async (bookId) => {
  const res = await backendClient.delete(`/wishlist/${bookId}`);
  return res.data;
};

// Orders
export const apiCreateOrder = async (orderData) => {
  const res = await backendClient.post("/orders", orderData);
  return res.data;
};

export const apiGetOrders = async (email) => {
  const params = email ? { email } : {};
  const res = await backendClient.get("/orders", { params });
  return res.data;
};

// Reviews
export const apiGetReviews = async (bookId) => {
  const res = await backendClient.get(`/reviews/${bookId}`);
  return res.data;
};

export const apiPostReview = async (bookId, reviewData) => {
  const res = await backendClient.post(`/reviews/${bookId}`, reviewData);
  return res.data;
};

export default backendClient;
