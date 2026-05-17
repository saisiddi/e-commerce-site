"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, UserCircle2, LogOut, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Wishlist", href: "/wishlist" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { cart, wishlist } = useCart();
  const [hydrated, setHydrated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="sticky top-0 z-40 border-b border-stone bg-canvas/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
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
          <Link href="/wishlist">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone bg-white/60 hover:border-terracotta hover:text-terracotta transition relative"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
              {hydrated && wishlist.length > 0 && (
                <motion.span
                  key={wishlist.length}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-white text-[10px] font-semibold"
                >
                  {wishlist.length}
                </motion.span>
              )}
            </button>
          </Link>

          <Link href="/cart">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone bg-white/60 hover:border-terracotta hover:text-terracotta transition relative"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {hydrated && cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-white text-[10px] font-semibold"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </Link>

          {user ? (
            <>
              <Link href="/profile" aria-label="Profile" className="hidden md:block">
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
            <Button asChild variant="secondary" size="sm" className="ml-2 hidden md:inline-flex">
              <Link href="/login">Login</Link>
            </Button>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone bg-white/60 md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-stone md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-ink/80 transition hover:bg-clay/50 hover:text-terracotta"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-stone" />
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-ink/80 transition hover:bg-clay/50 hover:text-terracotta"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="rounded-xl px-4 py-3 text-left text-sm font-medium text-ink/80 transition hover:bg-clay/50 hover:text-terracotta"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-ink/80 transition hover:bg-clay/50 hover:text-terracotta"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
