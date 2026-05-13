export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  gallery: string[];
  colors: string[];
  sizes: string[];
  description: string;
  fabric: string;
  featured?: boolean;
  trending?: boolean;
};

export const products: Product[] = [
  {
    id: "solace-trench",
    name: "Solace Trench",
    price: 420,
    category: "Outerwear",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
    ],
    colors: ["Sage", "Clay", "Stone"],
    sizes: ["XS", "S", "M", "L"],
    description:
      "A structured trench with a liquid drape, finished in botanical neutrals for an elevated everyday silhouette.",
    fabric: "Recycled twill blend, matte finish",
    featured: true,
    trending: true,
  },
  {
    id: "echelon-knit",
    name: "Echelon Knit",
    price: 260,
    category: "Knitwear",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1503342250614-ca440786a0b8?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
    ],
    colors: ["Ink", "Sage"],
    sizes: ["XS", "S", "M", "L"],
    description:
      "Soft ribbing and a sculpted neckline to anchor minimalist layering with a refined texture.",
    fabric: "Organic merino blend",
    featured: true,
  },
  {
    id: "marrow-slip",
    name: "Marrow Slip",
    price: 310,
    category: "Dresses",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1503341731979-0b8b5ed7f45a?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1200&auto=format&fit=crop",
    ],
    colors: ["Terracotta", "Clay"],
    sizes: ["XS", "S", "M", "L"],
    description:
      "Bias-cut slip dress that floats with a ceramic sheen and botanical hues.",
    fabric: "Plant-based satin",
    trending: true,
  },
  {
    id: "vanta-tailored",
    name: "Vanta Tailored",
    price: 380,
    category: "Sets",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop",
    ],
    colors: ["Ink", "Stone"],
    sizes: ["S", "M", "L"],
    description:
      "Architected tailoring with softened edges to balance sharp lines with gentle structure.",
    fabric: "Cotton linen suiting",
    trending: true,
  },
  {
    id: "aura-puffer",
    name: "Aura Puffer",
    price: 460,
    category: "Outerwear",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    ],
    colors: ["Sage", "Stone"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Lightweight puffer with sculpted quilting and botanical insulation.",
    fabric: "Recycled nylon shell",
  },
  {
    id: "moss-utility",
    name: "Moss Utility",
    price: 240,
    category: "Pants",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop",
    ],
    colors: ["Sage", "Clay"],
    sizes: ["XS", "S", "M", "L"],
    description:
      "Soft utility pant with an elevated drape and deep botanical pockets.",
    fabric: "Organic cotton twill",
  },
  {
    id: "ore-silk",
    name: "Ore Silk",
    price: 340,
    category: "Tops",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342250614-ca440786a0b8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop",
    ],
    colors: ["Clay", "Stone"],
    sizes: ["XS", "S", "M", "L"],
    description:
      "Fluid silk top with soft luster and a sculpted neckline.",
    fabric: "Mulberry silk",
    featured: true,
  },
  {
    id: "loom-set",
    name: "Loom Set",
    price: 390,
    category: "Sets",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1503341731979-0b8b5ed7f45a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342250614-ca440786a0b8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop",
    ],
    colors: ["Ink", "Sage"],
    sizes: ["S", "M", "L"],
    description:
      "Cropped jacket and tapered trouser set in breathable botanical fibers.",
    fabric: "Linen blend",
  },
];

export const categories = [
  "All",
  "Outerwear",
  "Dresses",
  "Sets",
  "Tops",
  "Pants",
  "Knitwear",
];

export const trendingProducts = products.filter((product) => product.trending);
export const featuredProducts = products.filter((product) => product.featured);
