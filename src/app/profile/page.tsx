import Image from "next/image";

import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-12">
      <SectionHeading
        eyebrow="Profile"
        title="Your atelier account"
        description="Saved try-ons, curated outfits, and order history in one calm space."
      />
      <div className="grid gap-6 rounded-3xl border border-stone bg-white/70 p-6 md:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-ink/60">Member</p>
          <h2 className="mt-3 text-2xl font-semibold">Ava Laurent</h2>
          <p className="mt-2 text-sm text-ink/70">ava@ateliermode.com</p>
          <Button size="sm" variant="secondary" className="mt-6">
            Edit profile
          </Button>
        </div>
        <div className="grid gap-4 rounded-3xl border border-stone bg-clay/40 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-ink/60">
            AI Try-On History
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {products.slice(0, 3).map((item) => (
              <Image
                key={item.id}
                src={item.image}
                alt={item.name}
                width={200}
                height={280}
                className="h-32 w-full rounded-[28px] object-cover"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
