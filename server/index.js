import http from "node:http";
import crypto from "node:crypto";
import db from "./db.js";
import { hashPassword, verifyPassword, signToken, verifyToken } from "./auth.js";

const PORT = process.env.PORT || 5000;

/**
 * CORS helper
 */
function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
}

/**
 * JSON response helper
 */
function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

/**
 * Read request body as JSON
 */
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      // Safeguard against large payloads (1MB max)
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

/**
 * Extract authenticated user from Authorization header
 */
function getAuthUser(req) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  return verifyToken(token);
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;
  const method = req.method;

  try {
    // ─── Health Check ────────────────────────────────────────────────────────
    if (method === "GET" && pathname === "/api/health") {
      return sendJson(res, 200, {
        status: "ok",
        service: "BookHub Backend API",
        time: new Date().toISOString(),
      });
    }

    // ─── Authentication: Register ───────────────────────────────────────────
    if (method === "POST" && pathname === "/api/auth/register") {
      const { name, email, password } = await readBody(req);

      if (!name || !email || !password) {
        return sendJson(res, 400, { error: "Name, email, and password are required." });
      }

      if (password.length < 6) {
        return sendJson(res, 400, { error: "Password must be at least 6 characters." });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check existing user
      const existing = db
        .prepare("SELECT id FROM users WHERE email = ?")
        .get(normalizedEmail);

      if (existing) {
        return sendJson(res, 409, { error: "An account with this email already exists." });
      }

      const { hash, salt } = hashPassword(password);
      const userId = crypto.randomUUID();

      db.prepare(
        "INSERT INTO users (id, name, email, password_hash, salt) VALUES (?, ?, ?, ?, ?)"
      ).run(userId, name.trim(), normalizedEmail, hash, salt);

      const user = { id: userId, name: name.trim(), email: normalizedEmail };
      const token = signToken({ id: userId, email: normalizedEmail, name: name.trim() });

      return sendJson(res, 201, { user, token });
    }

    // ─── Authentication: Login ──────────────────────────────────────────────
    if (method === "POST" && pathname === "/api/auth/login") {
      const { email, password } = await readBody(req);

      if (!email || !password) {
        return sendJson(res, 400, { error: "Email and password are required." });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const userRecord = db
        .prepare("SELECT * FROM users WHERE email = ?")
        .get(normalizedEmail);

      if (!userRecord) {
        return sendJson(res, 401, { error: "Invalid email or password." });
      }

      const valid = verifyPassword(password, userRecord.password_hash, userRecord.salt);
      if (!valid) {
        return sendJson(res, 401, { error: "Invalid email or password." });
      }

      const user = { id: userRecord.id, name: userRecord.name, email: userRecord.email };
      const token = signToken({ id: userRecord.id, email: userRecord.email, name: userRecord.name });

      return sendJson(res, 200, { user, token });
    }

    // ─── Authentication: Me ─────────────────────────────────────────────────
    if (method === "GET" && pathname === "/api/auth/me") {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return sendJson(res, 401, { error: "Unauthorized. Please sign in." });
      }

      const userRecord = db
        .prepare("SELECT id, name, email, created_at FROM users WHERE id = ?")
        .get(authUser.id);

      if (!userRecord) {
        return sendJson(res, 404, { error: "User not found." });
      }

      return sendJson(res, 200, { user: userRecord });
    }

    // ─── Cart: Get Items ────────────────────────────────────────────────────
    if (method === "GET" && pathname === "/api/cart") {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return sendJson(res, 401, { error: "Unauthorized." });
      }

      const items = db
        .prepare("SELECT * FROM cart_items WHERE user_id = ?")
        .all(authUser.id);

      const parsedItems = items.map((i) => {
        try {
          const book = JSON.parse(i.book_data);
          return { ...book, quantity: i.quantity };
        } catch {
          return null;
        }
      }).filter(Boolean);

      return sendJson(res, 200, { items: parsedItems });
    }

    // ─── Cart: Add / Update Item ────────────────────────────────────────────
    if (method === "POST" && pathname === "/api/cart") {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return sendJson(res, 401, { error: "Unauthorized." });
      }

      const { book, quantity = 1 } = await readBody(req);
      if (!book || !book.id) {
        return sendJson(res, 400, { error: "Book data is required." });
      }

      const id = crypto.randomUUID();
      const bookDataStr = JSON.stringify(book);

      db.prepare(`
        INSERT INTO cart_items (id, user_id, book_id, book_data, quantity)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id, book_id) DO UPDATE SET
          quantity = quantity + excluded.quantity,
          updated_at = CURRENT_TIMESTAMP
      `).run(id, authUser.id, book.id, bookDataStr, quantity);

      return sendJson(res, 200, { success: true });
    }

    // ─── Cart: Delete Item ──────────────────────────────────────────────────
    if (method === "DELETE" && pathname.startsWith("/api/cart/")) {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return sendJson(res, 401, { error: "Unauthorized." });
      }

      const bookId = pathname.replace("/api/cart/", "");
      db.prepare("DELETE FROM cart_items WHERE user_id = ? AND book_id = ?").run(
        authUser.id,
        bookId
      );

      return sendJson(res, 200, { success: true });
    }

    // ─── Cart: Clear ────────────────────────────────────────────────────────
    if (method === "POST" && pathname === "/api/cart/clear") {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return sendJson(res, 401, { error: "Unauthorized." });
      }

      db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(authUser.id);
      return sendJson(res, 200, { success: true });
    }

    // ─── Wishlist: Get Items ────────────────────────────────────────────────
    if (method === "GET" && pathname === "/api/wishlist") {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return sendJson(res, 401, { error: "Unauthorized." });
      }

      const items = db
        .prepare("SELECT * FROM wishlist_items WHERE user_id = ?")
        .all(authUser.id);

      const parsed = items.map((i) => {
        try {
          return JSON.parse(i.book_data);
        } catch {
          return null;
        }
      }).filter(Boolean);

      return sendJson(res, 200, { items: parsed });
    }

    // ─── Wishlist: Add Item ─────────────────────────────────────────────────
    if (method === "POST" && pathname === "/api/wishlist") {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return sendJson(res, 401, { error: "Unauthorized." });
      }

      const { book } = await readBody(req);
      if (!book || !book.id) {
        return sendJson(res, 400, { error: "Book data is required." });
      }

      const id = crypto.randomUUID();
      db.prepare(`
        INSERT INTO wishlist_items (id, user_id, book_id, book_data)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id, book_id) DO NOTHING
      `).run(id, authUser.id, book.id, JSON.stringify(book));

      return sendJson(res, 200, { success: true });
    }

    // ─── Wishlist: Remove Item ──────────────────────────────────────────────
    if (method === "DELETE" && pathname.startsWith("/api/wishlist/")) {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return sendJson(res, 401, { error: "Unauthorized." });
      }

      const bookId = pathname.replace("/api/wishlist/", "");
      db.prepare("DELETE FROM wishlist_items WHERE user_id = ? AND book_id = ?").run(
        authUser.id,
        bookId
      );

      return sendJson(res, 200, { success: true });
    }

    // ─── Orders: Place Order ────────────────────────────────────────────────
    if (method === "POST" && pathname === "/api/orders") {
      const authUser = getAuthUser(req);
      const {
        name,
        email,
        phone,
        address,
        city,
        pincode,
        items,
      } = await readBody(req);

      if (!name || !email || !address || !city || !pincode || !items || !items.length) {
        return sendJson(res, 400, { error: "All required order fields and cart items must be provided." });
      }

      const orderId = crypto.randomUUID();
      const orderNumber = `BH-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      const totalItems = items.reduce((acc, i) => acc + (i.quantity || 1), 0);

      db.prepare(`
        INSERT INTO orders (
          id, order_number, user_id, customer_name, customer_email,
          customer_phone, shipping_address, city, pincode, items_json,
          total_items, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed')
      `).run(
        orderId,
        orderNumber,
        authUser ? authUser.id : null,
        name,
        email,
        phone || null,
        address,
        city,
        pincode,
        JSON.stringify(items),
        totalItems
      );

      // If user is authenticated, clear their server cart
      if (authUser) {
        db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(authUser.id);
      }

      return sendJson(res, 201, {
        order: {
          id: orderId,
          orderNumber,
          customerName: name,
          customerEmail: email,
          totalItems,
          status: "Confirmed",
          createdAt: new Date().toISOString(),
        },
      });
    }

    // ─── Orders: Get User Orders ────────────────────────────────────────────
    if (method === "GET" && pathname === "/api/orders") {
      const authUser = getAuthUser(req);
      const emailQuery = url.searchParams.get("email");

      let orders;
      if (authUser) {
        orders = db
          .prepare("SELECT * FROM orders WHERE user_id = ? OR customer_email = ? ORDER BY created_at DESC")
          .all(authUser.id, authUser.email);
      } else if (emailQuery) {
        orders = db
          .prepare("SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC")
          .all(emailQuery.toLowerCase().trim());
      } else {
        return sendJson(res, 401, { error: "Sign in or provide an email to view orders." });
      }

      const formatted = orders.map((o) => {
        let items;
        try {
          items = JSON.parse(o.items_json);
        } catch {
          items = [];
        }
        return {
          id: o.id,
          orderNumber: o.order_number,
          customerName: o.customer_name,
          customerEmail: o.customer_email,
          address: `${o.shipping_address}, ${o.city} ${o.pincode}`,
          totalItems: o.total_items,
          status: o.status,
          createdAt: o.created_at,
          items,
        };
      });

      return sendJson(res, 200, { orders: formatted });
    }

    // ─── Reviews: Get by Book ID ────────────────────────────────────────────
    if (method === "GET" && pathname.startsWith("/api/reviews/")) {
      const bookId = pathname.replace("/api/reviews/", "");
      const reviews = db
        .prepare("SELECT id, user_name, rating, comment, created_at FROM reviews WHERE book_id = ? ORDER BY created_at DESC")
        .all(bookId);

      return sendJson(res, 200, { reviews });
    }

    // ─── Reviews: Add Review ────────────────────────────────────────────────
    if (method === "POST" && pathname.startsWith("/api/reviews/")) {
      const authUser = getAuthUser(req);
      const bookId = pathname.replace("/api/reviews/", "");
      const { rating, comment, userName } = await readBody(req);

      if (!rating || rating < 1 || rating > 5) {
        return sendJson(res, 400, { error: "Rating between 1 and 5 is required." });
      }

      const id = crypto.randomUUID();
      const displayName = authUser ? authUser.name : (userName || "Anonymous Reader");
      const userId = authUser ? authUser.id : "guest";

      db.prepare(`
        INSERT INTO reviews (id, book_id, user_id, user_name, rating, comment)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, bookId, userId, displayName, rating, comment || null);

      return sendJson(res, 201, {
        review: {
          id,
          userName: displayName,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        },
      });
    }

    // Fallback 404 for unknown API routes
    return sendJson(res, 404, { error: "API endpoint not found." });
  } catch (err) {
    console.error("Server Error:", err);
    return sendJson(res, 500, { error: "Internal server error." });
  }
});

server.listen(PORT, () => {
  console.log(`[BookHub Server] Running on http://localhost:${PORT}`);
  console.log(`[BookHub Server] SQLite Database active at server/bookhub.db`);
});
