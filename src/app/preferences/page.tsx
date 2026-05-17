"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuth, type UserPreferences } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps = [
  { key: "colorPalette", title: "Colors", subtitle: "Which colors speak to you?" },
  { key: "size", title: "Size", subtitle: "What's your usual size?" },
  { key: "fitPreference", title: "Fit", subtitle: "How do you like your clothes to fit?" },
  { key: "occasion", title: "Occasion", subtitle: "What do you dress for most?" },
  { key: "budget", title: "Budget", subtitle: "What's your style investment range?" },
];

const colorOptions = ["Sage", "Clay", "Stone", "Ink", "Terracotta", "Black", "Navy", "Cream", "Brown", "Blush", "Charcoal"];
const sizeOptions = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
const fitOptions = ["Relaxed", "Tailored", "Oversized", "Fitted", "Flowy"];
const occasionOptions = ["Casual", "Business", "Formal", "Party", "Athletic", "Everyday"];
const budgetOptions = [
  { value: "budget", label: "Budget ($)", desc: "Under $200" },
  { value: "moderate", label: "Moderate ($$)", desc: "$200 - $350" },
  { value: "premium", label: "Premium ($$$)", desc: "$350 - $500" },
  { value: "luxury", label: "Luxury ($$$$)", desc: "$500+" },
];

export default function PreferencesPage() {
  const { user, updatePreferences } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [isLoading, setIsLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const currentStep = steps[step];

  const update = (key: keyof UserPreferences, value: string | string[]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const toggleColor = (color: string) => {
    const current = preferences.colorPalette ?? [];
    const next = current.includes(color)
      ? current.filter((c) => c !== color)
      : [...current, color];
    update("colorPalette", next);
  };

  const next = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleAiSuggest = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/suggest-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
      });
      const data = await res.json();
      const s = data.suggestions ?? {};
      if (s.colorPalette) update("colorPalette", s.colorPalette);
      if (s.size) update("size", s.size);
      if (s.fitPreference) update("fitPreference", s.fitPreference);
      if (s.occasion) update("occasion", s.occasion);
      if (s.budget) update("budget", s.budget);
    } catch {
      // silently fail
    } finally {
      setAiLoading(false);
    }
  };

  const prev = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const skip = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    setError("");
    try {
      await updatePreferences(preferences);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col gap-8">
      <Link href="/">
        <button type="button" className="flex items-center gap-2 text-ink/60 hover:text-ink transition">
          ← Back
        </button>
      </Link>

      {/* AI Suggest button */}
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAiSuggest}
          disabled={aiLoading}
        >
          <Sparkles className={`h-4 w-4 ${aiLoading ? "animate-pulse" : ""}`} />
          {aiLoading ? "Thinking..." : "AI Suggest for me"}
        </Button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-stone/50">
        <motion.div
          className="h-full rounded-full bg-terracotta"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.4em] text-ink/60">
                  Step {step + 1} of {steps.length}
                </p>
                <h1 className="text-3xl font-semibold">{currentStep.title}</h1>
                <p className="text-ink/70">{currentStep.subtitle}</p>
              </div>

              {currentStep.key === "colorPalette" && (
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((color) => {
                    const selected = preferences.colorPalette?.includes(color) ?? false;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleColor(color)}
                        className={`rounded-full border-2 px-5 py-3 text-sm font-medium transition ${
                          selected
                            ? "border-terracotta bg-terracotta/10 text-terracotta"
                            : "border-stone text-ink/70 hover:border-terracotta/60 hover:text-terracotta"
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                  <p className="w-full text-xs text-ink/50 mt-1">Pick all that you love</p>
                </div>
              )}

              {currentStep.key === "size" && (
                <div className="flex flex-wrap gap-3">
                  {sizeOptions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => update("size", s)}
                      className={`rounded-full border-2 px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition ${
                        preferences.size === s
                          ? "border-terracotta bg-terracotta/10 text-terracotta"
                          : "border-stone text-ink/70 hover:border-terracotta/60 hover:text-terracotta"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {currentStep.key === "fitPreference" && (
                <div className="flex flex-wrap gap-3">
                  {fitOptions.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => update("fitPreference", f.toLowerCase())}
                      className={`rounded-full border-2 px-6 py-3 text-sm font-medium transition ${
                        preferences.fitPreference === f.toLowerCase()
                          ? "border-terracotta bg-terracotta/10 text-terracotta"
                          : "border-stone text-ink/70 hover:border-terracotta/60 hover:text-terracotta"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}

              {currentStep.key === "occasion" && (
                <div className="flex flex-wrap gap-3">
                  {occasionOptions.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => update("occasion", o.toLowerCase())}
                      className={`rounded-full border-2 px-6 py-3 text-sm font-medium transition ${
                        preferences.occasion === o.toLowerCase()
                          ? "border-terracotta bg-terracotta/10 text-terracotta"
                          : "border-stone text-ink/70 hover:border-terracotta/60 hover:text-terracotta"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              )}

              {currentStep.key === "budget" && (
                <div className="grid gap-3">
                  {budgetOptions.map((b) => (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => update("budget", b.value)}
                      className={`rounded-2xl border-2 px-6 py-4 text-left transition ${
                        preferences.budget === b.value
                          ? "border-terracotta bg-terracotta/10"
                          : "border-stone hover:border-terracotta/60"
                      }`}
                    >
                      <p className="font-semibold">{b.label}</p>
                      <p className="text-sm text-ink/60">{b.desc}</p>
                    </button>
                  ))}
                </div>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex items-center justify-between gap-4 pt-4">
                <div className="flex gap-3">
                  {step > 0 && (
                    <Button type="button" variant="ghost" onClick={prev}>
                      ← Back
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={skip}
                    className="text-sm text-ink/50 hover:text-ink transition"
                  >
                    Skip
                  </button>
                  {step < steps.length - 1 ? (
                    <Button type="button" onClick={next}>
                      Next
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleFinish} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Done"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
