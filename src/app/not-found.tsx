import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-ink/60">404</p>
      <h1 className="text-4xl font-semibold">This look is out of stock.</h1>
      <p className="text-ink/70">
        The page you are looking for has moved to another atelier.
      </p>
      <Link href="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
