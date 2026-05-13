import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CheckoutPage() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-ink/60">Checkout</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
            Secure botanical checkout
          </h1>
        </div>
        <div className="grid gap-4">
          <Input placeholder="Full name" />
          <Input placeholder="Email address" />
          <Input placeholder="Shipping address" />
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="City" />
            <Input placeholder="Postal code" />
          </div>
        </div>
        <Button size="lg">Confirm order</Button>
      </div>
      <div className="flex flex-col gap-6 rounded-3xl border border-stone bg-white/70 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-ink/60">
          Order summary
        </p>
        <div className="flex items-center justify-between text-sm">
          <span>Subtotal</span>
          <span>$680</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Shipping</span>
          <span>$20</span>
        </div>
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>$700</span>
        </div>
        <Input placeholder="Add coupon code" />
        <Button variant="secondary">Apply</Button>
      </div>
    </div>
  );
}
