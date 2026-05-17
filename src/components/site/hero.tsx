"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-sm uppercase tracking-[0.4em] text-ink/60"
        >
          Botanical Atelier
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="mt-6 text-5xl font-semibold md:text-7xl"
        >
          Dress in {" "}
          <em className="font-semibold text-terracotta">living</em> textures with
          style that speaks.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-lg text-ink/70"
        >
          A premium fashion storefront blending botanical minimalism with
          intelligent style curation. Explore and curate a wardrobe
          that flows with you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link href="/shop">
            <Button size="lg">Shop Collection</Button>
          </Link>
          <Link href="/shop">
            <Button variant="secondary" size="lg">
              Explore All
            </Button>
          </Link>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute -left-12 top-16 hidden h-52 w-52 rounded-full bg-clay/50 blur-3xl lg:block" />
        <div className="absolute -bottom-10 right-4 hidden h-60 w-60 rounded-full bg-sage/40 blur-3xl lg:block" />
        <div className="overflow-hidden rounded-t-full border border-stone bg-white/80">
          <Image
            src="https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1200&auto=format&fit=crop"
            alt="Hero editorial"
            width={640}
            height={800}
            className="h-[520px] w-full object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
