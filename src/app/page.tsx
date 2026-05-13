import Link from "next/link";

import { CtaBanner } from "@/components/site/cta-banner";
import { Hero } from "@/components/site/hero";
import { ProductCard } from "@/components/site/product-card";
import { ReviewGrid } from "@/components/site/review-grid";
import { SectionHeading } from "@/components/site/section-heading";
import { Stats } from "@/components/site/stats";
import { Button } from "@/components/ui/button";
import { featuredProducts, trendingProducts } from "@/data/products";

export default function Home() {
  return (
    <div className="flex flex-col gap-24">
      <Hero />
      <Stats />

      <section className="grid gap-10">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Featured"
            title="Curated looks for the modern atelier."
            description="Editorial silhouettes rendered in botanical neutrals and prepared for AI try-on."
          />
          <Link href="/shop" className="hidden md:inline-flex">
            <Button variant="secondary" size="sm">
              View all
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="grid gap-10">
        <SectionHeading
          eyebrow="Trending now"
          title="The botanical edit, designed to move."
          description="Soft architecture, organic drape, and a quiet kind of statement."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {trendingProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <CtaBanner />

      <section className="grid gap-10">
        <SectionHeading
          eyebrow="Client notes"
          title="Luxury clients, seamless AI fittings."
          description="A calm, premium experience that feels like a private fitting studio."
        />
        <ReviewGrid />
      </section>
    </div>
  );
}
