"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, UserCircle2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "AI Try-On", href: "/tryon" },
  { label: "Checkout", href: "/checkout" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { cart, wishlist } = useCart();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="sticky top-0 z-40 border-b border-stone bg-canvas/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          Atelier Mode
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {navLinks.map((link) => (
            <motion.div key={link.label} whileHover={{ y: -3 }} className="group">
              <Link
                href={link.href}
                className="flex items-center gap-2 transition text-ink/90 group-hover:text-terracotta"
              >
                <span className="inline-flex h-3 w-3 items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-terracotta/0 group-hover:bg-terracotta transition-all" />
                </span>
                <span className="relative">{link.label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {/* Wishlist */}
          <Link href="/wishlist">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone bg-white/60 hover:border-terracotta hover:text-terracotta transition relative"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
              {hydrated && wishlist.length > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-white text-[10px] font-semibold">
                  {wishlist.length}
                </span>
              )}
            </button>
          </Link>

          {/* Cart */}
          <Link href="/cart">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone bg-white/60 hover:border-terracotta hover:text-terracotta transition relative"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {hydrated && cart.length > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-white text-[10px] font-semibold">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </Link>
          
          {user ? (
            <>
              <Link href="/profile" aria-label="Profile">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone bg-white/60"
                  title={user.name}
                >
                  <UserCircle2 className="h-4 w-4" />
                </motion.div>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button asChild variant="secondary" size="sm" className="ml-2">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
