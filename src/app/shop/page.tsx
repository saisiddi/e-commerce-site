import { Filters } from "@/components/site/filters";
import { ProductCard } from "@/components/site/product-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Input } from "@/components/ui/input";
import { products } from "@/data/products";

export default function ShopPage() {
  return (
    <div className="flex flex-col gap-16">
      <SectionHeading
        eyebrow="Shop"
        title="Curated botanical collections"
        description="Explore structured essentials, editorial silhouettes, and AI-ready styling drops."
      />
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Input placeholder="Search by style, fabric, or tone" />
        <Filters />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
