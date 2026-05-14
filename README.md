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
    └── Cart.test.jsx
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
