# BookHub Development Roadmap

## Project overview

BookHub is a responsive online bookstore built with React, Vite, and JavaScript. It is being developed incrementally: establish the application shell, build the browsing experience, connect real book data, then add shopping features. The app uses React Router for navigation, Axios for API requests, and React Context as the planned shared state approach.

The goal is to make it easy to discover books, search and browse by category, inspect book details, save books, and manage a cart. Checkout and real customer accounts depend on services that are outside a frontend-only prototype.

## Current project snapshot

| Area | Current state |
| --- | --- |
| Foundation | React/Vite app, React Compiler, BrowserRouter, and a shared `MainLayout` with navbar and footer are in place. |
| Home page | A hero and featured-book section are present. Featured books are currently hardcoded sample data. |
| Book catalogue | The Books page requests results from Google Books and renders reusable `BookCard` components. |
| API service | `src/services/api.js` uses Axios with the Google Books API. It currently provides `getBooks(query)` and `getBookById(id)`. |
| Navigation | Home and Books are mounted in the router. The navbar also links to Categories, Cart, and Wishlist, which still need corresponding routed experiences. |
| Remaining pages | Book details, categories, cart, wishlist, and authentication pages are placeholders or not yet connected to routes. |
| Shopping state | Cart and wishlist behavior, persistence, checkout, and order handling remain to be implemented. |

This snapshot distinguishes what exists in the code from the features planned below; it is not a claim that the full bookstore flow is complete.

## Development workflow

For each phase:

1. Confirm the phase's scope and acceptance checks.
2. Implement in the existing component, page, route, or service structure where practical.
3. Keep data fetching in the service layer and reusable presentation in shared components.
4. Verify loading, error, empty, and success states for data-driven experiences.
5. Run the relevant lint/build checks and manually walk through the affected user flow.
6. Update this roadmap when a phase is completed or the scope changes.

## Phased plan

### Phase 1 — Foundation and application shell

**Status: In progress**

**Workflow**
- Keep the Vite/React entry point and React Router setup as the base of the app.
- Use `MainLayout` for shared navigation, page content, and footer.
- Establish responsive global styles and reusable visual conventions.
- Keep pages, shared components, services, and context separated by responsibility.

**Acceptance checks**
- The app starts and builds successfully.
- Shared layout renders consistently around routed pages.
- Navigation uses client-side routes and remains usable on mobile.

### Phase 2 — Core storefront UI

**Status: Initial work exists**

**Workflow**
- Complete the homepage sections: hero, featured books, popular categories, best sellers, new releases, and footer.
- Refine reusable book cards to show a cover, title, author, rating when available, price when available, and clear actions.
- Ensure layouts adapt to narrow screens and provide sensible fallbacks for missing book metadata.
- Use sample data only as a temporary UI scaffold; avoid presenting it as live catalogue data.

**Acceptance checks**
- Home and catalogue layouts are responsive and visually consistent.
- Missing covers and optional fields do not break the page.
- Actions and navigation links lead to working flows or are clearly disabled until implemented.

### Phase 3 — API-backed catalogue and discovery

**Status: Catalogue request is connected; discovery features remain**

**Workflow**
- Extend `src/services/api.js` as the single place for Google Books requests, including search and category query helpers as needed.
- Map API volume data into a consistent shape for cards and details rather than repeating mapping logic in pages.
- Replace hardcoded home data with API-backed featured/search results when appropriate.
- Add search submission, category filtering, and predictable pagination or result limits.
- Handle loading, empty results, network/API errors, and missing fields explicitly.
- Keep the API's data limitations visible: Google Books does not guarantee retailer pricing, stock, or all ratings. Treat any display price as clearly identified sample/demo pricing until a trusted commerce data source is connected.

**Acceptance checks**
- Users can search for a title, author, or subject and see matching API results.
- Search/filter changes show the correct result set and can be shared or revisited where practical.
- The catalogue shows loading, no-results, and error states rather than a blank area.
- A failed API request is not silently represented as a successful empty catalogue.

### Phase 4 — Routes, categories, and book details

**Status: Not complete**

**Workflow**
- Mount and verify the planned routes:
  - `/` — Home
  - `/books` — Catalogue
  - `/books/:id` — Book details
  - `/categories` and `/categories/:name` — Category browsing
  - `/cart` — Cart
  - `/wishlist` — Wishlist
  - `/login` and `/register` — Account UI (if included in this iteration)
  - `/*` — Not found
- Connect book cards to `/books/:id` and load that volume through `getBookById`.
- Show available description, authors, publisher, publication date, categories, and rating, with fallbacks for unavailable data.
- Use route-aware links and ensure browser back/forward navigation works.

**Acceptance checks**
- Every visible navigation link resolves to the intended page.
- Directly opening or refreshing a book-details URL loads the right book or a clear not-found/error state.
- Invalid routes render a useful not-found page.

### Phase 5 — Cart and wishlist

**Status: Not implemented**

**Workflow**
- Implement cart actions in `src/context/CartContext.jsx` and expose a small, consistent API to components.
- Support add/remove, quantity increase/decrease, subtotal/total calculation, and clearing the cart.
- Persist cart state in `localStorage` if persistence is desired, validating stored data before use.
- Implement wishlist add/remove behavior and persistence using the same product identity as the catalogue.
- Replace placeholder pages with useful empty and populated states, totals, and quantity controls.
- Keep cart/wishlist badges in the shared navigation synchronized with state.

**Acceptance checks**
- Adding the same book repeatedly follows a deliberate quantity rule and does not create inconsistent duplicate entries.
- Quantity changes, removal, empty-cart behavior, and totals are correct.
- Cart and wishlist survive refresh when persistence is enabled.
- The UI responds immediately and consistently across pages.

### Phase 6 — Checkout prototype

**Status: Not implemented**

**Workflow**
- Build a checkout form for customer/contact and address details, plus an order summary and payment-method selection UI.
- Validate required inputs and show useful field-level errors.
- Provide a clear order confirmation flow for a frontend demo.
- Do not collect or store real payment credentials. A production payment flow requires a trusted payment provider and a secure backend.

**Acceptance checks**
- Invalid details prevent submission and explain how to fix the form.
- A valid demo order displays a confirmation and a consistent order summary.
- Checkout does not imply that a real payment was processed.

### Phase 7 — Authentication and account features (optional)

**Status: Future scope**

**Workflow**
- Treat login, registration, profiles, and order history as future backend-dependent capabilities.
- Decide on an authentication provider and backend before implementing real accounts.
- Avoid storing passwords, payment information, or other sensitive account data in frontend storage.

**Acceptance checks**
- Authentication is backed by a real, secure service before being represented as production-ready.
- Protected account experiences handle signed-out, loading, and authorization states.

### Phase 8 — Quality, accessibility, and release readiness

**Status: Ongoing**

**Workflow**
- Test complete user journeys: browse → search/filter → details → cart/wishlist → checkout demo.
- Check keyboard navigation, semantic structure, focus visibility, color contrast, and image text alternatives.
- Test responsive behavior and common API failure scenarios.
- Run the repository's lint and production build scripts before release.
- Review metadata, page titles, deployment routing for deep links, and any API usage constraints.

**Acceptance checks**
- `npm run lint` and `npm run build` pass.
- Core flows work at desktop and mobile widths, including direct route loads.
- Errors and unavailable API data are communicated clearly and accessibly.

## Current implementation references

- API layer: `src/services/api.js`
- App entry and router setup: `src/main.jsx`, `src/App.jsx`, `src/routes/AppRoutes.jsx`
- Shared layout: `src/layouts/MainLayout.jsx`
- Current catalogue and home: `src/pages/Books/Books.jsx`, `src/pages/Home/Home.jsx`
- Shared book card: `src/Components/BookCard/BookCard.jsx`
- Planned shared cart state: `src/context/CartContext.jsx`

## Project objective

> **Online Book Store** is a responsive React-based e-commerce frontend for discovering, searching, and browsing books using external book data. It is designed to grow from a routed storefront into a complete shopping experience with book details, categories, wishlist and cart management, and a checkout prototype. The project demonstrates component-based architecture, API integration, asynchronous UI states, client-side routing, shared state, and responsive design. Real accounts, inventory, and payment processing require appropriate backend services.
