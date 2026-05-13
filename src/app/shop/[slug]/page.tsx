import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

type ProductPageProps = {
  params: { slug: string };
};

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((item) => item.id === params.slug) ?? products[0];

  return (
    <div className="flex flex-col gap-16">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6 md:grid-cols-2">
          {product.gallery.map((image) => (
            <div
              key={image}
              className="overflow-hidden rounded-[40px] border border-stone"
            >
              <Image
                src={image}
                alt={product.name}
                width={520}
                height={640}
                className="h-72 w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow={product.category}
            title={product.name}
            description={product.description}
          />
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
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold">${product.price}</p>
            <div className="flex gap-3">
              <Button variant="secondary">Add to wishlist</Button>
              <Button>Add to cart</Button>
            </div>
          </div>
          <Link href="/tryon">
            <Button variant="secondary" size="lg">
              Launch AI Try-On
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-10">
        <SectionHeading
          eyebrow="Recommended"
          title="Pair with organic layering"
          description="Suggested styles to complete the botanical edit."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {products.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-stone bg-white/70 p-5"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={520}
                height={640}
                className="h-56 w-full rounded-[32px] object-cover"
              />
              <p className="mt-4 text-lg font-semibold">{item.name}</p>
              <p className="text-sm uppercase tracking-[0.2em] text-ink/60">
                {item.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
