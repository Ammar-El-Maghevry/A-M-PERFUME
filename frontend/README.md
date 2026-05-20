# A&M Perfume — Frontend (Next.js 14)

Boutique online perfume store, built for the Mauritanian market.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **TailwindCSS** + custom CSS variables from the design system
- **Zustand** for cart / wishlist (persisted to localStorage)
- 3 locales: **FR** (default), **AR** (RTL), **EN**
- Editorial typography: *Cormorant Garamond* + *Inter Tight* + *Tajawal/Amiri* (Arabic)

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open <http://localhost:3000>. The middleware redirects `/` to `/fr`.

## Routes

### Customer
- `/[locale]` — Home (hero, marquee, featured products, brand story, categories, limited edition, journal)
- `/[locale]/catalog` — Catalog with sidebar filters (category, family, price slider, in-stock) + sort
- `/[locale]/products/[slug]` — Product detail (gallery, fragrance pyramid, specs, add to cart, related)
- `/[locale]/cart` — Cart with sticky summary
- `/[locale]/checkout` — 4-step checkout (Delivery → Payment → Proof → Confirmation)
- `/[locale]/account` — Profile, orders, wishlist, addresses, notifications (tabs)

### Admin (`/[locale]/admin`)
Single-page admin app with sidebar navigation:
- Dashboard — stats cards, recent orders, low stock, 30-day sparkline
- Orders — status-filter tabs, order detail with payment-proof viewer + confirm/reject flow
- Products — sortable table with stock indicators
- Customers — list with spend stats
- Categories — visual cards
- Settings — site identity + payment numbers

## Notable design decisions

- **Sharp edges** — no border-radius on buttons or cards.
- **Underline-only inputs** — no full borders.
- **Marquee** — single-line scrolling announcements.
- **BottleSVG placeholder** — every product card renders a tonal background + bottle silhouette, so the catalog works without external image assets.
- **Nouakchott map** — stylized SVG map; clicking drops a pin and saves lat/lng (no Google Maps API key required to develop). Swap `NouakchottMap` for a real `@vis.gl/react-google-maps` integration when ready.
- **Payment proof mock** — admin order detail renders a stylized "phone screenshot" of the transaction; replace with real uploaded image once the backend is wired.

## Folder layout

```
src/
├── app/
│   ├── layout.tsx                       # Pass-through root layout
│   ├── not-found.tsx                    # 404
│   └── [locale]/
│       ├── layout.tsx                   # <html>, <body>, fonts, RTL dir
│       ├── page.tsx                     # Home
│       ├── catalog/                     # Catalog + filter view
│       ├── products/[slug]/             # Product detail
│       ├── cart/                        # Cart
│       ├── checkout/                    # 4-step checkout
│       ├── account/                     # Account tabs
│       └── admin/                       # Admin single-page app
├── components/
│   ├── layout/     Navbar, Footer, Marquee
│   └── ui/         Logo, BottleSVG, ProductImage, ProductCard, StatusBadge, SectionHeader
├── lib/
│   ├── data.ts     Products, categories, demo orders, hue maps
│   ├── dict.ts     FR / AR / EN dictionaries
│   ├── i18n.ts     Locale type + helpers
│   └── utils.ts
├── store/          cartStore, wishlistStore (Zustand + persist)
├── styles/
│   └── globals.css Design tokens + utility classes (.btn, .caption, .display, .wrap, …)
└── middleware.ts   Redirects `/` → `/{defaultLocale}`
```

## Next steps (Phases 2+)

- Wire `lib/api.ts` (Axios) to the Spring Boot backend
- Add JWT auth + protected routes (account / admin)
- Replace the stylized Nouakchott map with `@vis.gl/react-google-maps`
- Replace `DEMO_ORDERS` with API-fed orders + payment proof images
- Add `next-intl` if message interpolation / plural rules are needed beyond the flat dictionary
- Wire newsletter subscribe, notification bell, etc.
