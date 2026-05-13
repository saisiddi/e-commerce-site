"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, UserCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "AI Try-On", href: "/tryon" },
  { label: "Checkout", href: "/checkout" },
];

export function Navbar() {
  return (
    <div className="sticky top-0 z-40 border-b border-stone bg-canvas/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          Atelier Mode
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition hover:text-terracotta"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
          >
            <Link href="/tryon">
              <Sparkles className="h-4 w-4" />
              Try-On Studio
            </Link>
          </Button>
          <Link href="/cart" aria-label="Cart">
            <motion.div
              whileHover={{ y: -2 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone bg-white/60"
            >
              <ShoppingBag className="h-4 w-4" />
            </motion.div>
          </Link>
          <Link href="/profile" aria-label="Profile">
            <motion.div
              whileHover={{ y: -2 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone bg-white/60"
            >
              <UserCircle2 className="h-4 w-4" />
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
