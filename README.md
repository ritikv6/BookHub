# BookHub 📚

> A modern, responsive React-based online bookstore and book discovery application powered by the Google Books API.

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v7-ca4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-1.19-5a29e4?logo=axios&logoColor=white)](https://axios-http.com/)
[![ESLint](https://img.shields.io/badge/ESLint-Clean-4b32c3?logo=eslint&logoColor=white)](https://eslint.org/)

---

## 🌟 Key Features

- **Book Discovery & Catalogue (`/books`):**
  - Live search by title, author, or keywords.
  - Quick category filtering pills (Fiction, Science, History, Business, Technology, Philosophy, Art).
  - Sorting by **Relevance** or **Newest First**.
  - Language filtering (All Languages vs. English).
  - Clean pagination with Next/Previous navigation and bounds.
  - Full URL synchronization (`?q=...&category=...&sort=...&page=...`) so search results can be shared and refreshed.

- **Dynamic Book Details (`/books/:id`):**
  - High-resolution cover display with fallback for missing artwork.
  - Comprehensive metadata: authors, publisher, published date, page count, language, ISBN-10, ISBN-13, and category tags.
  - Direct preview links to Google Books.
  - Quick actions to Add to Cart and Save to Wishlist.

- **Genre Categories (`/categories` & `/categories/:name`):**
  - Category landing page with descriptions and icons.
  - Dynamic subject browsing mapped to Google Books subjects.

- **Persistent Shopping Cart (`/cart`) & Wishlist (`/wishlist`):**
  - Real-time shared state managed with React Context API.
  - Client-side persistence via `localStorage`.
  - Dynamic badge counters in the navigation header.
  - Quantity controls, removal, subtotal calculation, and "Add All to Cart".

- **Demo Checkout Flow (`/checkout`):**
  - Customer contact and shipping address form.
  - Client-side validation with field-level error messages.
  - Real-time cart summary and simulated order confirmation screen.

- **User Accounts Prototype (`/login` & `/register`):**
  - Accessible, responsive sign-in and registration interfaces.
  - Validation for email formats, minimum password length, and password matching.
  - Simulated session confirmation.

- **Contact & Support (`/contact`):**
  - Inquiries contact form with topic selection and validation.
  - Interactive frequently asked questions (FAQs).

- **Modern UX & Accessibility:**
  - Responsive layout (mobile 320px–420px, tablet 768px, desktop 1200px+).
  - Automatic scroll restoration (`ScrollToTop`) on route transitions.
  - Standardized UI feedback states: `LoadingState`, `ErrorState`, and `EmptyState`.
  - 404 fallback page (`NotFound`).

---

## 🛠️ Technology Stack

| Layer | Tool / Library |
|---|---|
| **Frontend Framework** | React 19 + React Compiler |
| **Tooling & Dev Server** | Vite 8 |
| **Routing** | React Router v7 |
| **HTTP Client** | Axios |
| **External API** | Google Books API |
| **State Management** | React Context API (`CartContext`, `WishlistContext`) |
| **Persistence** | Browser `localStorage` |
| **Styling** | Vanilla CSS with Design System Tokens (`index.css`) |
| **Code Quality** | ESLint 10 |

---

## 📁 Project Structure

```text
BookHub/
├── public/
│   ├── _redirects           # Netlify SPA fallback
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── Components/
│   │   ├── BookCard/        # Reusable book card with actions
│   │   ├── EmptyState/      # Zero-results feedback
│   │   ├── ErrorState/      # API failure & retry component
│   │   ├── Footer/          # 4-column site footer
│   │   ├── Hero/            # Modular homepage hero banner
│   │   ├── LoadingState/    # Spinner & accessible status
│   │   ├── navbar/          # Responsive navbar with counter badges
│   │   ├── ScrollToTop/     # Route transition scroll restoration
│   │   └── SearchBar/       # Accessible search input with clear
│   ├── context/
│   │   ├── CartContext.jsx      # Shopping cart reducer & provider
│   │   └── WishlistContext.jsx  # Wishlist state & provider
│   ├── layouts/
│   │   └── MainLayout.jsx   # Shared app shell (Navbar, Outlet, Footer)
│   ├── pages/
│   │   ├── BookDetails/     # /books/:id
│   │   ├── Books/           # /books (catalogue, search, filters)
│   │   ├── Cart/            # /cart
│   │   ├── Categories/      # /categories & /categories/:name
│   │   ├── Checkout/        # /checkout demo
│   │   ├── Contact/         # /contact support & FAQ
│   │   ├── Home/            # / landing page
│   │   ├── Login/           # /login
│   │   ├── NotFound/        # 404 handler
│   │   └── Register/        # /register
│   ├── routes/
│   │   └── AppRoutes.jsx    # Master route registry
│   ├── services/
│   │   ├── api.js           # Google Books Axios client
│   │   └── BookMapper.js    # Data normalizer / adapter
│   ├── App.jsx
│   ├── index.css            # Global CSS variables & tokens
│   └── main.jsx
├── .env.example
├── DEVELOPMENT_ROADMAP.md   # Project roadmap & progress tracker
├── eslint.config.js
├── package.json
├── vercel.json              # Vercel SPA rewrites
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

1. Clone or open the repository:
   ```bash
   cd BookHub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

### Available Scripts

- `npm run dev`: Launch Vite local development server with HMR.
- `npm run server`: Launch the BookHub Node.js backend server with SQLite on `http://localhost:5000`.
- `npm run build`: Compile and minify production bundle into `dist/`.
- `npm run lint`: Run ESLint checks across the frontend and backend.
- `npm run preview`: Locally preview the production build.

---

## 🌐 Deployment

BookHub is pre-configured for static single-page application (SPA) hosts:

- **Netlify:** Pre-configured with [`public/_redirects`](./public/_redirects).
- **Vercel:** Pre-configured with [`vercel.json`](./vercel.json).
- **GitHub Pages:** Set `base: "/<repo-name>/"` in `vite.config.js` and provide a 404.html redirect.

---

## 🔒 Scope Boundary & Google Books Disclaimer

Google Books API provides public book discovery and bibliographic metadata. It does not provide real-time retailer stock or sellable inventory for BookHub. Displayed purchase actions are frontend prototypes. Any real-world e-commerce transactions require an authorized server backend and payment gateway (e.g., Stripe, PayPal, Razorpay).
