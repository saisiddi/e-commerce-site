"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group rounded-3xl border border-stone bg-white/80 p-5 shadow-soft"
    >
      <div className="relative overflow-hidden rounded-[40px]">
        <Image
          src={product.image}
          alt={product.name}
          width={560}
          height={720}
          className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          {product.trending ? <Badge>Trending</Badge> : null}
          {product.featured ? <Badge variant="outline">Featured</Badge> : null}
        </div>
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-stone bg-white/80"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">{product.name}</p>
          <p className="text-sm uppercase tracking-[0.2em] text-ink/60">
            {product.category}
          </p>
        </div>
        <p className="text-lg font-semibold">${product.price}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-ink/70">{product.rating} rating</p>
        <Link href={`/shop/${product.id}`}>
          <Button size="sm" variant="secondary">
            View
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
