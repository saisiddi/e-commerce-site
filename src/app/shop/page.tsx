"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { Filters } from "@/components/site/filters";
import { ProductCard } from "@/components/site/product-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products, type Product } from "@/data/products";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";

type FiltersValue = {
  priceRange: [number, number] | null;
  colors: string[];
  sizes: string[];
  fabrics: string[];
  styles: string[];
};

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FiltersValue>({ priceRange: null, colors: [], sizes: [], fabrics: [], styles: [] });
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [recLoading, setRecLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    if (user?.preferences) {
      fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: user.preferences }),
      })
        .then((res) => res.json())
        .then((data) => setRecommended(data.suggestions ?? []))
        .catch(() => setRecommended([]))
        .finally(() => setRecLoading(false));
    } else {
      setRecLoading(false);
    }
  }, [user?.preferences]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = search.trim().toLowerCase();
      if (q) {
        const hay = `${p.name} ${p.description} ${p.fabric} ${p.category} ${p.colors.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (p.price < min || p.price > max) return false;
      }

      if (filters.colors.length > 0) {
        if (!filters.colors.some((c: string) => p.colors.includes(c))) return false;
      }

      if (filters.sizes.length > 0) {
        if (!filters.sizes.some((s: string) => p.sizes.includes(s))) return false;
      }

      if (filters.fabrics.length > 0) {
        if (!filters.fabrics.includes(p.fabric)) return false;
      }

      if ((filters.styles || []).length > 0) {
        if (!filters.styles.includes(p.category)) return false;
      }

      return true;
    });
  }, [search, filters]);

  const handleAiSuggest = async () => {
    if (!user?.preferences) {
      addToast("Set your style preferences first in your profile", "info");
      return;
    }

    setSuggestLoading(true);
    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: user.preferences }),
      });

      const data = await response.json();
      const suggestions = data.suggestions ?? [];

      if (suggestions.length === 0) {
        addToast("No matching products found based on your preferences", "info");
      } else {
        suggestions.forEach((p: { id: string }) => addToCart(p.id));
        addToast(`AI added ${suggestions.length} items matching your style to cart`, "success");
      }
    } catch {
      addToast("Something went wrong. Please try again.", "error");
    } finally {
      setSuggestLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="flex items-start justify-between gap-4">
        <SectionHeading
          eyebrow="Shop"
          title="Curated botanical collections"
          description="Explore structured essentials, editorial silhouettes, and intelligent styling."
        />
        {user?.preferences && (
          <Button
            onClick={handleAiSuggest}
            disabled={suggestLoading}
            variant="secondary"
            size="sm"
            className="shrink-0 mt-2"
          >
            <Sparkles className="h-4 w-4" />
            {suggestLoading ? "Analysing..." : "AI Suggest"}
          </Button>
        )}
      </div>

      {/* Recommended for you */}
      {!recLoading && recommended.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-terracotta" />
            <h2 className="text-lg font-semibold">Recommended for you</h2>
            <Badge className="bg-terracotta/10 text-terracotta border-terracotta/30">AI</Badge>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {recommended.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by style, fabric, or tone" />
        <Filters value={filters} onChange={(v) => setFilters(v)} />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-ink/60">
            No products match your current filters.
          </div>
        )}
      </div>
    </div>
  );
}
