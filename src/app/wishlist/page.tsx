"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { SectionHeading } from "@/components/site/section-heading";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const items = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p !== undefined);

  return (
    <div className="flex flex-col gap-12">
      <Link href="/" className="text-ink/60 hover:text-ink transition">
        ← Back
      </Link>

      <SectionHeading 
        eyebrow="Favorites"
        title="Your Wishlist" 
        description="Items you love and want to remember"
      />

      {items.length === 0 ? (
        <div className="rounded-3xl border border-stone bg-white/70 p-12 text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 text-stone" />
          <p className="text-ink/60 mb-4">Your wishlist is empty</p>
          <Link href="/shop">
            <Button>Explore Products</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm text-ink/60">
              {items.length} item{items.length !== 1 ? "s" : ""} saved
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
            {items.map((product) => (
              <div
                key={product.id}
                className={viewMode === "grid" 
                  ? "rounded-3xl border border-stone bg-white/70 overflow-hidden hover:shadow-lg transition group"
                  : "flex items-center gap-4 rounded-3xl border border-stone bg-white/70 p-4"
                }
              >
                <div className={viewMode === "grid" ? "relative overflow-hidden" : ""}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={260}
                    className={viewMode === "grid"
                      ? "w-full h-48 object-cover group-hover:scale-105 transition"
                      : "h-24 w-20 rounded object-cover"
                    }
                  />
                </div>
                <div className={viewMode === "grid" ? "p-4" : "flex-1"}>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-xs text-ink/60 uppercase tracking-wide mt-1">
                    {product.category}
                  </p>
                  <p className="text-sm font-semibold mt-2">${product.price}</p>
                  
                  <div className={`flex gap-2 mt-3 ${viewMode === "grid" ? "flex-col" : ""}`}>
                    <Button
                      onClick={() => {
                        addToCart(product.id);
                      }}
                      className={viewMode === "grid" ? "w-full text-sm" : "text-sm"}
                    >
                      Add to Cart
                    </Button>
                    <Link href={`/shop/${product.id}`} className={viewMode === "grid" ? "w-full" : ""}>
                      <Button
                        variant="secondary"
                        className={viewMode === "grid" ? "w-full text-sm" : "text-sm"}
                      >
                        View
                      </Button>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}