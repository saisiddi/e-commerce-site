"use client";

import { useMemo, useState } from "react";
import { Filters } from "@/components/site/filters";
import { ProductCard } from "@/components/site/product-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Input } from "@/components/ui/input";
import { products } from "@/data/products";

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ priceRange: null as [number, number] | null, colors: [] as string[], sizes: [] as string[], fabrics: [] as string[], styles: [] as string[] });

  const filtered = useMemo(() => {
    return products.filter((p) => {
      // search
      const q = search.trim().toLowerCase();
      if (q) {
        const hay = `${p.name} ${p.description} ${p.fabric} ${p.category} ${p.colors.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      // price range
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (p.price < min || p.price > max) return false;
      }

      // colors
      if (filters.colors.length > 0) {
        if (!filters.colors.some((c: string) => p.colors.includes(c))) return false;
      }

      // sizes
      if (filters.sizes.length > 0) {
        if (!filters.sizes.some((s: string) => p.sizes.includes(s))) return false;
      }

      // fabrics
      if (filters.fabrics.length > 0) {
        if (!filters.fabrics.includes(p.fabric)) return false;
      }

      // styles / categories
      if ((filters.styles || []).length > 0) {
        if (!filters.styles.includes(p.category)) return false;
      }

      return true;
    });
  }, [search, filters]);

  return (
    <div className="flex flex-col gap-16">
      <SectionHeading
        eyebrow="Shop"
        title="Curated botanical collections"
        description="Explore structured essentials, editorial silhouettes, and AI-ready styling drops."
      />
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Input value={search} onChange={(e) => setSearch((e.target as HTMLInputElement).value)} placeholder="Search by style, fabric, or tone" />
        <Filters value={filters} onChange={(v) => setFilters(v as any)} />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
