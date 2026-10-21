# client

React (Vite) frontend template for the **My Food** delivery app: olive green and cream, wide Syne headings, rounded cards, pill buttons.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Structure
- `src/styles/theme.css`: colors, font, radii. Edit tokens here to restyle everything.
- `src/styles/layout.css`, `components.css`: page layout and component styles.
- `src/components/`: Navbar, Hero, Categories, DishCard, FilterBar, Digest, Footer.
- `src/pages/`: Home, Menu (filters via `?category=`), Cart, NotFound.
- `src/context/CartContext.jsx`: cart state (add, decrease, remove, clear).
- `src/data/dishes.js`: sample data. Replace with API calls later.
- `public/images/`: put photos here and set `image: '/images/name.jpg'` on items.
