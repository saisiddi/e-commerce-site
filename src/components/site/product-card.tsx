"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { useEffect, useState, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { addToast } = useToast();
  const [wish, setWish] = useState<boolean>(false);
  const [added, setAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    try {
      setWish(isInWishlist(product.id));
    } catch {
      setWish(false);
    }
  }, [product.id, isInWishlist]);

  const handleAddToCart = () => {
    addToCart(product.id);
    setAdded(true);
    addToast(`${product.name} added to cart`, "success");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wish) {
      removeFromWishlist(product.id);
      setWish(false);
      addToast(`${product.name} removed from wishlist`, "info");
    } else {
      addToWishlist(product.id);
      setWish(true);
      addToast(`${product.name} added to wishlist`, "success");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group rounded-3xl border border-stone bg-white/80 p-6 shadow-soft"
    >
      <Link
        href={`/shop/${product.id}`}
        className="relative overflow-hidden rounded-3xl block"
        aria-label={`View details for ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          width={560}
          height={720}
          className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 right-16 flex flex-wrap gap-2">
          {product.trending ? (
            <Badge className="bg-white/90 text-ink shadow-sm">Trending</Badge>
          ) : null}
          {product.featured ? (
            <Badge variant="outline" className="border-stone/60 bg-white/80 text-ink shadow-sm">
              Featured
            </Badge>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Toggle wishlist"
          onClick={handleToggleWish}
          className={`absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border-2 bg-white/90 transition duration-200 hover:scale-110 active:scale-95 ${wish ? "border-red-500 bg-red-500/15 text-red-500" : "border-stone/50 text-ink/60 hover:border-red-500 hover:text-red-500"}`}
        >
          <Heart className={`h-5 w-5 ${wish ? "fill-red-500" : ""}`} />
        </button>
      </Link>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-lg font-semibold leading-tight">{product.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-ink/50">
            {product.category}
          </p>
        </div>
        <p className="text-xl font-semibold text-ink">${product.price}</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          className="rounded-full border-2 border-sage px-3 py-1.5 text-xs font-semibold text-sage transition duration-200 hover:scale-105 hover:border-terracotta hover:text-terracotta hover:bg-terracotta/5"
        >
          ★ {product.rating}
        </button>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            size="sm"
            onClick={handleAddToCart}
            variant={added ? "primary" : "secondary"}
            className={`font-semibold whitespace-nowrap transition-all duration-300 ${added ? "scale-105" : ""}`}
          >
            {added ? (
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                Added
              </span>
            ) : (
              "Add to cart"
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
