# BookHub — Full Project Roadmap

> **Project type:** Responsive online bookstore frontend, with a path to a full-stack e-commerce application  
> **Frontend:** React 19, Vite 8, JavaScript, React Compiler  
> **Backend:** Node.js 24 Native HTTP Server, SQLite 3 (`node:sqlite`), Native Crypto (`node:crypto` PBKDF2 & HMAC SHA-256 JWT)  
> **Routing:** React Router v7  
> **HTTP client:** Axios  
> **Initial book-data source:** Google Books API  
> **Styling:** CSS (Design Tokens & Responsive Flex/Grid)  
> **Shared state:** React Context API (`AuthContext`, `CartContext`, `WishlistContext`, with `localStorage` + Backend DB sync)

---

## 1. Project overview

**BookHub** is a modern online bookstore application. It helps users discover books, browse a catalogue, search by title or author, explore categories, view book information, save books to a wishlist, manage a shopping cart, place real orders, and track user account history.

The application has advanced from a static prototype into a **full-stack bookstore** with:
- A responsive client-side storefront.
- Real Google Books API metadata discovery.
- A zero-dependency Node.js backend server backed by native SQLite.
- User authentication, JWT sessions, order creation, and order history tracking.

---

## 2. Project snapshot & status

| Area | Current status | Notes |
|---|---|---|
| Vite + React project | ✅ Done | React 19, Vite 8, React Compiler configured. |
| React Router v7 | ✅ Done | Full client-side routing mounted in `AppRoutes.jsx` with `ScrollToTop` restoration. |
| Axios + API Service | ✅ Done | `src/services/api.js` (Google Books) + `src/services/backendApi.js` (BookHub Backend). |
| Canonical Book Model | ✅ Done | `src/services/BookMapper.js` centralizes Google Books API data normalisation. |
| Shared Layout & App Shell | ✅ Done | `Navbar` (dynamic user avatar pill, badges, active links), `MainLayout`, 4-column `Footer`. |
| Home Page | ✅ Done | Modular `Hero` CTA component, category quick links, and API-backed featured discovery. |
| Reusable UI Components | ✅ Done | `BookCard`, `Hero`, `SearchBar`, `LoadingState`, `ErrorState`, `EmptyState`, `ScrollToTop`. |
| Books Catalogue Page | ✅ Done | Live search, category pills, sorting (`Relevance` / `Newest`), language filter, URL parameter sync, pagination. |
| Book Details Page | ✅ Done | Dynamic `/books/:id` route, rich metadata view, external Google Books link, add to cart & wishlist. |
| Category Discovery | ✅ Done | Category landing at `/categories` and subject results at `/categories/:name`. |
| Cart & Wishlist State | ✅ Done | `CartContext` & `WishlistContext` with localStorage persistence and Navbar counts. |
| Checkout & Orders | ✅ Done | `/checkout` creates real orders in SQLite database; `/orders` displays order history and status. |
| Authentication & Accounts | ✅ Done | Full-stack auth (`/login`, `/register`, `/profile`) with PBKDF2 hashing, JWT tokens, and guest fallback. |
| Backend Server & SQLite DB | ✅ Done | Zero-dependency Node.js HTTP server at `server/` with `node:sqlite` database (`bookhub.db`). |
| Contact & Support | ✅ Done | `/contact` page with inquiry form validation and interactive FAQs. |
| 404 Fallback | ✅ Done | `NotFound` page with navigation back to Home or Catalogue. |
| Static Deploy Ready | ✅ Done | Configured for Netlify (`public/_redirects`), Vercel (`vercel.json`), and `.env.example`. |
| Lint & Build Quality | ✅ Done | `npm run lint` (0 errors, 0 warnings) and `npm run build` passing cleanly. |

---

## 3. Technology stack

| Layer | Tool / Library | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + React Compiler | Component hierarchy, state, declarative rendering |
| **Tooling & Build** | Vite 8 | Development server with HMR, fast Rollup bundle output |
| **Routing** | React Router v7 | Dynamic client-side routing, route parameters, scroll reset |
| **HTTP Client** | Axios | Google Books API & BookHub Backend REST client |
| **Backend Runtime** | Node.js 24 (`node:http`) | High-performance, zero-dependency native REST API server |
| **Database** | SQLite 3 via `node:sqlite` | Embedded relational database (`server/bookhub.db`) |
| **Security & Auth** | `node:crypto` | PBKDF2 password hashing (100k rounds) & HMAC SHA-256 JWT tokens |
| **State Management** | React Context API | `AuthContext`, `CartContext`, `WishlistContext` |
| **Styling** | Custom Property CSS | Design system tokens (`index.css`), responsive grids |
| **Code Quality** | ESLint 10 | Static analysis across frontend (`src/`) and backend (`server/`) |

---

## 4. Current project structure

```text
BookHub/
├── public/
│   ├── _redirects
│   ├── favicon.svg
│   └── icons.svg
├── server/
│   ├── auth.js              # Password hashing & JWT token verification
│   ├── db.js                # SQLite schema and DatabaseSync connection
│   └── index.js             # HTTP REST API server (port 5000)
├── src/
│   ├── assets/
│   ├── Components/
│   │   ├── BookCard/
│   │   ├── EmptyState/
│   │   ├── ErrorState/
│   │   ├── Footer/
│   │   ├── Hero/
│   │   ├── LoadingState/
│   │   ├── navbar/
│   │   ├── ScrollToTop/
│   │   └── SearchBar/
│   ├── context/
│   │   ├── AuthContext.jsx      # User authentication & token state
│   │   ├── CartContext.jsx      # Shopping cart reducer & provider
│   │   └── WishlistContext.jsx  # Wishlist state & provider
│   ├── layouts/
│   │   └── MainLayout.jsx
│   ├── pages/
│   │   ├── BookDetails/
│   │   ├── Books/
│   │   ├── Cart/
│   │   ├── Categories/
│   │   ├── Checkout/
│   │   ├── Contact/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── NotFound/
│   │   ├── Orders/          # Real order tracking & history
│   │   ├── Profile/         # User profile, statistics & account settings
│   │   └── Register/
│   ├── routes/
│   │   └── AppRoutes.jsx    # Master route registry
│   ├── services/
│   │   ├── api.js           # Google Books Axios client
│   │   ├── backendApi.js    # BookHub Server REST client
│   │   └── BookMapper.js    # Data normalizer / adapter
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── DEVELOPMENT_ROADMAP.md
├── eslint.config.js
├── package.json
├── README.md
├── vercel.json
└── vite.config.js
```

---

## 5. Route plan

| Route | Page Component | Purpose | Status |
|---|---|---|---|
| `/` | `Home` | Landing page, category shortcuts, featured API books | ✅ Active |
| `/books` | `Books` | Searchable catalogue with filters, sorting, query params & pagination | ✅ Active |
| `/books/:id` | `BookDetails` | Dynamic book information, preview links, metadata, cart/wishlist | ✅ Active |
| `/categories` | `Categories` | Curated category landing with descriptions & icons | ✅ Active |
| `/categories/:name` | `CategoryBooks` | Paginated catalogue filtered by category / Google Books subject | ✅ Active |
| `/cart` | `Cart` | Interactive cart with quantity adjustment, item removal & summary | ✅ Active |
| `/wishlist` | `Wishlist` | Saved books list with quick add-all-to-cart & remove options | ✅ Active |
| `/checkout` | `Checkout` | Order placement connected to SQLite database | ✅ Active |
| `/login` | `Login` | Sign in interface connected to backend JWT authentication | ✅ Active |
| `/register` | `Register` | User registration with password hashing in SQLite | ✅ Active |
| `/profile` | `Profile` | User account details, reading statistics & quick sign out | ✅ Active |
| `/orders` | `Orders` | Real order history and shipping tracking | ✅ Active |
| `/contact` | `Contact` | Contact & support form with interactive FAQs | ✅ Active |
| `*` | `NotFound` | Graceful 404 handler for unmatched routes | ✅ Active |

---

## 6. Progress tracker & roadmap checklist

### Foundation & Storefront UI (Phases 1–2)
- [x] Create Vite React project with React 19 and React Compiler.
- [x] Configure React Router v7 and Axios.
- [x] Establish global CSS design system with variables, typography, and responsive grid tokens.
- [x] Build `MainLayout` with sticky Navbar, routed Outlet, and 4-column Footer.
- [x] Create responsive `Navbar` with `NavLink` active indicators, cart/wishlist badges, and user profile avatar.
- [x] Build modular `Hero` component with customizable CTAs and radial background gradient.
- [x] Create reusable `BookCard` with cover fallback, wishlist toggle, and cart add button.
- [x] Create shared UI feedback states: `LoadingState`, `ErrorState`, and `EmptyState`.
- [x] Create accessible `SearchBar` with submit on Enter and clear button.
- [x] Add automatic `ScrollToTop` restoration on client-side route transitions.

### API & Consistent Data Mapping (Phase 3)
- [x] Centralize Google Books API calls in `src/services/api.js` (`getBooks`, `getBookById`, `getBooksBySubject`).
- [x] Implement `src/services/BookMapper.js` to normalize API volume models into a clean BookHub shape.
- [x] Add parameters for `startIndex`, `maxResults`, `orderBy`, and `langRestrict` to support pagination & filtering.
- [x] Gracefully handle missing metadata (covers, descriptions, ISBN, ratings, publishers).

### Book Details & Discovery (Phases 4–5)
- [x] Implement `/books/:id` route loading volume details by ID.
- [x] Display book cover, titles, author list, categories, publication info, description, ISBN, and external preview links.
- [x] Add breadcrumb and back navigation.
- [x] Wire Add to Cart and Save to Wishlist directly from Book Details.
- [x] Implement catalogue search by title, author, or subject with URL parameter persistence (`?q=...&page=...`).
- [x] Implement quick category pill filters (Fiction, Science, History, Business, Technology, Philosophy, Art).
- [x] Implement sorting options (`Relevance`, `Newest First`) and language filter (`All Languages`, `English Only`).
- [x] Implement pagination controls with Next/Previous navigation and result bounds.
- [x] Implement Category landing page (`/categories`) and category subject route (`/categories/:name`).

### Cart, Wishlist & Store State (Phases 6–7)
- [x] Implement `CartContext` with `addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, and `clearCart`.
- [x] Implement `WishlistContext` with `addToWishlist`, `removeFromWishlist`, `isInWishlist`, and `clearWishlist`.
- [x] Add `localStorage` persistence with safe parsing for cart and wishlist items.
- [x] Wrap application root with `CartProvider` and `WishlistProvider`.
- [x] Replace static homepage book cards with live API-backed featured books.

### Backend, Authentication & Orders (Phases 8–9)
- [x] Build Node.js native backend server (`server/index.js`) using `node:http`.
- [x] Implement SQLite database (`server/db.js`) using Node's native `DatabaseSync`.
- [x] Implement password hashing with PBKDF2 (100,000 iterations) and HMAC SHA-256 JWT tokens (`server/auth.js`).
- [x] Build `src/services/backendApi.js` connecting React to the backend REST API with Bearer token injection.
- [x] Build `AuthContext.jsx` managing user registration, login, JWT token persistence, and guest fallback.
- [x] Build `/login` and `/register` pages hooked into backend authentication.
- [x] Build `/profile` page displaying user credentials, account stats, and sign out control.
- [x] Build `/checkout` flow persisting real orders directly into the SQLite database.
- [x] Build `/orders` page displaying user's order history, items ordered, and delivery addresses.
- [x] Implement `/contact` page with inquiry form validation and interactive FAQs.

### Quality Assurance & Release Readiness (Phase 10)
- [x] ESLint checks clean across frontend and backend (`npm run lint` passes with 0 errors and 0 warnings).
- [x] Production build clean (`npm run build` passes).
- [x] Configure SPA hosting redirect fallbacks for Netlify (`public/_redirects`) and Vercel (`vercel.json`).
- [x] Provide `.env.example` template for configuration.
- [x] Provide full documentation in `README.md`.
