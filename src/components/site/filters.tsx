"use client";

import { useEffect, useMemo, useState } from "react";
import { products } from "@/data/products";

type FiltersValue = {
  priceRange: [number, number] | null;
  colors: string[];
  sizes: string[];
  fabrics: string[];
  styles: string[];
};

export function Filters({
  value,
  onChange,
}: {
  value: FiltersValue;
  onChange: (v: FiltersValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<FiltersValue>(value);

  const allColors = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => s.add(c)));
    return Array.from(s);
  }, []);

  const allSizes = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => p.sizes.forEach((c) => s.add(c)));
    return Array.from(s);
  }, []);

  const allFabrics = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => s.add(p.fabric));
    return Array.from(s);
  }, []);

  const allStyles = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => s.add(p.category));
    return Array.from(s);
  }, []);

  // sync incoming value -> local when value changes
  useEffect(() => setLocal(value), [value]);

  const [colorsOpen, setColorsOpen] = useState(false);

  const toggle = (key: keyof Omit<FiltersValue, "priceRange">, item: string) => {
    const arr = [...(local[key] as string[])];
    const idx = arr.indexOf(item);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(item);
    setLocal({ ...local, [key]: arr } as FiltersValue);
  };

  const clear = () => {
    const cleared: FiltersValue = { priceRange: null, colors: [], sizes: [], fabrics: [], styles: [] };
    setLocal(cleared);
    onChange(cleared);
  };

  const apply = () => {
    onChange(local);
    setOpen(false);
  };

  // price bounds
  const minPrice = useMemo(() => Math.min(...products.map((p) => p.price)), []);
  const maxPrice = useMemo(() => Math.max(...products.map((p) => p.price)), []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-stone px-4 py-2 text-sm uppercase tracking-[0.2em] text-ink/70 transition hover:border-terracotta hover:text-terracotta"
      >
        Filters
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-96 rounded-md border bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium">Filters</div>
            <button type="button" className="text-sm text-ink/60" onClick={clear}>
              Clear
            </button>
          </div>

          <div className="mb-3">
            <div className="text-xs font-medium mb-1">Price range</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={local.priceRange?.[0] ?? minPrice}
                min={minPrice}
                max={local.priceRange?.[1] ?? maxPrice}
                onChange={(e) => setLocal({ ...local, priceRange: [Number(e.target.value), local.priceRange?.[1] ?? maxPrice] })}
                className="w-24 rounded border px-2 py-1"
              />
              <span className="text-sm">—</span>
              <input
                type="number"
                value={local.priceRange?.[1] ?? maxPrice}
                min={local.priceRange?.[0] ?? minPrice}
                max={maxPrice}
                onChange={(e) => setLocal({ ...local, priceRange: [local.priceRange?.[0] ?? minPrice, Number(e.target.value)] })}
                className="w-24 rounded border px-2 py-1"
              />
            </div>

            {/* Dual-thumb slider visually on one line */}
            <div className="mt-3">
              <div className="relative h-6">
                <div className="absolute left-0 right-0 top-2 h-1 rounded bg-stone/30" />
                <div
                  className="absolute top-2 h-1 rounded bg-terracotta"
                  style={{
                    left: `${((local.priceRange?.[0] ?? minPrice) - minPrice) / (maxPrice - minPrice) * 100}%`,
                    right: `${100 - ((local.priceRange?.[1] ?? maxPrice) - minPrice) / (maxPrice - minPrice) * 100}%`,
                  }}
                />

                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={local.priceRange?.[0] ?? minPrice}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    const hi = local.priceRange?.[1] ?? maxPrice;
                    setLocal({ ...local, priceRange: [Math.min(v, hi), hi] });
                  }}
                  className="absolute left-0 top-0 w-full appearance-none bg-transparent pointer-events-auto"
                />

                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={local.priceRange?.[1] ?? maxPrice}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    const lo = local.priceRange?.[0] ?? minPrice;
                    setLocal({ ...local, priceRange: [lo, Math.max(v, lo)] });
                  }}
                  className="absolute left-0 top-0 w-full appearance-none bg-transparent pointer-events-auto"
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium mb-1">Colors</div>
              <button type="button" className="text-sm text-ink/60" onClick={() => setColorsOpen((s) => !s)}>
                {colorsOpen ? "Close" : "Open"}
              </button>
            </div>

            {colorsOpen ? (
              <div className="mt-2 border-t pt-2">
                <div className="flex flex-wrap gap-2">
                  {allColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggle("colors", c)}
                      className={`px-2 py-1 rounded text-sm border ${local.colors.includes(c) ? "border-terracotta bg-terracotta/10" : "border-stone"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-ink/60">{local.colors.length > 0 ? `${local.colors.length} selected` : "Any"}</div>
            )}
          </div>

          <div className="mb-3">
            <div className="text-xs font-medium mb-1">Sizes</div>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggle("sizes", s)}
                  className={`px-2 py-1 rounded text-sm border ${local.sizes.includes(s) ? "border-terracotta bg-terracotta/10" : "border-stone"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-xs font-medium mb-1">Fabric</div>
            <div className="flex flex-wrap gap-2">
              {allFabrics.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggle("fabrics", f)}
                  className={`px-2 py-1 rounded text-sm border ${local.fabrics.includes(f) ? "border-terracotta bg-terracotta/10" : "border-stone"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-xs font-medium mb-1">Style</div>
            <div className="flex flex-wrap gap-2">
              {allStyles.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => toggle("styles", st)}
                  className={`px-2 py-1 rounded text-sm border ${local.styles.includes(st) ? "border-terracotta bg-terracotta/10" : "border-stone"}`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={apply}
              className="px-3 py-2 rounded border text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
