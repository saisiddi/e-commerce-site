# Atelier Mode - AI Fashion Studio

Premium AI-powered fashion ecommerce experience built for agency demos and client showcases. The UI follows a botanical luxury design system with organic serif typography, soft edges, and refined motion.

## Highlights

- Landing experience with editorial storytelling and cinematic hero.
- Shop and product detail flow with luxury cards and hover motion.
- AI try-on studio with upload, outfit selection, and before/after comparison.
- Cart, checkout, and profile UI built for premium ecommerce demos.
- Node.js API route stub for AI try-on integration.

## Recent UI Cleanup Notes

- Navigation trimmed to core flows only: Shop, AI Try-On, Checkout.
- Footer links reduced to essential account + cart paths.
- Added accessible labels to icon-only actions (wishlist) and `type="button"` on filter chips.
- If you see hydration warnings in dev, check for browser extensions (e.g., Grammarly) that inject attributes.

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn-style UI components

## Getting Started

```bash
npm run dev
```

Open http://localhost:3000.

## Project Structure

- src/app: App Router pages and API routes
- src/components: UI and site components
- src/data: Sample product and review data
- src/lib: Utilities

## Routes Map

- /: Landing page
- /shop: Product listing
- /shop/[slug]: Product detail
- /tryon: AI try-on studio
- /cart: Cart
- /checkout: Checkout UI
- /profile: Profile UI

## AI Try-On API

The try-on endpoint lives at `POST /api/tryon`. It currently returns a stubbed image URL and is ready to be wired to a provider such as Replicate or FAL.ai.
