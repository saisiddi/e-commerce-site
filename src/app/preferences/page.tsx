"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserPreferences } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PreferencesPage() {
  const { user, updatePreferences } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not logged in
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleChange = (key: keyof UserPreferences, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await updatePreferences(preferences);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/");
  };

  const skinTones = [
    { value: "fair", label: "Fair" },
    { value: "light", label: "Light" },
    { value: "medium", label: "Medium" },
    { value: "tan", label: "Tan" },
    { value: "deep", label: "Deep" },
  ];

  const bodyShapes = [
    { value: "apple", label: "Apple" },
    { value: "pear", label: "Pear" },
    { value: "hourglass", label: "Hourglass" },
    { value: "rectangle", label: "Rectangle" },
    { value: "inverted-triangle", label: "Inverted Triangle" },
  ];

  const sizes = [
    { value: "xxs", label: "XXS" },
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
    { value: "xxl", label: "XXL" },
  ];

  const occasions = [
    { value: "casual", label: "Casual" },
    { value: "business", label: "Business" },
    { value: "formal", label: "Formal" },
    { value: "party", label: "Party" },
    { value: "athletic", label: "Athletic" },
  ];

  const budgets = [
    { value: "budget", label: "Budget ($)" },
    { value: "moderate", label: "Moderate ($$)" },
    { value: "premium", label: "Premium ($$$)" },
    { value: "luxury", label: "Luxury ($$$$)" },
  ];

  return (
    <div className="flex flex-col gap-12">
      <Link href="/">
        <button type="button" className="flex items-center gap-2 text-ink/60 hover:text-ink transition">
          ← Back
        </button>
      </Link>
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-sm uppercase tracking-[0.4em] text-ink/60">
            Personalize
          </p>
          <h1 className="text-4xl font-semibold md:text-5xl">
            Tell us your style
          </h1>
          <p className="text-ink/70 mt-2">
            Help us personalize your shopping experience with AI try-on styling
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Skin Tone */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Skin Tone</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {skinTones.map((tone) => (
                <button
                  key={tone.value}
                  type="button"
                  onClick={() => handleChange("skinTone", tone.value)}
                  className={`px-4 py-3 rounded-lg border-2 transition ${
                    preferences.skinTone === tone.value
                      ? "border-terracotta bg-terracotta/10"
                      : "border-stone hover:border-terracotta/50"
                  }`}
                >
                  <span className="text-sm font-medium">{tone.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Body Shape */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Body Shape</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {bodyShapes.map((shape) => (
                <button
                  key={shape.value}
                  type="button"
                  onClick={() => handleChange("bodyShape", shape.value)}
                  className={`px-4 py-3 rounded-lg border-2 transition ${
                    preferences.bodyShape === shape.value
                      ? "border-terracotta bg-terracotta/10"
                      : "border-stone hover:border-terracotta/50"
                  }`}
                >
                  <span className="text-sm font-medium">{shape.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Size</label>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
              {sizes.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => handleChange("size", size.value)}
                  className={`px-3 py-3 rounded-lg border-2 transition ${
                    preferences.size === size.value
                      ? "border-terracotta bg-terracotta/10"
                      : "border-stone hover:border-terracotta/50"
                  }`}
                >
                  <span className="text-sm font-medium">{size.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Occasion */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Preferred Occasions</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {occasions.map((occ) => (
                <button
                  key={occ.value}
                  type="button"
                  onClick={() => handleChange("occasion", occ.value)}
                  className={`px-4 py-3 rounded-lg border-2 transition ${
                    preferences.occasion === occ.value
                      ? "border-terracotta bg-terracotta/10"
                      : "border-stone hover:border-terracotta/50"
                  }`}
                >
                  <span className="text-sm font-medium">{occ.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Budget</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {budgets.map((budget) => (
                <button
                  key={budget.value}
                  type="button"
                  onClick={() => handleChange("budget", budget.value)}
                  className={`px-4 py-3 rounded-lg border-2 transition ${
                    preferences.budget === budget.value
                      ? "border-terracotta bg-terracotta/10"
                      : "border-stone hover:border-terracotta/50"
                  }`}
                >
                  <span className="text-sm font-medium">{budget.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-col gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Saving..." : "Save Preferences"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSkip}
              disabled={isLoading}
              className="w-full"
            >
              Skip for now
            </Button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
