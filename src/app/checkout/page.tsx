"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { products } from "@/data/products";
import Link from "next/link";

export default function CheckoutPage() {
  const { user, isLoading } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  const items = useMemo(() => {
    return cart.reduce<Array<{ item: (typeof cart)[number]; product: NonNullable<(typeof products)[number]> }>>((acc, it) => {
      const p = products.find((x) => x.id === it.productId);
      if (p) acc.push({ item: it, product: p });
      return acc;
    }, []);
  }, [cart]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, row) => sum + row.product.price * row.item.quantity, 0);
  }, [items]);

  const shipping = 20;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-12">
      <Link href="/cart">
        <button type="button" className="flex items-center gap-2 text-ink/60 hover:text-ink transition">
          ← Back
        </button>
      </Link>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-ink/60">Checkout</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
            Secure botanical checkout
          </h1>
          <p className="text-ink/70 mt-2">Welcome back, {user.name}!</p>
        </div>
        <div className="grid gap-4">
          <label className="text-sm font-medium">Full name</label>
          <Input placeholder="Full name" defaultValue={user.name} />
          <label className="text-sm font-medium">Email address</label>
          <Input placeholder="Email address" defaultValue={user.email} />
          <label className="text-sm font-medium">Shipping address</label>
          <Input placeholder="Shipping address" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">City</label>
              <Input placeholder="City" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Postal code</label>
              <Input placeholder="Postal code" />
            </div>
          </div>
        </div>
        <Button size="lg">Confirm order</Button>
      </div>
      <div className="flex flex-col gap-4 rounded-3xl border border-stone bg-white/70 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-ink/60">
          Order summary
        </p>
        {items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {items.map(({ item, product }) => (
              <div key={item.productId} className="flex items-center gap-3 text-sm">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={48}
                  height={64}
                  className="h-16 w-12 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-ink/60">Qty {item.quantity}</p>
                </div>
                <p className="font-medium">${(product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/60">No items in cart</p>
        )}
        <div className="mt-2 border-t border-stone pt-3">
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-semibold mt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <Input placeholder="Add coupon code" />
        <Button variant="secondary">Apply</Button>
      </div>
      </div>
    </div>
  );
}
