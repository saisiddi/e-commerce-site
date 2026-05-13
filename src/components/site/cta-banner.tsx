import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <div className="relative overflow-hidden rounded-[48px] border border-stone bg-ink px-8 py-14 text-white shadow-softLg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(140,154,132,0.35),_transparent_55%)]" />
      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">
            AI Styling Studio
          </p>
          <h3 className="mt-4 text-3xl font-semibold md:text-4xl">
            Generate your botanical look in under 45 seconds.
          </h3>
        </div>
        <Link href="/tryon">
          <Button size="lg" className="bg-white text-ink hover:bg-white/90">
            Launch Try-On
          </Button>
        </Link>
      </div>
    </div>
  );
}
