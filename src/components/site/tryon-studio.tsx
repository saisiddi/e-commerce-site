"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BeforeAfter } from "@/components/site/before-after";
import { products } from "@/data/products";
import { useAuth } from "@/lib/auth-context";

export function TryOnStudio() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<any>(user?.preferences || {});
  const [useSaved, setUseSaved] = useState<boolean>(!!user?.preferences);
  const [suggestions, setSuggestions] = useState<typeof products>([] as any);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [mode, setMode] = useState<"generate" | "suggest" | null>(null);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (useSaved && user?.preferences) {
      setPreferences(user.preferences);
    }
  }, [useSaved, user]);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId),
    [selectedId]
  );

  const handleGenerate = async () => {
    if (!file || !selectedProduct) return;
    setLoading(true);
    setResultUrl(null);

    const formData = new FormData();
    formData.append("userImage", file);
    formData.append("productId", selectedProduct.id);

    const response = await fetch("/api/tryon", {
      method: "POST",
      body: formData,
    });

    const data = (await response.json()) as { resultUrl?: string };
    setResultUrl(data.resultUrl ?? selectedProduct.image);
    setLoading(false);
  };

  const skinTones = ["fair", "light", "medium", "tan", "deep"];
  const bodyShapes = ["apple", "pear", "hourglass", "rectangle", "inverted-triangle"];
  const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
  const occasions = ["casual", "business", "formal", "party", "athletic"];
  const budgets = ["budget", "moderate", "premium", "luxury"];

  const handleSuggest = async () => {
    setSuggestLoading(true);
    setSuggestions([] as any);
    try {
      const response = await fetch("/api/outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
      });
      const data = await response.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSuggestLoading(false);
    }
  };

  return (
    <div>
      {/* Show only mode selector when no mode is selected */}
      {!mode ? (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("generate");
            }}
            style={{
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #ddd",
              cursor: "pointer",
              background: "white",
              transition: "all 0.3s",
            }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-ink/60">Mode</p>
            <h4 className="mt-2 text-lg font-semibold">Generate Try-On</h4>
            <p className="text-sm text-ink/70 mt-1">Upload an image and generate a try-on for a selected outfit.</p>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("suggest");
            }}
            style={{
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #ddd",
              cursor: "pointer",
              background: "white",
              transition: "all 0.3s",
            }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-ink/60">Mode</p>
            <h4 className="mt-2 text-lg font-semibold">Suggest outfits</h4>
            <p className="text-sm text-ink/70 mt-1">Enter preferences and get tailored outfit suggestions.</p>
          </button>
        </div>
      ) : null}

      {/* Conditional content based on mode */}
      {mode === "generate" && (
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <Card className="p-8">
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-ink/60">Upload your photo</p>
                  <h2 className="mt-3 text-3xl font-semibold">AI try-on, designed to feel human.</h2>
                </div>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setFile(event.target.files ? event.target.files[0] : null)}
                />

                <div className="grid gap-3">
                  <p className="text-sm uppercase tracking-[0.2em] text-ink/60">Select outfit</p>
                  <div className="grid grid-cols-2 gap-3">
                    {products.slice(0, 4).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedId(product.id)}
                        className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                          product.id === selectedId ? "border-terracotta bg-clay/50" : "border-stone bg-white"
                        }`}
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleGenerate} disabled={!file || loading}>
                    {loading ? "Generating" : "Generate Try-On"}
                  </Button>
                </div>
              </div>
            </Card>

            <div className="relative h-[420px] overflow-hidden rounded-[40px] border border-stone bg-clay/30">
              {previewUrl ? (
                <Image src={previewUrl} alt="Uploaded preview" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-ink/60">Upload a photo to preview</div>
              )}
            </div>

            {resultUrl && previewUrl ? (
              <BeforeAfter before={previewUrl} after={resultUrl} />
            ) : (
              <div className="flex h-[240px] items-center justify-center rounded-[20px] border border-stone bg-white/70 text-sm text-ink/60">
                {loading ? "AI is generating your try-on..." : "Result appears here"}
              </div>
            )}
          </div>

          <div>
            <Card className="p-8">
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-ink/60">Preview</p>
                  <h3 className="mt-3 text-2xl font-semibold">Selected outfit</h3>
                </div>
                <div className="grid gap-3">
                  {products
                    .filter((p) => p.id === selectedId)
                    .map((p) => (
                      <div key={p.id} className="flex items-center gap-4">
                        <img src={p.image} className="h-20 w-16 rounded-lg object-cover" />
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-sm text-ink/60">{p.category} • ${p.price}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {mode === "suggest" && (
        <div className="grid gap-6">
          <Card className="p-8">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-ink/60">Preferences</p>
                <h3 className="mt-3 text-2xl font-semibold">Tell us your style</h3>
                <p className="text-ink/70 mt-2 text-sm">Enter your preferences and get outfit suggestions tailored to you.</p>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={useSaved} onChange={(e) => setUseSaved(e.target.checked)} />
                  <span className="text-sm">Use preferences from your profile (if available)</span>
                </div>

                <div>
                  <p className="text-sm font-medium">Skin tone</p>
                  <div className="flex gap-2 mt-2">
                    {skinTones.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPreferences((p: any) => ({ ...p, skinTone: t }))}
                        className={`px-3 py-2 rounded-lg border ${preferences.skinTone === t ? "border-terracotta bg-terracotta/10" : "border-stone"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Body shape</p>
                  <div className="flex gap-2 mt-2">
                    {bodyShapes.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setPreferences((p: any) => ({ ...p, bodyShape: b }))}
                        className={`px-3 py-2 rounded-lg border ${preferences.bodyShape === b ? "border-terracotta bg-terracotta/10" : "border-stone"}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Size</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPreferences((p: any) => ({ ...p, size: s }))}
                        className={`px-3 py-2 rounded-lg border ${preferences.size === s ? "border-terracotta bg-terracotta/10" : "border-stone"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Occasion</p>
                  <div className="flex gap-2 mt-2">
                    {occasions.map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setPreferences((p: any) => ({ ...p, occasion: o }))}
                        className={`px-3 py-2 rounded-lg border ${preferences.occasion === o ? "border-terracotta bg-terracotta/10" : "border-stone"}`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Budget</p>
                  <div className="flex gap-2 mt-2">
                    {budgets.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setPreferences((p: any) => ({ ...p, budget: b }))}
                        className={`px-3 py-2 rounded-lg border ${preferences.budget === b ? "border-terracotta bg-terracotta/10" : "border-stone"}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button onClick={handleSuggest} disabled={suggestLoading}>
                  {suggestLoading ? "Suggesting..." : "Suggest outfits"}
                </Button>
              </div>
            </div>
          </Card>

          {suggestions.length > 0 && (
            <Card className="p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-ink/60">Suggested outfits</p>
              <div className="grid gap-3 mt-3">
                {suggestions.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className="flex items-center justify-between rounded-lg border px-4 py-3"
                  >
                    <div className="text-left">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-sm text-ink/60">{s.category} • ${s.price}</div>
                    </div>
                    <div className="text-sm text-ink/60">Select</div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
