"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/site/product-card";
import { Filters } from "@/components/site/filters";
import { SectionHeading } from "@/components/site/section-heading";

type FiltersValue = {
  priceRange: [number, number] | null;
  colors: string[];
  sizes: string[];
  fabrics: string[];
  styles: string[];
};

export default function ProductsPage() {
  const [filters, setFilters] = useState<FiltersValue>({
    priceRange: null,
    colors: [],
    sizes: [],
    fabrics: [],
    styles: [],
  });

  const filteredProducts = useMemo(() => {
    let result = products;

    // Price filter
    if (filters.priceRange) {
      result = result.filter(
        (p) => p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
      );
    }

    // Color filter
    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => filters.colors.includes(c))
      );
    }

    // Size filter
    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => filters.sizes.includes(s))
      );
    }

    // Fabric filter
    if (filters.fabrics.length > 0) {
      result = result.filter((p) =>
        filters.fabrics.some((f) => p.fabric.toLowerCase().includes(f.toLowerCase()))
      );
    }

    // Style filter (category)
    if (filters.styles.length > 0) {
      result = result.filter((p) => filters.styles.includes(p.category));
    }

    return result;
  }, [filters]);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-ink/60 hover:text-ink transition">
          ← Back
        </Link>
        <Filters value={filters} onChange={setFilters} />
      </div>

      <SectionHeading 
        eyebrow="Shop"
        title="All Products" 
        description="Browse our complete collection of curated fashion pieces"
      />

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-ink/60">No products found matching your filters.</p>
        </div>
      )}

      <div className="text-center text-sm text-ink/60">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}
