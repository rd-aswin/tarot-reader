import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Digital Sanctuary | Contemplative Tarot & Introspective Reflection",
  description:
    "An unhurried digital sanctuary for archetypal exploration, self-reflection, and personal mindfulness through the timeless symbolism of tarot.",
};

import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] selection:bg-[var(--gold-primary)]/30 selection:text-[var(--gold-light)] transition-colors duration-700">
        
        {/* Global Navigation Header */}
        <header className="w-full py-4 px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/80 backdrop-blur-sm sticky top-0 z-50 flex items-center justify-between">
          <Link href="/" className="text-[var(--gold-primary)] font-[family-name:var(--font-cinzel)] text-sm tracking-widest uppercase font-semibold">
            Digital Sanctuary
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/cards" className="text-xs text-[var(--text-muted)] hover:text-[var(--gold-primary)] transition-colors uppercase tracking-widest font-semibold font-[family-name:var(--font-cinzel)] hidden sm:block">
              Card Library
            </Link>
            <ThemeSwitcher />
          </div>
        </header>

        <main className="flex-1 flex flex-col">{children}</main>

        {/* Mandatory Sticky Micro-Disclaimer Footer */}
        <footer className="w-full py-6 px-4 border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)]/90 text-center text-xs text-[var(--text-muted)]">
          <div className="max-w-4xl mx-auto space-y-2">
            <p className="tracking-wide">
              For entertainment, educational, and personal self-reflection purposes only. You must be 18 years of age or older to use this service.
            </p>
            <p className="text-[11px] text-[var(--text-dim)]">
              Tarot readings do not constitute, and must never replace, professional medical, psychiatric, legal, or financial advice. All interpretations are symbolic projective reflections for mindful personal contemplation.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-[var(--text-dim)]">
            <Link href="/terms" className="hover:text-[var(--text-primary)] transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy Policy</Link>
            <Link href="/ethics" className="hover:text-[var(--text-primary)] transition-colors">Code of Ethics</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
