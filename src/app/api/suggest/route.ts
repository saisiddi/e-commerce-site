export const runtime = "nodejs";

import { products } from "@/data/products";
import { askAI, parseJSON } from "@/lib/ai";

type SuggestPreferences = {
  colorPalette?: string[];
  size?: string;
  fitPreference?: string;
  occasion?: string;
  budget?: string;
};

function budgetThreshold(budget?: string) {
  switch (budget) {
    case "budget": return 200;
    case "moderate": return 350;
    case "premium": return 500;
    case "luxury": return 100000;
    default: return 100000;
  }
}

function mapOccasionToCategories(occasion?: string) {
  switch (occasion) {
    case "casual": return ["Tops", "Pants", "Knitwear"];
    case "business": return ["Sets", "Tops"];
    case "formal": return ["Dresses", "Sets"];
    case "party": return ["Dresses"];
    case "athletic": return ["Pants"];
    case "everyday": return ["Tops", "Pants", "Knitwear", "Dresses"];
    default: return [];
  }
}

function heuristicSuggest(prefs: SuggestPreferences) {
  const maxPrice = budgetThreshold(prefs.budget);
  const desiredCategories = mapOccasionToCategories(prefs.occasion);
  const desiredSize = prefs.size ? prefs.size.toUpperCase() : undefined;
  const desiredColors = prefs.colorPalette?.map((c) => c.toLowerCase()) ?? [];

  const scored = products.map((p) => {
    let score = 0;
    if (desiredSize && p.sizes.some((s) => s.toUpperCase() === desiredSize)) score += 3;
    if (desiredCategories.length && desiredCategories.includes(p.category)) score += 2;
    if (desiredColors.length > 0) {
      const matchCount = p.colors.filter((c) => desiredColors.includes(c.toLowerCase())).length;
      score += matchCount * 1.5;
    }
    if (p.price <= maxPrice) score += 2;
    else score -= Math.min(2, (p.price - maxPrice) / 200);
    if (p.featured) score += 1;
    if (p.trending) score += 0.5;
    return { product: p, score };
  });

  scored.sort((a, b) => {
    if (b.score === a.score) return a.product.price - b.product.price;
    return b.score - a.score;
  });

  return scored.filter((s) => s.score > 0).slice(0, 5).map((s) => s.product);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prefs: SuggestPreferences = body.preferences || {};
    const context = (body.context as string) ?? "shop";

    try {
      const catalog = products.map((p) => ({
        id: p.id, name: p.name, price: p.price, category: p.category,
        colors: p.colors, sizes: p.sizes, fabric: p.fabric,
        featured: p.featured, trending: p.trending, rating: p.rating,
      }));

      const response = await askAI({
        system: `You are a fashion stylist AI. Given user preferences, recommend the best matching products from the catalog. Return JSON: { "suggestions": string[] } where each item is a product id. Pick at most 5 products. Consider color palette, size, fit, occasion, and budget.`,
        messages: [
          {
            content: JSON.stringify({
              userPreferences: prefs,
              context: context === "cart" ? "User is on the cart page and wants complementary items to go with what they already have." : "User is browsing the shop and wants items matching their style.",
              catalog,
            }),
          },
        ],
      });

      const parsed = parseJSON<{ suggestions: string[] }>(response);
      if (parsed?.suggestions?.length) {
        const ids = new Set(parsed.suggestions);
        const suggestions = products.filter((p) => ids.has(p.id)).slice(0, 5);
        if (suggestions.length > 0) {
          return Response.json({ suggestions });
        }
      }
    } catch {
      // AI failed — fall through to heuristic
    }

    const suggestions = heuristicSuggest(prefs);
    return Response.json({ suggestions });
  } catch {
    return Response.json({ error: "Failed to compute suggestions" }, { status: 500 });
  }
}
