"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { SectionHeading } from "@/components/site/section-heading";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useCart();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const items = cart.map((it) => {
    const p = products.find((x) => x.id === it.productId);
    return { item: it, product: p };
  }).filter(Boolean as any);

  const total = items.reduce((sum, row) => sum + ((row.product?.price ?? 0) * row.item.quantity), 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="text-ink/60 hover:text-ink transition">
          ← Back
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading 
          eyebrow="Shopping"
          title="Your Cart" 
          description="Review and manage your selected items"
        />

        {items.length === 0 ? (
          <div className="mt-12 rounded-lg border border-stone bg-white/70 p-12 text-center">
            <p className="text-ink/60 mb-4">Your cart is empty</p>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* View mode toggle */}
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-ink/60">
                {items.length} item{items.length !== 1 ? "s" : ""} in cart
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 text-sm rounded transition ${
                    viewMode === "grid"
                      ? "bg-ink text-white"
                      : "border border-stone text-ink/60"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 text-sm rounded transition ${
                    viewMode === "list"
                      ? "bg-ink text-white"
                      : "border border-stone text-ink/60"
                  }`}
                >
                  List
                </button>
              </div>
            </div>

            {/* Products display */}
            <div className={`mt-8 ${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}`}>
              {items.map(({ item, product }) => (
                <div
                  key={item.productId}
                  className={viewMode === "grid" 
                    ? "rounded-lg border border-stone bg-white/70 overflow-hidden hover:shadow-lg transition"
                    : "flex items-center gap-4 rounded-lg border border-stone bg-white/70 p-4"
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
                        onClick={() =>
                          updateCartQuantity(
                            item.productId,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-2 py-1 border border-stone rounded hover:border-ink transition"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-sm font-medium">Qty {item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.productId, item.quantity + 1)
                        }
                        className="px-2 py-1 border border-stone rounded hover:border-ink transition"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-col items-center justify-between mt-3 gap-2">
                      <p className="font-semibold w-full text-center">
                        ${((product?.price ?? 0) * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex gap-2 w-full">
                        <Link href="/checkout" className="flex-1">
                          <button className="w-full text-sm font-semibold bg-amber-600 text-white px-3 py-2 rounded hover:bg-amber-700 transition">
                            Buy Now
                          </button>
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-sm text-red-500 hover:text-red-700 transition px-3 py-2 border border-red-200 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-12 rounded-lg border border-stone bg-white/70 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-sm text-ink/60 uppercase tracking-wide">
                    Estimated Total
                  </p>
                  <p className="text-3xl font-semibold mt-2">${total.toFixed(2)}</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Link href="/checkout" className="flex-1 sm:flex-none">
                    <Button className="w-full">Proceed to Checkout</Button>
                  </Link>
                  <button
                    onClick={() => clearCart()}
                    className="px-4 py-2 border border-stone rounded hover:border-ink transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
