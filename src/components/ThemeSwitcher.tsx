"use client";

import React, { useEffect, useState } from "react";
import { Palette } from "lucide-react";

const THEMES = [
  { id: "default", name: "The Hermetic Sanctuary" },
  { id: "astral-veil", name: "The Astral Veil" },
  { id: "herbalist-grove", name: "The Herbalist's Grove" },
  { id: "ancient-grimoire", name: "The Ancient Grimoire" },
];

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("default");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("tarot-theme") || "default";
    setCurrentTheme(saved);
    if (saved !== "default") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  if (!mounted) return null;

  const cycleTheme = () => {
    const currentIndex = THEMES.findIndex((t) => t.id === currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    const nextTheme = THEMES[nextIndex].id;
    
    setCurrentTheme(nextTheme);
    localStorage.setItem("tarot-theme", nextTheme);
    
    if (nextTheme === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", nextTheme);
    }
  };

  const themeName = THEMES.find((t) => t.id === currentTheme)?.name;

  return (
    <button
      onClick={cycleTheme}
      title={`Current Theme: ${themeName}`}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--gold-primary)] hover:bg-[var(--border-subtle)] transition-colors text-xs font-[family-name:var(--font-cinzel)]"
    >
      <Palette className="w-4 h-4" />
      <span className="hidden sm:inline">{themeName}</span>
    </button>
  );
}
