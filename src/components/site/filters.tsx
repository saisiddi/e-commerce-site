import { categories } from "@/data/products";

export function Filters() {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className="rounded-full border border-stone px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink/70 transition hover:border-terracotta hover:text-terracotta"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
