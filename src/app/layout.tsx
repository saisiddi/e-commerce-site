import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";

import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import ClickTracer from "@/components/site/click-tracer";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Atelier Mode | AI Fashion Studio",
  description:
    "Premium AI-powered fashion ecommerce with botanical luxury styling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <ClickTracer />
            <div className="grain-overlay" />
            <Navbar />
            <main className="mx-auto max-w-7xl px-6 pb-24 pt-12">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
