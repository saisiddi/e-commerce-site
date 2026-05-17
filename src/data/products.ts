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
    image: "/images/products/solace-trench.jpg",
    gallery: [
      "/images/products/solace-trench.jpg",
      "/images/products/solace-trench.jpg",
      "/images/products/solace-trench.jpg",
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
    image: "/images/products/echelon-knit.jpg",
    gallery: [
      "/images/products/echelon-knit.jpg",
      "/images/products/echelon-knit.jpg",
      "/images/products/echelon-knit.jpg",
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
    image: "/images/products/marrow-slip.jpg",
    gallery: [
      "/images/products/marrow-slip.jpg",
      "/images/products/marrow-slip.jpg",
      "/images/products/marrow-slip.jpg",
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
    image: "/images/products/vanta-tailored.jpg",
    gallery: [
      "/images/products/vanta-tailored.jpg",
      "/images/products/vanta-tailored.jpg",
      "/images/products/vanta-tailored.jpg",
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
    image: "/images/products/aura-puffer.jpg",
    gallery: [
      "/images/products/aura-puffer.jpg",
      "/images/products/aura-puffer.jpg",
      "/images/products/aura-puffer.jpg",
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
    image: "/images/products/moss-utility.jpg",
    gallery: [
      "/images/products/moss-utility.jpg",
      "/images/products/moss-utility.jpg",
      "/images/products/moss-utility.jpg",
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
    image: "/images/products/ore-silk.jpg",
    gallery: [
      "/images/products/ore-silk.jpg",
      "/images/products/ore-silk.jpg",
      "/images/products/ore-silk.jpg",
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
    image: "/images/products/loom-set.jpg",
    gallery: [
      "/images/products/loom-set.jpg",
      "/images/products/loom-set.jpg",
      "/images/products/loom-set.jpg",
    ],
    colors: ["Ink", "Sage"],
    sizes: ["S", "M", "L"],
    description:
      "Cropped jacket and tapered trouser set in breathable botanical fibers.",
    fabric: "Linen blend",
  },
  {
    id: "flora-floral-vest",
    name: "Flora Floral Vest",
    price: 185,
    category: "Tops",
    rating: 4.7,
    image: "/images/products/flora-floral-vest.jpg",
    gallery: [
      "/images/products/flora-floral-vest.jpg",
      "/images/products/flora-floral-vest.jpg",
      "/images/products/flora-floral-vest.jpg",
    ],
    colors: ["Black", "Burgundy", "Navy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Timeless black floral brocade vest with vintage charm. Perfect for layering over basics or dresses. Features soft button closures and a flattering tailored fit.",
    fabric: "Jacquard brocade blend",
    featured: true,
  },
  {
    id: "cocoa-vest-blouse",
    name: "Cocoa Tailored Vest Set",
    price: 275,
    category: "Sets",
    rating: 4.8,
    image: "/images/products/cocoa-vest-blouse.jpg",
    gallery: [
      "/images/products/cocoa-vest-blouse.jpg",
      "/images/products/cocoa-vest-blouse.jpg",
      "/images/products/cocoa-vest-blouse.jpg",
    ],
    colors: ["Brown", "Chocolate", "Camel"],
    sizes: ["XS", "S", "M", "L"],
    description:
      "Sophisticated brown quilted vest layered with a cream collared blouse. A versatile set perfect for business casual or elevated everyday wear.",
    fabric: "Quilted cotton blend + cotton poplin",
    trending: true,
  },
  {
    id: "denim-fit-dress",
    name: "Denim Fit & Flare Dress",
    price: 220,
    category: "Dresses",
    rating: 4.9,
    image: "/images/products/denim-fit-dress.jpg",
    gallery: [
      "/images/products/denim-fit-dress.jpg",
      "/images/products/denim-fit-dress.jpg",
      "/images/products/denim-fit-dress.jpg",
    ],
    colors: ["Dark Denim", "Light Denim", "Black"],
    sizes: ["XS", "S", "M", "L"],
    description:
      "Classic dark denim fit-and-flare dress with a sweetheart neckline and tiered ruffle hem. A playful everyday essential.",
    fabric: "Stretch denim",
    trending: true,
  },
  {
    id: "gray-wool-cardigan",
    name: "Gray Wool Cardigan",
    price: 240,
    category: "Knitwear",
    rating: 4.6,
    image: "/images/products/gray-wool-cardigan.jpg",
    gallery: [
      "/images/products/gray-wool-cardigan.jpg",
      "/images/products/gray-wool-cardigan.jpg",
      "/images/products/gray-wool-cardigan.jpg",
    ],
    colors: ["Heather Gray", "Charcoal", "Cream"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Cozy wool cardigan in soft heather gray with a striped lining accent. Perfect for layering and adding texture to any outfit.",
    fabric: "Wool knit",
    featured: true,
  },
  {
    id: "wide-leg-jeans",
    name: "Wide-Leg Denim Jean",
    price: 165,
    category: "Pants",
    rating: 4.8,
    image: "/images/products/wide-leg-jeans.jpg",
    gallery: [
      "/images/products/wide-leg-jeans.jpg",
      "/images/products/wide-leg-jeans.jpg",
      "/images/products/wide-leg-jeans.jpg",
    ],
    colors: ["Light Blue", "Medium Blue", "Dark Blue"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Relaxed wide-leg jeans in a soft medium wash. High-rise waist for a flattering silhouette. Perfect with any top.",
    fabric: "100% cotton denim",
  },
  {
    id: "floral-cream-skirt",
    name: "Floral Cream Skirt",
    price: 195,
    category: "Dresses",
    rating: 4.7,
    image: "/images/products/floral-cream-skirt.jpg",
    gallery: [
      "/images/products/floral-cream-skirt.jpg",
      "/images/products/floral-cream-skirt.jpg",
      "/images/products/floral-cream-skirt.jpg",
    ],
    colors: ["Cream", "Blush", "Ivory"],
    sizes: ["XS", "S", "M", "L"],
    description:
      "Ethereal cream skirt with romantic rose print and an A-line silhouette. Perfect for spring and special occasions.",
    fabric: "Cotton voile with floral print",
    featured: true,
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
