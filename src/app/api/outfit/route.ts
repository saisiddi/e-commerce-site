export const runtime = "nodejs";

import { products } from "@/data/products";

type Preferences = {
  skinTone?: string;
  bodyShape?: string;
  size?: string;
  occasion?: string;
  budget?: string;
};

function mapOccasionToCategories(occasion?: string) {
  switch (occasion) {
    case "casual":
      return ["Tops", "Pants", "Knitwear"];
    case "business":
      return ["Sets", "Tops"];
    case "formal":
      return ["Dresses", "Sets"];
    case "party":
      return ["Dresses"];
    case "athletic":
      return ["Pants"];
    default:
      return [];
  }
}

function budgetThreshold(budget?: string) {
  switch (budget) {
    case "budget":
      return 260; // <=
    case "moderate":
      return 380;
    case "premium":
      return 480;
    case "luxury":
      return 100000; // very high
    default:
      return 100000;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prefs: Preferences = body.preferences || {};

    const desiredCategories = mapOccasionToCategories(prefs.occasion);
    const maxPrice = budgetThreshold(prefs.budget);
    const desiredSize = prefs.size ? prefs.size.toUpperCase() : undefined;

    // Simple heuristic scoring
    const scored = products.map((p) => {
      let score = 0;

      // size match
      if (desiredSize && p.sizes.some((s) => s.toUpperCase() === desiredSize)) {
        score += 4;
      }

      // occasion/category match
      if (desiredCategories.length && desiredCategories.includes(p.category)) {
        score += 3;
      }

      // budget proximity
      if (p.price <= maxPrice) {
        score += 2;
      } else {
        // small penalty for being over budget
        const over = p.price - maxPrice;
        score -= Math.min(2, over / 200);
      }

      // trending/featured boost
      if ((p as any).trending) score += 1;
      if ((p as any).featured) score += 1;

      return { product: p, score };
    });

    // sort by score desc, then price asc
    scored.sort((a, b) => {
      if (b.score === a.score) return a.product.price - b.product.price;
      return b.score - a.score;
    });

    const suggestions = scored.slice(0, 3).map((s) => s.product);

    return Response.json({ suggestions });
  } catch (err) {
    return Response.json({ error: "Failed to compute suggestions" }, { status: 500 });
  }
}
