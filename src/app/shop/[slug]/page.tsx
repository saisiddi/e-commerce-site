"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCart } from "@/lib/cart-context";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = React.use(params);
  const product = products.find((item) => item.id === resolvedParams.slug) ?? products[0];
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [wish, setWish] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    try {
      setWish(isInWishlist(product.id));
    } catch (err) {
      setWish(false);
    }
  }, [product.id, isInWishlist]);

  useEffect(() => {
    setSelectedSize(product.sizes[0] ?? "");
  }, [product.id, product.sizes]);

  return (
    <div className="flex flex-col gap-16">
      <Link href="/shop">
        <button type="button" className="flex items-center gap-2 text-ink/60 hover:text-ink transition">
          ← Back
        </button>
      </Link>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          {/* Main image - larger display */}
          <div className="overflow-hidden rounded-[40px] border border-stone">
            <Image
              src={product.image}
              alt={product.name}
              width={800}
              height={1000}
              className="h-auto w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div>
            <SectionHeading
              eyebrow={product.category}
              title={product.name}
              description={product.description}
            />
            <div className="mt-4 flex items-center gap-3">
              <button type="button" className="rounded-full border-2 border-sage px-4 py-2 text-sm font-semibold text-sage">
                ★ {product.rating}
              </button>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border border-stone bg-white/70 p-6">
            <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-ink/60">
              <span>Fabric</span>
              <span>{product.fabric}</span>
            </div>
            <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-ink/60">
              <span>Sizes</span>
              <span>{product.sizes.join(" ")}</span>
            </div>
            <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-ink/60">
              <span>Colors</span>
              <span>{product.colors.join(" ")}</span>
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-xs uppercase tracking-[0.25em] text-ink/60">Select size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                      isSelected
                        ? "border-terracotta bg-terracotta/10 text-terracotta"
                        : "border-stone text-ink/70 hover:border-terracotta/60 hover:text-terracotta"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-3xl font-semibold">${product.price}</p>
            <button
              onClick={() => {
                if (wish) {
                  removeFromWishlist(product.id);
                  setWish(false);
                } else {
                  addToWishlist(product.id);
                  setWish(true);
                }
              }}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition duration-200 hover:scale-110 active:scale-95 ${wish ? "border-red-500 bg-red-500/15 text-red-500" : "border-stone/50 text-ink/60 hover:border-red-500 hover:text-red-500"}`}
            >
              <Heart className={`h-5 w-5 ${wish ? "fill-red-500" : ""}`} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => addToCart(product.id)}
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#2D3A31] px-8 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-soft transition duration-200 hover:bg-[#1f2622] hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C9A84] focus-visible:ring-offset-2"
          >
            Add to cart
          </button>

          <Link href="/tryon">
            <Button variant="secondary" size="lg" className="w-full">
              Launch AI Try-On
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-10">
        <h2 className="text-4xl font-semibold">Recommended</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {products.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              href={`/shop/${item.id}`}
              className="group rounded-3xl border border-stone bg-white/70 p-5 transition hover:shadow-lg hover:border-terracotta/50"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={520}
                height={640}
                className="h-56 w-full rounded-[32px] object-cover transition duration-700 group-hover:scale-105"
              />
              <p className="mt-4 text-lg font-semibold group-hover:text-terracotta transition">{item.name}</p>
              <p className="text-sm uppercase tracking-[0.2em] text-ink/60">
                {item.category}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
