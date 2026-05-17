import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone bg-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <p className="text-lg font-semibold">Atelier Mode</p>
          <p className="mt-4 text-sm text-ink/70">
            Botanical luxury fashion, curated for you.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/60">
            Explore
          </p>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/shop">Shop</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/checkout">Checkout</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/60">
            Studio
          </p>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/profile">Account</Link>
            <Link href="/cart">Cart</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/60">
            Newsletter
          </p>
          <p className="mt-4 text-sm text-ink/70">
            Weekly edit of botanical luxury, style tips, and new drops.
          </p>
          <div className="mt-4 flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="min-w-0 flex-1 rounded-full border border-stone bg-white/60 px-4 py-2 text-sm placeholder:text-ink/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C9A84]"
            />
            <button
              type="button"
              className="rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#1f2622]"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
