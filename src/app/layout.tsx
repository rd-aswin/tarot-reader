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
      <body className="min-h-full flex flex-col bg-[#0B0B0E] text-[#F4EFE6] selection:bg-[#D4AF37]/30 selection:text-[#F5E5A4]">
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Mandatory Sticky Micro-Disclaimer Footer */}
        <footer className="w-full py-6 px-4 border-t border-[rgba(212,175,55,0.15)] bg-[#0B0B0E]/90 text-center text-xs text-[#9E9EB2]">
          <div className="max-w-4xl mx-auto space-y-2">
            <p className="tracking-wide">
              For entertainment, educational, and personal self-reflection purposes only. You must be 18 years of age or older to use this service.
            </p>
            <p className="text-[11px] text-[#68687D]">
              Tarot readings do not constitute, and must never replace, professional medical, psychiatric, legal, or financial advice. All interpretations are symbolic projective reflections for mindful personal contemplation.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
