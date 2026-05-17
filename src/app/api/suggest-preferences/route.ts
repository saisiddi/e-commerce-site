export const runtime = "nodejs";

import { askAI, parseJSON } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const partial = body.preferences ?? {};

    const options = {
      colorPalette: ["Sage", "Clay", "Stone", "Ink", "Terracotta", "Black", "Navy", "Cream", "Brown", "Blush", "Charcoal"],
      size: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
      fitPreference: ["relaxed", "tailored", "oversized", "fitted", "flowy"],
      occasion: ["casual", "business", "formal", "party", "athletic", "everyday"],
      budget: ["budget", "moderate", "premium", "luxury"],
    };

    const response = await askAI({
      system: `You are a fashion stylist AI. Given a user's partial style preferences, suggest the missing fields. Return JSON: { "suggestions": { "colorPalette"?: string[], "size"?: string, "fitPreference"?: string, "occasion"?: string, "budget"?: string } }. Only include fields the user hasn't chosen yet. Pick from these options: ${JSON.stringify(options)}. Make reasonable style-coherent suggestions.`,
      messages: [
        {
          content: JSON.stringify({ partial }),
        },
      ],
    });

    const parsed = parseJSON<{ suggestions: Record<string, unknown> }>(response);
    const suggestions = parsed?.suggestions ?? {};

    return Response.json({ suggestions });
  } catch {
    return Response.json({ suggestions: {} }, { status: 500 });
  }
}
