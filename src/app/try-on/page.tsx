"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Upload,
  RotateCcw,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  Clock,
  Check,
  User,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { products } from "@/data/products";

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

type TryOnResult = {
  id: string;
  timestamp: string;
  mode: "image" | "preferences";
  inputSummary: string;
  outfits: RecommendedOutfit[];
  fashionTip: string;
};

export default function TryOnPage() {
  const { user } = useAuth();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { addToast } = useToast();

  const [activeMode, setActiveMode] = useState<"image" | "preferences" | null>(null);

  // Feature 1: Image Mode States
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [detectedType, setDetectedType] = useState("Tops");
  const [detectedColor, setDetectedColor] = useState("Sage");

  // Feature 2: Preferences Mode States
  const [skinTone, setSkinTone] = useState("Medium");
  const [occasion, setOccasion] = useState("Casual");
  const [stylePreference, setStylePreference] = useState("Minimalist");
  const [clothingType, setClothingType] = useState("Shirt");
  const [fashionCategory, setFashionCategory] = useState("Western");
  const [gender, setGender] = useState("Unisex");
  const [budget, setBudget] = useState("Moderate");

  // Loader state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Recommendations result
  const [result, setResult] = useState<TryOnResult | null>(null);
  const [history, setHistory] = useState<TryOnResult[]>(() => {
    if (typeof window !== "undefined") {
      const storedHistory = localStorage.getItem("atelier_try_on_history");
      if (storedHistory) {
        try {
          return JSON.parse(storedHistory);
        } catch (error) {
          console.error("Failed to parse try-on history", error);
        }
      }
    }
    return [];
  });

  // Wishlist and Cart trackers for custom accessories
  const [accessoryWishlisted, setAccessoryWishlisted] = useState<Record<string, boolean>>({});
  const [accessoryAddedToCart, setAccessoryAddedToCart] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update loading step strings
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 4);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setIsScanning(true);
      setScanComplete(false);

      // Simulate Scanning for 2.5s
      setTimeout(() => {
        setIsScanning(false);
        setScanComplete(true);

        // Pre-determine dummy classifications based on file name characteristics or just randomize
        const types = ["Tops", "Pants", "Outerwear", "Knitwear", "Dresses"];
        const colors = ["Sage", "Terracotta", "Ink", "Clay", "Stone", "Black", "Navy", "Cream"];
        
        // Semi-randomly pick
        const typeIndex = Math.abs(file.name.charCodeAt(0)) % types.length;
        const colorIndex = Math.abs(file.name.charCodeAt(file.name.length - 1) || 0) % colors.length;

        setDetectedType(types[typeIndex] || "Tops");
        setDetectedColor(colors[colorIndex] || "Sage");
        addToast("Garment details analyzed!", "success");
      }, 2500);
    }
  };

  // Generate outfit recommendations from API
  const generateRecommendations = async (params: Record<string, string | number | boolean | undefined | null>) => {
    setIsLoading(true);
    setLoadingStep(0);
    setResult(null);

    try {
      const response = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) throw new Error("Failed to load recommendations");

      const data = await response.json();

      const newResult: TryOnResult = {
        id: Math.random().toString(36).substring(2, 11),
        timestamp: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        mode: params.mode as "image" | "preferences",
        inputSummary:
          params.mode === "image"
            ? `${params.color} ${params.itemType}`
            : `${params.stylePreference} • ${params.occasion} • ${params.fashionCategory}`,
        outfits: data.outfits,
        fashionTip: data.fashionTip,
      };

      setResult(newResult);

      // Save to history if logged in
      if (user) {
        const updatedHistory = [newResult, ...history].slice(0, 10);
        setHistory(updatedHistory);
        localStorage.setItem("atelier_try_on_history", JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error(error);
      addToast("Failed to generate recommendations. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSubmit = () => {
    generateRecommendations({
      mode: "image",
      itemType: detectedType,
      color: detectedColor,
    });
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateRecommendations({
      mode: "preferences",
      skinTone,
      occasion,
      stylePreference,
      clothingType,
      fashionCategory,
      gender,
      budget,
    });
  };

  const handleToggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      addToast("Item removed from wishlist", "info");
    } else {
      addToWishlist(productId);
      addToast("Item added to wishlist", "success");
    }
  };

  const handleAccessoryWishlist = (name: string) => {
    setAccessoryWishlisted((prev) => {
      const next = { ...prev, [name]: !prev[name] };
      addToast(
        next[name] ? `${name} saved to wishlist` : `${name} removed from wishlist`,
        next[name] ? "success" : "info"
      );
      return next;
    });
  };

  const handleAccessoryAddToCart = (name: string) => {
    setAccessoryAddedToCart((prev) => ({ ...prev, [name]: true }));
    addToast(`${name} added to cart`, "success");
    setTimeout(() => {
      setAccessoryAddedToCart((prev) => ({ ...prev, [name]: false }));
    }, 2000);
  };

  const clearImage = () => {
    setImagePreview(null);
    setScanComplete(false);
  };

  const loadHistoryItem = (item: TryOnResult) => {
    setResult(item);
    setActiveMode(item.mode);
    // Smooth scroll to results
    const resultsElement = document.getElementById("try-on-results");
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const loadingMessages = [
    "Analyzing color tones & coordinates...",
    "Searching the Atelier Mode catalog...",
    "Pairing accessories and layering matches...",
    "Curating custom styling tips...",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Title Header */}
      <div className="text-center md:mb-12 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
          AI Studio
        </span>
        <h1 className="mt-3 font-serif text-3xl md:text-5xl text-ink leading-tight">
          AI Try-On & Stylist
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm md:text-base text-ink/70">
          Upload an image of a garment or select styling preferences to let our AI engineer coordinate the perfect luxury outfits.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <motion.button
          whileHover={{ y: -4 }}
          onClick={() => {
            setActiveMode("image");
            setResult(null);
          }}
          className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 text-center transition-all ${
            activeMode === "image"
              ? "border-terracotta bg-clay/20 shadow-md"
              : "border-stone bg-white/70 hover:border-sage hover:bg-canvas/50"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10 text-terracotta mb-4">
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-ink">Upload Clothing Image</h3>
          <p className="mt-2 text-xs text-ink/60 max-w-xs">
            Analyze your own garment and get matched with catalog coordinates & accessories.
          </p>
        </motion.button>

        <motion.button
          whileHover={{ y: -4 }}
          onClick={() => {
            setActiveMode("preferences");
            setResult(null);
          }}
          className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 text-center transition-all ${
            activeMode === "preferences"
              ? "border-terracotta bg-clay/20 shadow-md"
              : "border-stone bg-white/70 hover:border-sage hover:bg-canvas/50"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage/20 text-sage mb-4">
            <SlidersHorizontal className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-ink">Select Styling Preferences</h3>
          <p className="mt-2 text-xs text-ink/60 max-w-xs">
            Generate custom outfits matching occasion, budget, and skin tone.
          </p>
        </motion.button>
      </div>

      {/* Main Form Working Sections */}
      <AnimatePresence mode="wait">
        {activeMode === "image" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-stone bg-white/60 p-6 md:p-8 shadow-soft mb-12"
          >
            <h2 className="font-serif text-2xl text-ink mb-6">Outfit Matching from Upload</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Left: Drag and Drop Upload */}
              <div className="flex flex-col items-center justify-center">
                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-stone rounded-3xl bg-canvas/30 hover:bg-clay/10 transition cursor-pointer p-6"
                  >
                    <Upload className="h-10 w-10 text-ink/40 mb-3" />
                    <p className="text-sm font-semibold text-ink/80">Click to upload image</p>
                    <p className="text-xs text-ink/50 mt-1">PNG, JPG, or WEBP up to 5MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-80 rounded-3xl overflow-hidden border border-stone bg-canvas">
                    <Image
                      src={imagePreview}
                      alt="Garment Upload"
                      fill
                      className="object-contain"
                    />

                    {/* Laser Scanner Effect */}
                    {isScanning && (
                      <div className="absolute inset-0 bg-ink/10">
                        <motion.div
                          initial={{ top: "0%" }}
                          animate={{ top: "100%" }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut",
                            repeatType: "reverse",
                          }}
                          className="absolute left-0 right-0 h-1 bg-terracotta shadow-[0_0_10px_#c27b66] z-10"
                        />
                        <div className="absolute inset-x-0 bottom-4 flex justify-center z-20">
                          <span className="text-xs font-semibold uppercase tracking-wider text-white bg-ink/80 px-4 py-1.5 rounded-full backdrop-blur-sm animate-pulse">
                            AI Garment Scanning...
                          </span>
                        </div>
                      </div>
                    )}

                    {!isScanning && (
                      <button
                        onClick={clearImage}
                        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white hover:bg-terracotta transition"
                        title="Remove Image"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Detected attributes & triggering recommendations */}
              <div className="flex flex-col justify-center">
                {!scanComplete ? (
                  <div className="text-center md:text-left py-8">
                    <Info className="h-8 w-8 text-sage mx-auto md:mx-0 mb-4" />
                    <h4 className="text-base font-semibold text-ink">Upload a photo to begin</h4>
                    <p className="text-sm text-ink/60 mt-2 max-w-sm">
                      Our vision engine will scan the texture, fabric composition, and dominant colors of your garment to run matching simulations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-canvas/50 p-6 rounded-2xl border border-stone">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-4 w-4 text-terracotta" />
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-ink/80">
                          Verify AI Detection
                        </h4>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label htmlFor="detectedType" className="block text-xs font-medium text-ink/60 mb-1">
                            Garment Type
                          </label>
                          <select
                            id="detectedType"
                            value={detectedType}
                            onChange={(e) => setDetectedType(e.target.value)}
                            className="w-full rounded-full border border-stone bg-white px-4 py-2 text-sm text-ink focus:border-sage focus:outline-none"
                          >
                            <option value="Tops">Tops / Shirts</option>
                            <option value="Pants">Jeans / Pants / Bottoms</option>
                            <option value="Outerwear">Outerwear / Jackets</option>
                            <option value="Knitwear">Knitwear / Sweaters</option>
                            <option value="Dresses">Dresses / Skirts</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="detectedColor" className="block text-xs font-medium text-ink/60 mb-1">
                            Dominant Color
                          </label>
                          <select
                            id="detectedColor"
                            value={detectedColor}
                            onChange={(e) => setDetectedColor(e.target.value)}
                            className="w-full rounded-full border border-stone bg-white px-4 py-2 text-sm text-ink focus:border-sage focus:outline-none"
                          >
                            <option value="Sage">Sage Green</option>
                            <option value="Terracotta">Terracotta Red</option>
                            <option value="Ink">Ink Black</option>
                            <option value="Clay">Clay Neutral</option>
                            <option value="Stone">Stone Grey</option>
                            <option value="Cream">Cream White</option>
                            <option value="Navy">Navy Blue</option>
                            <option value="Brown">Brown / Cocoa</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleImageSubmit}
                      className="w-full rounded-full uppercase tracking-widest text-sm"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Outfit Matches
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeMode === "preferences" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-stone bg-white/60 p-6 md:p-8 shadow-soft mb-12"
          >
            <h2 className="font-serif text-2xl text-ink mb-6">Styling Recommendations Form</h2>
            <form onSubmit={handlePreferencesSubmit} className="grid gap-6 md:grid-cols-3">
              <div>
                <label htmlFor="skinTone" className="block text-xs font-medium text-ink/60 mb-1.5">
                  Skin Tone
                </label>
                <select
                  id="skinTone"
                  value={skinTone}
                  onChange={(e) => setSkinTone(e.target.value)}
                  className="w-full rounded-full border border-stone bg-white px-4 py-2.5 text-sm text-ink focus:border-sage focus:outline-none"
                >
                  <option value="Fair">Fair Undertone</option>
                  <option value="Medium">Medium / Olive Undertone</option>
                  <option value="Dark">Dark / Rich Undertone</option>
                </select>
              </div>

              <div>
                <label htmlFor="occasion" className="block text-xs font-medium text-ink/60 mb-1.5">
                  Occasion
                </label>
                <select
                  id="occasion"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full rounded-full border border-stone bg-white px-4 py-2.5 text-sm text-ink focus:border-sage focus:outline-none"
                >
                  <option value="Casual">Casual Daily</option>
                  <option value="Office">Office / Business</option>
                  <option value="Party">Partywear</option>
                  <option value="Wedding">Wedding Attendance</option>
                  <option value="Festive">Festive Celebrations</option>
                  <option value="Travel">Travel & Outerwear</option>
                </select>
              </div>

              <div>
                <label htmlFor="stylePreference" className="block text-xs font-medium text-ink/60 mb-1.5">
                  Style Preference
                </label>
                <select
                  id="stylePreference"
                  value={stylePreference}
                  onChange={(e) => setStylePreference(e.target.value)}
                  className="w-full rounded-full border border-stone bg-white px-4 py-2.5 text-sm text-ink focus:border-sage focus:outline-none"
                >
                  <option value="Minimalist">Minimalist / Clean</option>
                  <option value="Trendy">Trendy / Statement</option>
                  <option value="Streetwear">Streetwear / Boxy</option>
                  <option value="Formal">Structured / Formal</option>
                  <option value="Elegant">Elegant / Flowing</option>
                </select>
              </div>

              <div>
                <label htmlFor="clothingType" className="block text-xs font-medium text-ink/60 mb-1.5">
                  Clothing Type
                </label>
                <select
                  id="clothingType"
                  value={clothingType}
                  onChange={(e) => setClothingType(e.target.value)}
                  className="w-full rounded-full border border-stone bg-white px-4 py-2.5 text-sm text-ink focus:border-sage focus:outline-none"
                >
                  <option value="Shirt">Shirt / Blouse</option>
                  <option value="T-Shirt">T-Shirt / Knits</option>
                  <option value="Kurti">Kurti / Tunic</option>
                  <option value="Dress">Dress / Co-ord</option>
                  <option value="Saree">Saree / Draped</option>
                  <option value="Jeans">Jeans / Trousers</option>
                  <option value="Pants">Utility Pants</option>
                </select>
              </div>

              <div>
                <label htmlFor="fashionCategory" className="block text-xs font-medium text-ink/60 mb-1.5">
                  Fashion Category
                </label>
                <select
                  id="fashionCategory"
                  value={fashionCategory}
                  onChange={(e) => setFashionCategory(e.target.value)}
                  className="w-full rounded-full border border-stone bg-white px-4 py-2.5 text-sm text-ink focus:border-sage focus:outline-none"
                >
                  <option value="Western">Western wear</option>
                  <option value="Traditional">Traditional wear</option>
                  <option value="Indo-Western">Indo-Western Fusion</option>
                </select>
              </div>

              <div>
                <label htmlFor="gender" className="block text-xs font-medium text-ink/60 mb-1.5">
                  Gender (Optional)
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-full border border-stone bg-white px-4 py-2.5 text-sm text-ink focus:border-sage focus:outline-none"
                >
                  <option value="Unisex">Unisex / All</option>
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-xs font-medium text-ink/60 mb-1.5">
                  Budget Level
                </label>
                <select
                  id="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full rounded-full border border-stone bg-white px-4 py-2.5 text-sm text-ink focus:border-sage focus:outline-none"
                >
                  <option value="Budget">Affordable Basics</option>
                  <option value="Moderate">Moderate Mix</option>
                  <option value="Premium">Premium Selections</option>
                  <option value="Luxury">Luxury Coordinates</option>
                </select>
              </div>

              <div className="md:col-span-2 flex items-end">
                <Button
                  type="submit"
                  className="w-full rounded-full uppercase tracking-widest text-sm py-3"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Suggestions
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Animation Modal */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 border border-stone bg-white/40 backdrop-blur-sm rounded-3xl mb-12">
          <div className="flex space-x-2 mb-6">
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0 }}
              className="h-3.5 w-3.5 rounded-full bg-terracotta"
            />
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
              className="h-3.5 w-3.5 rounded-full bg-sage"
            />
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
              className="h-3.5 w-3.5 rounded-full bg-ink"
            />
          </div>
          <p className="text-sm font-medium text-ink/80 animate-pulse">
            {loadingMessages[loadingStep]}
          </p>
        </div>
      )}

      {/* AI Recommendations Outputs */}
      {result && (
        <div id="try-on-results" className="space-y-12 mb-12 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-stone pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-ink">AI Styling Coordinates</h2>
              <p className="text-xs text-ink/50 mt-1">Generated matching options for: {result.inputSummary}</p>
            </div>
          </div>

          {/* Outfit Options Cards */}
          <div className="grid gap-12 md:grid-cols-2">
            {result.outfits.map((outfit, index) => (
              <div
                key={index}
                className="flex flex-col bg-white/70 border border-stone rounded-3xl p-6 md:p-8 shadow-soft"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-terracotta">
                    Option {index + 1}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl text-ink">{outfit.name}</h3>
                </div>

                <p className="text-sm text-ink/80 leading-relaxed mb-6 bg-clay/15 p-4 rounded-2xl border border-stone/50">
                  {outfit.reason}
                </p>

                {/* Catalog items in the outfit */}
                <h4 className="text-xs font-bold uppercase tracking-widest text-ink/60 mb-3">
                  Catalog Products Included
                </h4>
                <div className="grid gap-4 sm:grid-cols-2 mb-6">
                  {outfit.productIds.map((pId) => {
                    const productItem = products.find((p) => p.id === pId);
                    if (!productItem) return null;

                    const wishlisted = isInWishlist(productItem.id);

                    return (
                      <div
                        key={productItem.id}
                        className="group flex flex-col bg-canvas/40 border border-stone rounded-2xl overflow-hidden p-3 relative"
                      >
                        <div className="relative h-40 w-full overflow-hidden rounded-xl mb-3">
                          <Image
                            src={productItem.image}
                            alt={productItem.name}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                          <button
                            onClick={() => handleToggleWishlist(productItem.id)}
                            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border border-stone text-ink/60 hover:text-red-500 hover:border-red-500 transition"
                          >
                            <Heart
                              className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`}
                            />
                          </button>
                        </div>
                        <h5 className="text-sm font-semibold text-ink leading-tight truncate">
                          {productItem.name}
                        </h5>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-semibold text-ink">${productItem.price}</span>
                          <Link href={`/shop/${productItem.id}`}>
                            <span className="text-xs text-terracotta hover:underline inline-flex items-center gap-0.5">
                              Details <ChevronRight className="h-3 w-3" />
                            </span>
                          </Link>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            addToCart(productItem.id);
                            addToast(`${productItem.name} added to cart`, "success");
                          }}
                          className="mt-3 w-full rounded-full text-xs font-semibold py-1.5"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add to cart
                        </Button>
                      </div>
                    );
                  })}
                </div>

                {/* Curated accessories */}
                <h4 className="text-xs font-bold uppercase tracking-widest text-ink/60 mb-3">
                  Complementary Accessories
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {outfit.accessories.map((accessory) => {
                    const isWish = !!accessoryWishlisted[accessory.name];
                    const isAdded = !!accessoryAddedToCart[accessory.name];

                    return (
                      <div
                        key={accessory.name}
                        className="flex flex-col bg-canvas/40 border border-stone rounded-2xl overflow-hidden p-3 relative"
                      >
                        <div className="relative h-28 w-full overflow-hidden rounded-xl mb-3">
                          <Image
                            src={accessory.image}
                            alt={accessory.name}
                            fill
                            className="object-cover transition duration-500 hover:scale-105"
                          />
                          <button
                            onClick={() => handleAccessoryWishlist(accessory.name)}
                            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border border-stone text-ink/60 hover:text-red-500 hover:border-red-500 transition"
                          >
                            <Heart
                              className={`h-4 w-4 ${isWish ? "fill-red-500 text-red-500" : ""}`}
                            />
                          </button>
                        </div>
                        <h5 className="text-xs font-semibold text-ink truncate">
                          {accessory.name}
                        </h5>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-semibold text-ink/70">
                            {accessory.category}
                          </span>
                          <span className="text-xs font-semibold text-ink">${accessory.price}</span>
                        </div>
                        <Button
                          size="sm"
                          variant={isAdded ? "primary" : "secondary"}
                          onClick={() => handleAccessoryAddToCart(accessory.name)}
                          className="mt-3 w-full rounded-full text-[10px] font-semibold py-1"
                        >
                          {isAdded ? (
                            <span className="flex items-center justify-center gap-1">
                              <Check className="h-3 w-3" /> Added
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-1">
                              <ShoppingBag className="h-3 w-3" /> Add to cart
                            </span>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* General Styling Tip */}
          <div className="flex gap-4 p-6 rounded-3xl border border-terracotta/30 bg-terracotta/5">
            <Sparkles className="h-6 w-6 text-terracotta shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-lg text-ink font-semibold">AI Fashion Tip</h4>
              <p className="text-sm text-ink/80 mt-1 leading-relaxed">{result.fashionTip}</p>
            </div>
          </div>
        </div>
      )}

      {/* History section for logged in users */}
      {user && history.length > 0 && (
        <div className="mt-16 border-t border-stone pt-12">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-5 w-5 text-ink/60" />
            <h2 className="font-serif text-2xl text-ink">Recently Generated Outfits</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {history.map((histItem) => (
              <div
                key={histItem.id}
                onClick={() => loadHistoryItem(histItem)}
                className="group flex flex-col justify-between p-5 border border-stone bg-white/50 hover:bg-clay/20 rounded-2xl cursor-pointer hover:border-terracotta transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                      {histItem.mode === "image" ? "Garment Scan" : "Preferences"}
                    </span>
                    <span className="text-[10px] text-ink/50">{histItem.timestamp}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-ink leading-tight truncate">
                    {histItem.outfits[0]?.name || "Curated Outfit"}
                  </h4>
                  <p className="text-xs text-ink/60 mt-1">Matched: {histItem.inputSummary}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-terracotta group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                    View Matches <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guest history message */}
      {!user && (
        <div className="mt-12 text-center bg-canvas/30 p-6 rounded-2xl border border-stone border-dashed">
          <User className="h-5 w-5 text-ink/40 mx-auto mb-2" />
          <p className="text-xs text-ink/50">
            <Link href="/login?redirect=/try-on" className="text-terracotta font-semibold hover:underline">
              Log in
            </Link>{" "}
            to save your generated outfit configurations to your style history profile.
          </p>
        </div>
      )}
    </div>
  );
}

// Plus sign missing import fix
function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
