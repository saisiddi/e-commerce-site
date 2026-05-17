# Atelier Mode — AI Fashion Studio

Premium botanical luxury fashion ecommerce with AI-powered style recommendations. Built with Next.js 16, React 19, and Tailwind CSS v4.

## Highlights

- **Botanical Luxury Design** — Organic serif typography, soft edges, terracotta accent, grain texture overlay
- **AI-Powered Style Quiz** — 5-step preference wizard with "AI Suggest for me" auto-fill powered by DeepSeek
- **Smart Cart Recommendations** — "Complete the look" section suggests complementary items using AI
- **Shop with AI Suggest** — "AI Suggest" button adds style-matched products to cart based on saved preferences
- **Full Ecommerce Flow** — Cart, checkout, wishlist, profile with localStorage persistence

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 (App Router) |
| UI Library | React 19.2.4 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| AI | DeepSeek via OpenRouter API |
| Fonts | Playfair Display, Source Sans 3 |

## Getting Started

```bash
npm run dev
```

Open http://localhost:3000

## Environment Variables

Create `.env.local` with your OpenRouter API key:

```
OPENROUTER_API_KEY=your-key-here
```

The AI features fall back to heuristic scoring if the API is not configured.

## Routes

| Path | Description |
|------|-------------|
| `/` | Homepage — hero, stats, featured/trending products, reviews |
| `/shop` | Product listing with search, filters, "AI Suggest" button, "Recommended for you" |
| `/shop/[slug]` | Product detail — image gallery, size selector, add to cart/wishlist |

| `/cart` | Cart with qty controls, "Complete the look" AI recommendations |
| `/checkout` | Checkout form (auth required) |
| `/login` | Login |
| `/signup` | Sign up → redirects to preferences |
| `/preferences` | 5-step style quiz with "AI Suggest for me" button |
| `/profile` | Profile, order history, saved preferences |
| `/wishlist` | Saved items |

## AI Features

### AI Suggest for Quiz (`/api/suggest-preferences`)
- Given partial preferences, DeepSeek suggests remaining fields (size, fit, occasion, budget)
- Accessible from preferences page via "AI Suggest for me" button

### AI Product Suggestions (`/api/suggest`)
- Ranks products against user preferences using DeepSeek
- Accepts `context: "shop"` (style-matched items) or `"cart"` (complementary items)
- Falls back to heuristic scoring if API fails

### Complete the Look
- On cart page, shows up to 3 AI-picked complementary products
- Excludes items already in cart
- Uses `/api/suggest` with `context: "cart"`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── suggest/           # AI product suggestions
│   │   └── suggest-preferences/ # AI quiz auto-fill
│   ├── cart/page.tsx          # Cart + AI recommendations
│   ├── checkout/page.tsx      # Checkout (auth required)
│   ├── login/page.tsx         # Login
│   ├── preferences/page.tsx   # 5-step style quiz
│   ├── profile/page.tsx       # Profile + preferences
│   ├── shop/page.tsx          # Shop + AI suggest
│   ├── signup/page.tsx        # Signup
│   └── wishlist/page.tsx      # Wishlist
├── components/
│   ├── site/                  # Navbar, Hero, ProductCard, Filters, etc.
│   └── ui/                    # Button, Badge, Input, Toast
├── data/
│   ├── products.ts            # 14 products
│   └── reviews.ts             # 3 reviews
└── lib/
    ├── ai.ts                  # OpenRouter/DeepSeek utility
    ├── auth-context.tsx       # Auth + preferences state
    ├── cart-context.tsx       # Cart + wishlist state
    ├── cart-utils.ts          # localStorage helpers
    ├── toast-context.tsx      # Toast notifications
    └── utils.ts               # cn() class merger
```

## Color System (Tailwind CSS v4)

| Color | Class | Hex |
|-------|-------|-----|
| Canvas | `bg-canvas` | `#f9f8f4` |
| Ink | `bg-ink` | `#2d3a31` |
| Sage | `bg-sage` | `#8c9a84` |
| Clay | `bg-clay` | `#dccfc2` |
| Stone | `border-stone` | `#e6e2da` |
| Terracotta | `bg-terracotta` | `#c27b66` |

## Build & Lint

```bash
npm run build   # Production build
npm run lint   # ESLint check
```

Build passes with 14 routes (2 dynamic API routes). Lint shows 7 pre-existing `react-hooks/set-state-in-effect` warnings (hydration patterns).

## Note

- All data (auth, cart, preferences) is stored in localStorage — no backend database
- The try-on AI feature was removed in a previous update
- Documentation for AI: see `ATELIER_MODE_DOCS.md`