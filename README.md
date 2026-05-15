# Zara Challenge — Mobile Phone Catalog

Web application for browsing, searching, and managing a mobile phone catalog with a shopping cart.

**Live demo:** https://zara-challenge-two.vercel.app/

---

## Features

### Required
- Phone catalog grid with real-time search (debounced 300 ms)
- Results limited to 20 phones
- Phone detail page with color and storage selectors
- Add to cart with selected color and storage
- Cart page with item list, total price, and remove actions
- Cart count in the navbar
- Cart persisted in `localStorage`

### Optional
- CSS custom properties (design tokens) for colors, spacing, typography, and borders
- Draggable horizontal slider for similar products, edge-to-edge on all viewports
- Skeleton loading screens for catalog and detail pages
- Toast notifications on cart add/remove
- Full accessibility: WCAG focus-visible states, `aria-label`, `aria-pressed`, `aria-live`, semantic table markup (`<th scope="row">`), dynamic page titles for screen readers
- Comprehensive test suite: 53 tests across all components and user flows
- Deployed to Vercel: https://zara-challenge-two.vercel.app/

## Getting Started

### Prerequisites

- Node 18+
- npm 9+

### Install dependencies

```bash
npm install
```

### Run in development mode

Assets are served unminified with HMR (Hot Module Replacement):

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

Assets are concatenated and minified:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Run tests

```bash
npm test
```

---

## Testing

**Stack:** Vitest + Testing Library + jsdom — 53 tests, 4 suites.

The API layer (`src/services/api.js`) uses `fetch` internally, so tests mock `globalThis.fetch` directly. This keeps tests decoupled from module resolution and verifies real component behaviour end-to-end.

### Navbar (9 tests)

- Home link renders with correct `aria-label`
- Cart link points to `/cart`
- Cart `aria-label` uses singular/plural correctly (`1 item` vs `2 items`)
- Count badge appears only when cart has items
- Toast notification renders when present in context

### Cart (14 tests)

- Empty state: message, title, no PAY button
- With items: brand/name/specs/price, image, total price, PAY button
- Continue Shopping renders as a `<Link>` to `/`
- Remove button has correct `aria-label`
- `removeFromCart` is called after the 350 ms animation delay
- All remove buttons are disabled while one is animating
- `CartProvider` persists cart to `localStorage` on add
- `CartProvider` hydrates from `localStorage` on mount

### PhoneList (11 tests)

- Page title set to `"Smartphones"` on mount
- Skeleton loaders shown while fetching
- Phone cards render with name, brand, and price after load
- Result count updates correctly (including 0 results)
- Each card exposes an accessible `<Link>` with `aria-label`
- Search input is accessible (`role="searchbox"`, `aria-label`)
- Typing in the search box triggers a new API call with the search term in the URL (debounced 300 ms)
- Error message shown when the API fails

### PhoneDetail (19 tests)

- Skeleton shown while fetching
- Phone name, base price, and page title rendered after load
- Selecting a storage option updates the displayed price
- Selecting a color option updates the main image
- Add to cart button disabled until both storage and color are selected
- `addToCart` called with the exact expected payload (id, name, brand, image, color, storage, price)
- Button shows `ADDED TO CART` immediately after click, reverts to `ADD TO CART` after 2 s
- Specifications table renders all rows with correct keys and values
- Similar items section renders accessible buttons for each product
- Back button is present
- Error message shown when the API fails

### Lint and format

```bash
npm run lint
npm run format
```

---

## Architecture

The project uses **React 19** with **Vite** as the build tool, **SCSS** for styles, and **React Context API** for global state management. Routing is handled by **React Router v7**.

### State management

A single `CartContext` (in `src/context/CartContext.jsx`) holds the cart state. It is initialized from `localStorage` on mount and persisted on every change, making the cart survive page reloads. The `useCart` hook (`src/hooks/useCart.js`) provides a clean interface to consume the context anywhere in the tree.

### API layer

All requests to the REST API go through `src/services/api.js`, which injects the required `x-api-key` header on every call. The base URL and key are defined there as constants.

### Routing

| Path | Component | Description |
|---|---|---|
| `/` | `PhoneList` | Phone catalog with real-time search |
| `/phone/:id` | `PhoneDetail` | Phone detail with color/storage selectors |
| `/cart` | `Cart` | Shopping cart |

---

## Project Structure

```
src/
├── assets/           Static assets (images, SVGs)
├── components/
│   └── Navbar/       Navigation bar (logo + cart icon with counter)
├── context/
│   └── CartContext   Global cart state, persisted in localStorage
├── hooks/
│   └── useCart       Shorthand hook for CartContext
├── pages/
│   ├── PhoneList/    Phone grid + search bar
│   ├── PhoneDetail/  Phone detail, selectors, similar products
│   └── Cart/         Cart items, total price, remove actions
├── services/
│   └── api.js        REST API calls with x-api-key authentication
├── styles/
│   └── global.scss   Global reset and typography
└── tests/
    ├── setup.js
    ├── Navbar.test.jsx
    ├── Cart.test.jsx
    ├── PhoneList.test.jsx
    └── PhoneDetail.test.jsx
```

---

## Tech Stack

- **Frontend:** React 19, SCSS
- **Build tool:** Vite 8 (dev unminified, production minified + concatenated)
- **Routing:** React Router v7
- **State:** React Context API
- **Testing:** Vitest + Testing Library
- **Linting:** ESLint (react, react-hooks, react-refresh plugins)
- **Formatting:** Prettier

## Font

```css
font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
```
