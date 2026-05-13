import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone bg-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <p className="text-lg font-semibold">Atelier Mode</p>
          <p className="mt-4 text-sm text-ink/70">
            Botanical luxury fashion with AI styling intelligence.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/60">
            Explore
          </p>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/shop">Shop</Link>
            <Link href="/tryon">AI Try-On</Link>
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
            Weekly edit of botanical luxury, AI styling tips, and studio drops.
          </p>
        </div>
      </div>
    </footer>
  );
}
