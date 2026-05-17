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
    <div className="min-h-screen rounded-3xl bg-white">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="text-ink/60 hover:text-ink transition">
          ← Back
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading 
          eyebrow="Shop"
          title="All Products" 
          description="Browse our complete collection of curated fashion pieces"
        />

        {/* Filters at top - Full width */}
        <div className="mt-8 mb-8">
          <Filters value={filters} onChange={setFilters} />
        </div>

        {/* Products Grid - Full width */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-ink/60">No products found matching your filters.</p>
          </div>
        )}

        {/* Product count */}
        <div className="mt-8 text-center text-sm text-ink/60">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </div>
  );
}
