# Atelier Mode — Complete Project Reference

> Premium botanical fashion e-commerce built with **Next.js 16.2.6**, **React 19.2.4**, **Tailwind CSS v4**, **Framer Motion 12**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 |
| UI Library | React 19.2.4 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12.38 |
| Icons | Lucide React 1.14 |
| Fonts | Playfair Display (headings), Source Sans 3 (body) |
| State | React Context (no Redux/Zustand) |
| Storage | localStorage (all data simulated client-side) |

---

## Color System (Tailwind v4 Theme)

Defined in `src/app/globals.css` as CSS custom properties, used as Tailwind classes:

| Variable | Tailwind Class | Hex | Usage |
|----------|---------------|-----|-------|
| `--canvas` | `bg-canvas` | `#f9f8f4` | Page background |
| `--ink` | `bg-ink` / `text-ink` | `#2d3a31` | Primary text, primary button bg |
| `--sage` | `bg-sage` / `text-sage` | `#8c9a84` | Secondary border, accent |
| `--clay` | `bg-clay` | `#dccfc2` | Card backgrounds, badges |
| `--stone` | `border-stone` / `bg-stone` | `#e6e2da` | Borders, dividers |
| `--terracotta` | `bg-terracotta` / `text-terracotta` | `#c27b66` | Primary accent, active states, hover |

All elements have `border-color: var(--stone)` by default.

Typography: headings use `Playfair Display` (serif), body uses `Source Sans 3` (sans-serif).

---

## Architecture

### Routes (12 pages)

| Route | File | Type | Auth Required? | Description |
|-------|------|------|---------------|-------------|
| `/` | `src/app/page.tsx` | Static | No | Homepage — hero, stats, featured/trending products, reviews |
| `/shop` | `src/app/shop/page.tsx` | Static | No | Product listing with search, filters, AI recommendations |
| `/shop/[slug]` | `src/app/shop/[slug]/page.tsx` | Dynamic | No | Product detail — image, sizes, add-to-cart, wishlist |
| `/products` | `src/app/products/page.tsx` | Static | No | Alternative product grid with filters only |
| `/cart` | `src/app/cart/page.tsx` | Static | No | Cart management — qty, remove, checkout link |
| `/checkout` | `src/app/checkout/page.tsx` | Static | Yes | Checkout form — name, email, address, order summary |
| `/login` | `src/app/login/page.tsx` | Static | No | Login form with redirect support |
| `/signup` | `src/app/signup/page.tsx` | Static | No | Registration form, redirects to `/preferences` |
| `/preferences` | `src/app/preferences/page.tsx` | Static | Yes | 5-step style quiz wizard |
| `/profile` | `src/app/profile/page.tsx` | Static | Yes | Profile edit, order history, saved preferences |
| `/wishlist` | `src/app/wishlist/page.tsx` | Static | No | Saved items management |
| `/_not-found` | `src/app/not-found.tsx` | Static | No | Custom 404 page |

### API Routes

| Route | Type | Description |
|-------|------|-------------|
| `POST /api/suggest` | Dynamic | AI-powered product suggestions (OpenRouter/DeepSeek) with heuristic fallback. Accepts `preferences` + optional `context` ("shop" or "cart") |
| `POST /api/suggest-preferences` | Dynamic | AI-powered quiz auto-fill — given partial `UserPreferences`, suggests missing fields via DeepSeek |

---

## AI Integration

### API Key
Stored in `.env.local` as `OPENROUTER_API_KEY`. Provider: **OpenRouter**, model: `deepseek/deepseek-v4-flash:free`. All AI calls are **server-side only** (API routes) — key never exposed to client.

### AI Utility (`src/lib/ai.ts`)
- `askAI({ system, messages, json? })` — sends chat completion to OpenRouter, optionally enforces JSON response format
- `parseJSON<T>(raw)` — cleans markdown-wrapped JSON from AI responses

### AI Suggest (`/api/suggest`)
1. Sends user preferences + product catalog to DeepSeek with prompt asking for top 5 matching product IDs
2. If AI call fails, falls back to **heuristic scoring** (color +1.5, size +3, category +2, budget +2, featured/trending bonus)
3. Accepts `context` param: `"cart"` returns complementary/complete-the-look items; `"shop"` returns style-matched items

### AI Suggest Preferences (`/api/suggest-preferences`)
- Given partial `UserPreferences`, asks DeepSeek to fill in missing fields from allowed option sets
- Returns coherent style suggestions (e.g., if user picked "Sage" colors, suggests "Relaxed" fit)

---

## Data Models

### Product (`src/data/products.ts`)

```typescript
type Product = {
  id: string;           // slug: "solace-trench"
  name: string;         // "Solace Trench"
  price: number;        // 420
  category: string;     // "Outerwear" | "Knitwear" | "Dresses" | "Sets" | "Pants" | "Tops"
  rating: number;       // 0-5 decimal
  image: string;        // "/images/products/solace-trench.jpg"
  gallery: string[];    // 3 image paths
  colors: string[];     // ["Sage", "Clay", "Stone"]
  sizes: string[];      // ["XS", "S", "M", "L"]
  description: string;  // Long description
  fabric: string;       // "Recycled twill blend, matte finish"
  featured?: boolean;   // Shown on homepage featured section
  trending?: boolean;   // Shown on homepage trending section
}
```

14 products total. Exports: `products`, `featuredProducts`, `trendingProducts`, `categories`.

### Review (`src/data/reviews.ts`)

```typescript
type Review = {
  id: string;       // "r1"
  name: string;     // Reviewer name
  quote: string;    // Testimonial
  rating: number;   // 4.8 | 5
}
```

### User & Auth (`src/lib/auth-context.tsx`)

```typescript
interface UserPreferences {
  colorPalette?: string[];   // ["Sage", "Terracotta", "Ink"]
  size?: string;             // "M" | "L" etc.
  fitPreference?: string;    // "relaxed" | "tailored" | "oversized" | "fitted" | "flowy"
  occasion?: string;         // "casual" | "business" | "formal" | "party" | "athletic" | "everyday"
  budget?: string;           // "budget" | "moderate" | "premium" | "luxury"
}

interface User {
  id: string;
  email: string;
  name: string;
  preferences?: UserPreferences;
  address?: string;
  pincode?: string;
  orders?: Order[];
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
}
```

### Cart & Wishlist (`src/lib/cart-utils.ts`)

```typescript
interface CartItem {
  productId: string;
  quantity: number;
}
```

Uses localStorage keys: `atelier_cart`, `atelier_wishlist`. All operations are pure functions.

---

## Context Providers (wrapping order in `layout.tsx`)

1. **AuthProvider** (`AuthContext`) — User state, login/signup/logout, preferences/profile/order management. Persists to `localStorage("user")`.
2. **CartProvider** (`CartContext`) — Cart and wishlist state with CRUD operations. Backed by `cart-utils.ts` localStorage helpers.
3. **ToastProvider** (`ToastContext`) — Toast notification system. Auto-dismisses after 3 seconds.

---

## Component Inventory

### Site Components (`src/components/site/`)

| Component | File | Description |
|-----------|------|-------------|
| **Navbar** | `navbar.tsx` | Sticky top nav with logo, nav links, wishlist/cart badges (animated count), user profile link / login button, mobile hamburger with AnimatePresence |
| **Hero** | `hero.tsx` | Animated landing hero with Framer Motion, CTA buttons, editorial image with clay/sage blur blobs |
| **Footer** | `footer.tsx` | 4-column footer: branding, Explore links, Studio links, newsletter |
| **ProductCard** | `product-card.tsx` | Product card with image hover zoom, trending/featured badges, wishlist heart toggle, rating pill, add-to-cart with "Added ✓" animation (2s), Framer Motion hover lift |
| **Filters** | `filters.tsx` | Dropdown panel: price range (dual-thumb slider + number inputs), colors (collapsible), sizes, fabrics, styles — all extracted dynamically from product data |
| **SectionHeading** | `section-heading.tsx` | Reusable section header: eyebrow badge + title + optional description |
| **Stats** | `stats.tsx` | Homepage metrics bar: 1.2k+ styles, 5k+ clients, 50+ fabrics, 98% satisfaction |
| **ReviewGrid** | `review-grid.tsx` | 3-column testimonial grid |
| **CtaBanner** | `cta-banner.tsx` | Call-to-action banner with gradient overlay, dark background, "Shop Now" button |
| **Skeletons** | `skeletons.tsx` | Loading skeleton grid (3 pulse-animated cards) |
| **ScrollToTop** | `scroll-to-top.tsx` | Scrolls to top on route change (renders null) |
| **ClickTracer** | `click-tracer.tsx` | Placeholder analytics hookup (renders null) |

### UI Components (`src/components/ui/`)

| Component | File | Description |
|-----------|------|-------------|
| **Button** | `button.tsx` | 3 variants (`primary`=ink bg, `secondary`=sage border, `ghost`=text-only), 3 sizes (`sm`/`md`/`lg`), CVA + Radix Slot, `rounded-full`, uppercase tracking |
| **Badge** | `badge.tsx` | 2 variants (`default`=clay, `outline`=sage border) |
| **Card** | `card.tsx` | Card/Header/Content sub-components, `rounded-3xl`, stone border, soft shadow |
| **Input** | `input.tsx` | Styled text input, full rounded, stone border, sage focus ring, forwards ref |
| **ToastContainer** | `toast.tsx` | Fixed bottom-right toast stack, animated (Framer Motion), color-coded (`success`=sage, `error`=red, `info`=neutral), auto-dismiss 3s |

---

## Key Features & User Flows

### 1. Auth Flow (Simulated, localStorage-based)

- **Signup** → creates user with random ID, saves to localStorage, redirects to `/preferences`
- **Login** → creates user from email (password validated but not matched), saves to localStorage
- **Logout** → clears user from localStorage, redirects to `/`
- Auth state persists across page loads via `useEffect` hydration from localStorage
- `useAuth()` hook provides: `user`, `isLoading`, `login`, `signup`, `logout`, `updatePreferences`, `updateProfile`, `addOrder`

### 2. Style Preference Wizard (`/preferences`)

5-step animated flow (Framer Motion slide transitions + progress bar):

| Step | Key | Selection Type | Options |
|------|-----|---------------|---------|
| 1. Colors | `colorPalette` | Multi-select (toggle chips) | Sage, Clay, Stone, Ink, Terracotta, Black, Navy, Cream, Brown, Blush, Charcoal |
| 2. Size | `size` | Single-select | XXS–XXL |
| 3. Fit | `fitPreference` | Single-select | Relaxed, Tailored, Oversized, Fitted, Flowy |
| 4. Occasion | `occasion` | Single-select | Casual, Business, Formal, Party, Athletic, Everyday |
| 5. Budget | `budget` | Single-select | Budget ($200), Moderate ($200-350), Premium ($350-500), Luxury ($500+) |

Each step has a **Skip** button. Progress bar fills with `bg-terracotta` animated width. Saves to `user.preferences` via `updatePreferences()`, redirects to `/`.

**AI Suggest for me** button at top of quiz — calls `/api/suggest-preferences` with current partial selections and auto-fills remaining steps with AI-recommended values (e.g., picks colors → suggests matching fit and occasion).

### 3. AI Suggest-to-Cart (`/shop` + `/api/suggest`)

**Frontend**: "AI Suggest" button (Sparkles icon) appears on `/shop` when user has saved preferences. Calls `POST /api/suggest` with `{ preferences }`. On response, auto-adds all returned products to cart and shows toast: "AI added X items matching your style".

**API** (`src/app/api/suggest/route.ts`): Heuristic scoring algorithm:

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Color match | +1.5 per color | Match against `colorPalette` |
| Size match | +3 | If product available in user's size |
| Category match | +2 | If product category matches `occasion` mapping |
| Budget match | +2 | If `price <= budgetThreshold`; penalty if over |
| Featured | +1 | If product is featured |
| Trending | +0.5 | If product is trending |

Returns top 5 products with `score > 0`, sorted descending by score (ties broken by lower price).

**Occasion → Category mapping**: casual=Tops/Pants/Knitwear, business=Sets/Tops, formal=Dresses/Sets, party=Dresses, athletic=Pants, everyday=all

### 4. Preference-Based Recommendations (`/shop`)

When user has preferences, `/shop` fetches suggestions on page load and shows a **"Recommended for you"** section (Sparkles icon + AI badge) above the main grid — up to 3 products in a row.

### 5. Product Filtering (`/shop` + `/products`)

- **Text search**: searches name, description, fabric, category, and colors
- **Price range**: dual-thumb slider + number inputs (min/max derived from product data)
- **Colors**: collapsible toggle chip grid
- **Sizes**: toggle chip grid
- **Fabrics**: toggle chip grid
- **Style**: toggle chip grid (categories)

All filters are dynamically extracted from product data. Filters component is reusable across `/shop` and `/products`.

### 6. Cart Management

- Add to cart via ProductCard or product detail
- Quantity increment/decrement (min 1), remove item
- Grid/List view toggle
- Estimated total display
- "Proceed to Checkout" + "Clear" cart
- Cart badge count in navbar with animated number change
- **"Complete the look"** — AI-powered section at bottom of cart page shows up to 3 complementary products (fetched from `/api/suggest` with `context: "cart"`), excludes items already in cart

### 7. Checkout

- Redirects unauthenticated users to `/login?redirect=/checkout`
- Pre-fills name and email from user profile
- Form fields: Full name, Email, Shipping address, City, Postal code
- Order summary sidebar: item images, names, quantities, line totals
- Subtotal, $20 fixed shipping, total
- Coupon code input (placeholder, not functional)

### 8. Toast Notification System

- Auto-dismiss after 3 seconds
- 3 types: `success` (sage border), `error` (red), `info` (neutral)
- Fixed bottom-right position, animated entry/exit (Framer Motion)
- Close button per toast

---

## Page Layout Structure

```
RootLayout (src/app/layout.tsx)
├── <html> Playfair Display + Source Sans 3 fonts
│   ├── AuthProvider (user state)
│   │   ├── CartProvider (cart + wishlist)
│   │   │   ├── ToastProvider (toasts)
│   │   │   │   ├── ClickTracer (null)
│   │   │   │   ├── ScrollToTop (null)
│   │   │   │   ├── .grain-overlay (fixed SVG noise texture, z-1)
│   │   │   │   ├── Navbar (sticky top, z-40)
│   │   │   │   ├── <main> (max-w-7xl, px-6, pb-24, pt-12)
│   │   │   │   ├── Footer
│   │   │   │   └── ToastContainer (fixed bottom-right, z-60)
```

---

## AI Suggest API — Full Spec

**Endpoint**: `POST /api/suggest`

**Request**:
```json
{
  "preferences": {
    "colorPalette": ["Sage", "Terracotta"],
    "size": "M",
    "budget": "moderate",
    "occasion": "casual"
  }
}
```

**Response**:
```json
{
  "suggestions": [
    {
      "id": "moss-utility",
      "name": "Moss Utility",
      "price": 240,
      "category": "Pants",
      "rating": 4.5,
      "image": "/images/products/moss-utility.jpg",
      "colors": ["Sage", "Clay"],
      "sizes": ["XS", "S", "M", "L"],
      "fabric": "Organic cotton twill",
      "description": "Soft utility pant with an elevated drape..."
    }
  ]
}
```

**Error response**: `{ "error": "Failed to compute suggestions" }` with status 500.

---

## Design Patterns & Conventions

- **All state via React Context** — no global state library
- **localStorage for persistence** — all data is client-side, no backend
- **Simulated auth** — no real password verification, passwords validated but not matched
- **Framer Motion for animations** — AnimatePresence for mount/unmount, motion.div for hovers/transitions
- **Tailwind CSS v4** with custom colors — uses CSS custom properties in `globals.css`
- **`cn()` utility** — combines `clsx` + `tailwind-merge` for conditional classes
- **`rounded-3xl` as standard** — cards, containers, modals
- **`rounded-full` for buttons** — all buttons are pill-shaped
- **`uppercase tracking-[0.2em]` for buttons and eyebrow text** — design signature
- **Border `stone` as default divider** — applied globally via `* { border-color: var(--stone); }`
- **Product images** are all placeholder paths under `/images/products/`
- **React 19 + Next.js 16** — `useRef` requires initial value passed to constructor
- **ESLint** — 7 pre-existing `react-hooks/set-state-in-effect` warnings (hydration patterns, acceptable)

---

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

---

## File Tree (Key Files)

```
src/
├── app/
│   ├── api/suggest/route.ts        # AI suggestion endpoint
│   ├── cart/page.tsx                # Cart management
│   ├── checkout/page.tsx            # Checkout form
│   ├── login/page.tsx               # Login
│   ├── signup/page.tsx              # Registration
│   ├── preferences/page.tsx         # 5-step style quiz
│   ├── profile/page.tsx             # Profile + preferences
│   ├── shop/page.tsx                # Shop + AI recommendations
│   ├── shop/[slug]/page.tsx         # Product detail
│   ├── products/page.tsx            # Product grid (alt)
│   ├── wishlist/page.tsx            # Wishlist
│   ├── page.tsx                     # Homepage
│   ├── not-found.tsx                # 404
│   ├── layout.tsx                   # Root layout (providers wrapping)
│   └── globals.css                  # Tailwind v4 + theme variables
├── components/
│   ├── site/
│   │   ├── navbar.tsx               # Sticky navigation
│   │   ├── hero.tsx                 # Homepage hero
│   │   ├── footer.tsx               # Site footer
│   │   ├── product-card.tsx         # Product card
│   │   ├── filters.tsx              # Filter panel
│   │   ├── section-heading.tsx      # Section header
│   │   ├── stats.tsx                # Metrics bar
│   │   ├── review-grid.tsx          # Reviews
│   │   ├── cta-banner.tsx           # CTA banner
│   │   ├── skeletons.tsx            # Loading skeletons
│   │   ├── scroll-to-top.tsx        # Route change scroll
│   │   └── click-tracer.tsx         # Analytics placeholder
│   └── ui/
│       ├── button.tsx               # Pill buttons (3 variants)
│       ├── badge.tsx                # Inline badges
│       ├── card.tsx                 # Card containers
│       ├── input.tsx                # Text inputs
│       └── toast.tsx                # Toast notifications
├── data/
│   ├── products.ts                  # 14 products + Product type
│   └── reviews.ts                   # 3 reviews
└── lib/
    ├── auth-context.tsx             # Auth + preferences
    ├── cart-context.tsx             # Cart + wishlist state
    ├── cart-utils.ts                # Cart/wishlist localStorage ops
    ├── toast-context.tsx            # Toast state management
    └── utils.ts                     # cn() helper
```
