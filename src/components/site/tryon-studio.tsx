"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BeforeAfter } from "@/components/site/before-after";
import { products } from "@/data/products";

export function TryOnStudio() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

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

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-8">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-ink/60">
              Upload your photo
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              AI try-on, designed to feel human.
            </h2>
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={(event) =>
              setFile(event.target.files ? event.target.files[0] : null)
            }
          />
          <div className="grid gap-3">
            <p className="text-sm uppercase tracking-[0.2em] text-ink/60">
              Select outfit
            </p>
            <div className="grid grid-cols-2 gap-3">
              {products.slice(0, 4).map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedId(product.id)}
                  className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                    product.id === selectedId
                      ? "border-terracotta bg-clay/50"
                      : "border-stone bg-white"
                  }`}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={!file || loading}>
            {loading ? "Generating" : "Generate Try-On"}
          </Button>
        </div>
      </Card>
      <div className="flex flex-col gap-6">
        <div className="relative h-[420px] overflow-hidden rounded-[40px] border border-stone bg-clay/30">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Uploaded preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink/60">
              Upload a photo to preview
            </div>
          )}
        </div>
        {resultUrl && previewUrl ? (
          <BeforeAfter before={previewUrl} after={resultUrl} />
        ) : (
          <div className="flex h-[420px] items-center justify-center rounded-[40px] border border-stone bg-white/70 text-sm text-ink/60">
            {loading ? "AI is generating your try-on..." : "Result appears here"}
          </div>
        )}
      </div>
    </div>
  );
}
