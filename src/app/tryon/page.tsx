import { TryOnStudio } from "@/components/site/tryon-studio";
import Link from "next/link";

export default function TryOnPage() {
  return (
    <div className="flex flex-col gap-12">
      <Link href="/">
        <button type="button" className="flex items-center gap-2 text-ink/60 hover:text-ink transition">
          ← Back
        </button>
      </Link>
      <TryOnStudio />
    </div>
  );
}
