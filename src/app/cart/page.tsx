"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/site/product-card";
import { products, type Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { SectionHeading } from "@/components/site/section-heading";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [aiSuggestions, setAiSuggestions] = useState<Product[]>([]);

  const items = cart.reduce<Array<{ item: (typeof cart)[number]; product: NonNullable<(typeof products)[number]> }>>((acc, it) => {
    const p = products.find((x) => x.id === it.productId);
    if (p) acc.push({ item: it, product: p });
    return acc;
  }, []);

  const total = items.reduce((sum, row) => sum + ((row.product?.price ?? 0) * row.item.quantity), 0);

  const cartProductIds = new Set(cart.map((it) => it.productId));

  const hasItems = items.length > 0;

  useEffect(() => {
    if (!hasItems) return;
    fetch("/api/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferences: user?.preferences ?? {},
        context: "cart",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const all = (data.suggestions ?? []) as Product[];
        setAiSuggestions(all.filter((p) => !cartProductIds.has(p.id)).slice(0, 3));
      })
      .catch(() => setAiSuggestions([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasItems]);

  return (
    <div className="flex flex-col gap-12">
      <Link href="/" className="text-ink/60 hover:text-ink transition">
        ← Back
      </Link>

      <SectionHeading 
        eyebrow="Shopping"
        title="Your Cart" 
        description="Review and manage your selected items"
      />

      {items.length === 0 ? (
        <div className="rounded-3xl border border-stone bg-white/70 p-12 text-center">
          <p className="text-ink/60 mb-4">Your cart is empty</p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm text-ink/60">
              {items.length} item{items.length !== 1 ? "s" : ""} in cart
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 text-sm rounded-full transition ${
                  viewMode === "grid"
                    ? "bg-ink text-white"
                    : "border border-stone text-ink/60 hover:border-terracotta"
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 text-sm rounded-full transition ${
                  viewMode === "list"
                    ? "bg-ink text-white"
                    : "border border-stone text-ink/60 hover:border-terracotta"
                }`}
              >
                List
              </button>
            </div>
          </div>

          <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}`}>
            {items.map(({ item, product }) => (
              <div
                key={item.productId}
                className={viewMode === "grid" 
                  ? "rounded-3xl border border-stone bg-white/70 overflow-hidden hover:shadow-lg transition"
                  : "flex items-center gap-4 rounded-3xl border border-stone bg-white/70 p-4"
                }
              >
                <Image
                  src={product?.image ?? "/placeholder.png"}
                  alt={product?.name ?? "product"}
                  width={120}
                  height={160}
                  className={viewMode === "grid"
                    ? "w-full h-48 object-cover"
                    : "h-24 w-20 rounded object-cover"
                  }
                />
                <div className={viewMode === "grid" ? "p-4" : "flex-1"}>
                  <p className="font-semibold">{product?.name}</p>
                  <p className="text-xs text-ink/60 uppercase tracking-wide mt-1">
                    {product?.category}
                  </p>
                  <p className="text-sm font-semibold mt-2">${product?.price}</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(
                          item.productId,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-stone text-sm hover:border-ink transition"
                    >
                      −
                    </button>
                    <span className="min-w-[3rem] text-center text-sm font-medium">Qty {item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(item.productId, item.quantity + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-stone text-sm hover:border-ink transition"
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-4">
                    <p className="font-semibold">${((product?.price ?? 0) * item.quantity).toFixed(2)}</p>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Link href="/checkout">
                      <button
                        type="button"
                        className="rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#1f2622]"
                      >
                        Buy Now
                      </button>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Complete the Look */}
          {aiSuggestions.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-terracotta" />
                <h2 className="text-lg font-semibold">Complete the look</h2>
                <Badge className="bg-terracotta/10 text-terracotta border-terracotta/30">AI</Badge>
                <p className="text-sm text-ink/50">Stylist-picked to pair with your cart</p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {aiSuggestions.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-stone bg-white/70 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-sm text-ink/60 uppercase tracking-[0.2em]">Estimated Total</p>
                <p className="text-3xl font-semibold mt-2">${total.toFixed(2)}</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Link href="/checkout" className="flex-1 sm:flex-none">
                  <Button className="w-full">Proceed to Checkout</Button>
                </Link>
                <button
                  type="button"
                  onClick={() => clearCart()}
                  className="rounded-full border border-stone px-5 py-2 text-sm transition hover:border-ink"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
