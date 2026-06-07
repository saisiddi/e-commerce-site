export const runtime = "nodejs";

import { products } from "@/data/products";
import { askAI, parseJSON } from "@/lib/ai";

type TryOnRequest = {
  mode: "image" | "preferences";
  // Image mode fields
  itemType?: string;
  color?: string;
  // Preferences mode fields
  skinTone?: string;
  occasion?: string;
  stylePreference?: string;
  clothingType?: string;
  fashionCategory?: string;
  gender?: string;
  budget?: string;
};

type Accessory = {
  name: string;
  price: number;
  image: string;
  category: string;
};

type RecommendedOutfit = {
  name: string;
  reason: string;
  productIds: string[];
  accessories: Accessory[];
};

type TryOnResponse = {
  outfits: RecommendedOutfit[];
  fashionTip: string;
};

// Curated Unsplash images for premium accessories that match the botanical aesthetic
const ACCESSORIES: Record<string, Accessory[]> = {
  Casual: [
    {
      name: "Sage Canvas Tote",
      price: 45,
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop",
      category: "Bag",
    },
    {
      name: "Minimalist Sneakers",
      price: 95,
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600&auto=format&fit=crop",
      category: "Shoes",
    },
    {
      name: "Amber Sunglasses",
      price: 65,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop",
      category: "Sunglasses",
    },
  ],
  Formal: [
    {
      name: "Ink Leather Loafers",
      price: 150,
      image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop",
      category: "Shoes",
    },
    {
      name: "Minimalist Gold Watch",
      price: 150,
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop",
      category: "Watch",
    },
    {
      name: "Sage Leather Shoulder Bag",
      price: 180,
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop",
      category: "Bag",
    },
  ],
  Festive: [
    {
      name: "Terracotta Silk Scarf",
      price: 80,
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600&auto=format&fit=crop",
      category: "Scarf",
    },
    {
      name: "Gold Hoop Earrings",
      price: 55,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
      category: "Jewelry",
    },
    {
      name: "Clay Leather Mules",
      price: 110,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop",
      category: "Shoes",
    },
  ],
};

function getLocalHeuristicTryOn(req: TryOnRequest): TryOnResponse {
  const isImageMode = req.mode === "image";

  if (isImageMode) {
    const itemType = (req.itemType || "Top").toLowerCase();
    const color = req.color || "Neutral";

    // Determine category matching logic
    const isBottom = ["jeans", "trousers", "pants", "skirt"].includes(itemType);

    const outfits: RecommendedOutfit[] = [
      {
        name: "Botanical Coordinates",
        reason: `Pairing structured tailoring with soft botanical coordinates. The natural earthy hues balance the ${color} ${itemType} beautifully, creating a grounded everyday look.`,
        productIds: isBottom ? ["solace-trench", "ore-silk"] : ["solace-trench", "moss-utility"],
        accessories: [ACCESSORIES.Formal[2], ACCESSORIES.Casual[1]],
      },
      {
        name: "Modern Minimalist",
        reason: `A clean, functional approach that styles the ${color} ${itemType} with premium textures (organic knitwear or denim coordinates) to construct a balanced minimalist silhouette.`,
        productIds: isBottom ? ["echelon-knit", "ore-silk"] : ["wide-leg-jeans", "echelon-knit"],
        accessories: [ACCESSORIES.Formal[1], ACCESSORIES.Casual[2]],
      },
      {
        name: "Textured Fusion Contrast",
        reason: `An elegant contrast that matches your ${color} item with jacquard brocade detailing and flowing organic silk shapes, achieving a contemporary hybrid look.`,
        productIds: isBottom ? ["flora-floral-vest", "gray-wool-cardigan"] : ["floral-cream-skirt", "flora-floral-vest"],
        accessories: [ACCESSORIES.Festive[0], ACCESSORIES.Festive[1]],
      },
    ];

    return {
      outfits,
      fashionTip: `Styling tip: When working with a dominant ${color} item, balance the outfit by anchoring it with organic botanical neutrals like Clay or Stone, and layering with a structured outerwear piece.`,
    };
  } else {
    // Preferences mode
    const occasion = req.occasion || "Casual";
    const skinTone = req.skinTone || "Medium";
    const stylePreference = req.stylePreference || "Minimalist";
    const fashionCategory = req.fashionCategory || "Western";

    // Filter products logically
    let selectedProducts: string[] = [];
    let skinToneComment = "";
    let occasionAccessories = ACCESSORIES.Casual;

    if (skinTone === "Fair") {
      skinToneComment = "The botanical depth of Ink and Sage contrasts beautifully with fair undertones.";
    } else if (skinTone === "Medium") {
      skinToneComment = "Warm Earth-toned Clay and Terracotta elements naturally highlight medium, golden undertones.";
    } else {
      skinToneComment = "Striking Terracotta, Cream, and Stone items deliver a rich and radiant contrast for deep skin tones.";
    }

    if (occasion === "Office" || occasion === "Formal") {
      selectedProducts = ["vanta-tailored", "loom-set", "solace-trench"];
      occasionAccessories = ACCESSORIES.Formal;
    } else if (occasion === "Party" || occasion === "Wedding" || occasion === "Festive") {
      selectedProducts = ["marrow-slip", "floral-cream-skirt", "flora-floral-vest"];
      occasionAccessories = ACCESSORIES.Festive;
    } else {
      selectedProducts = ["wide-leg-jeans", "moss-utility", "gray-wool-cardigan"];
      occasionAccessories = ACCESSORIES.Casual;
    }

    // Adjust for fashion category
    let outfit1ProductIds = [selectedProducts[0] || "solace-trench", selectedProducts[1] || "ore-silk"];
    let outfit2ProductIds = [selectedProducts[2] || "echelon-knit", "wide-leg-jeans"];

    if (fashionCategory === "Traditional" || fashionCategory === "Indo-Western") {
      // Create a gorgeous traditional/Indo-Western fusion outfit
      outfit1ProductIds = ["flora-floral-vest", "floral-cream-skirt"];
      outfit2ProductIds = ["marrow-slip", "flora-floral-vest"];
    }

    const outfits: RecommendedOutfit[] = [
      {
        name: `${stylePreference} ${occasion} Look`,
        reason: `${skinToneComment} This outfit is specifically curated to match a ${stylePreference} aesthetic for ${occasion} wear using premium botanical coordinates.`,
        productIds: outfit1ProductIds,
        accessories: [occasionAccessories[0], occasionAccessories[1]],
      },
      {
        name: `Elevated ${occasion} Outfit`,
        reason: `A layered combination curated for a ${occasion} setting. Combines flowing shapes with structured outer layers to enhance depth and drape.`,
        productIds: outfit2ProductIds,
        accessories: [occasionAccessories[2], ACCESSORIES.Formal[1]],
      },
    ];

    return {
      outfits,
      fashionTip: `Styling tip: For a ${stylePreference} ${occasion} outfit, focus on clean lines, tactile organic fabrics (like linen and merino wool), and subtle gold accessories to keep the silhouette clean and premium.`,
    };
  }
}

export async function POST(request: Request) {
  try {
    const req: TryOnRequest = await request.json();

    try {
      // Prepare details of actual catalog to prompt AI
      const catalog = products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        colors: p.colors,
        sizes: p.sizes,
        fabric: p.fabric,
        description: p.description,
      }));

      let systemPrompt = "";
      let userPrompt = "";

      if (req.mode === "image") {
        systemPrompt = `You are an expert fashion stylist AI for 'Atelier Mode', a luxury botanical-inspired fashion label.
We have the following product catalog:
${JSON.stringify(catalog)}

The user uploaded a clothing item of type '${req.itemType}' in color '${req.color}'.
Your task is to recommend 2 to 3 outfit combinations pairing their uploaded item with actual items from our catalog.

For each outfit:
1. Provide a creative name.
2. Provide a styling reason explaining why the combination works with the ${req.color} ${req.itemType}.
3. Select 1 to 2 product IDs from our catalog to include in the outfit.
4. Suggest 1 to 2 high-quality accessories. Choose from:
   - "Sage Canvas Tote" ($45, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop", category: "Bag")
   - "Minimalist Sneakers" ($95, image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600&auto=format&fit=crop", category: "Shoes")
   - "Amber Sunglasses" ($65, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop", category: "Sunglasses")
   - "Ink Leather Loafers" ($150, image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop", category: "Shoes")
   - "Minimalist Gold Watch" ($150, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop", category: "Watch")
   - "Sage Leather Shoulder Bag" ($180, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop", category: "Bag")
   - "Terracotta Silk Scarf" ($80, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600&auto=format&fit=crop", category: "Scarf")
   - "Gold Hoop Earrings" ($55, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop", category: "Jewelry")
   - "Clay Leather Mules" ($110, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop", category: "Shoes")

Return JSON format:
{
  "outfits": [
    {
      "name": "Outfit Name",
      "reason": "Styling rationale...",
      "productIds": ["catalog-product-id-1", "catalog-product-id-2"],
      "accessories": [
        { "name": "Accessory Name", "price": 100, "image": "unsplash-url", "category": "Bag" }
      ]
    }
  ],
  "fashionTip": "A generic styling tip for this outfit..."
}`;
        userPrompt = `Please recommend outfits matching my ${req.color} ${req.itemType}.`;
      } else {
        systemPrompt = `You are an expert fashion stylist AI for 'Atelier Mode', a luxury botanical-inspired fashion label.
We have the following product catalog:
${JSON.stringify(catalog)}

The user has the following preferences:
- Skin Tone: ${req.skinTone}
- Occasion: ${req.occasion}
- Style Preference: ${req.stylePreference}
- Clothing Type: ${req.clothingType}
- Fashion Category: ${req.fashionCategory}
- Gender: ${req.gender || "Any"}
- Budget: ${req.budget || "Any"}

Your task is to recommend 2 to 3 outfit combinations that pair items from our catalog to match their preferences.
Explain why each outfit was selected based on their skin tone, style preference, and the occasion. Suggest accessories and include a general fashion tip.

Return JSON format:
{
  "outfits": [
    {
      "name": "Outfit Name",
      "reason": "Selection rationale referring to skin tone, occasion, category etc...",
      "productIds": ["catalog-product-id-1", "catalog-product-id-2"],
      "accessories": [
        { "name": "Accessory Name", "price": 100, "image": "unsplash-url", "category": "Bag" }
      ]
    }
  ],
  "fashionTip": "A general fashion tip for these preferences..."
}`;
        userPrompt = `Please recommend outfits matching my preferences.`;
      }

      const response = await askAI({
        system: systemPrompt,
        messages: [{ content: userPrompt }],
      });

      const parsed = parseJSON<TryOnResponse>(response);
      if (parsed?.outfits?.length) {
        // Validate catalog IDs exist
        const cleanedOutfits = parsed.outfits.map((o) => ({
          ...o,
          productIds: o.productIds.filter((id) => products.some((p) => p.id === id)),
        })).filter((o) => o.productIds.length > 0);

        if (cleanedOutfits.length > 0) {
          return Response.json({
            outfits: cleanedOutfits,
            fashionTip: parsed.fashionTip || "Keep styling simple and textured.",
          });
        }
      }
    } catch {
      // If AI fails, proceed to local heuristic fallback
    }

    const heuristicResponse = getLocalHeuristicTryOn(req);
    return Response.json(heuristicResponse);
  } catch {
    return Response.json({ error: "Failed to compute recommendations" }, { status: 500 });
  }
}
