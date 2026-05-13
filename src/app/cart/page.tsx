import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

export default function CartPage() {
  const items = products.slice(0, 2);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="flex flex-col gap-12">
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-ink/60">Cart</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
          Your curated selection
        </h1>
      </div>
      <div className="grid gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-6 rounded-3xl border border-stone bg-white/70 p-6 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-6">
              <Image
                src={item.image}
                alt={item.name}
                width={120}
                height={160}
                className="h-28 w-24 rounded-[28px] object-cover"
              />
              <div>
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-sm uppercase tracking-[0.2em] text-ink/60">
                  {item.category}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-full border border-stone px-4 py-2 text-sm">
                Qty 1
              </div>
              <p className="text-lg font-semibold">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-6 rounded-3xl border border-stone bg-white/70 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-ink/60">
            Estimated total
          </p>
          <p className="mt-2 text-3xl font-semibold">${total}</p>
        </div>
        <Link href="/checkout">
          <Button size="lg">Proceed to checkout</Button>
        </Link>
      </div>
    </div>
  );
}
