"use client";

import React, { useState } from "react";
import { FULL_DECK } from "@/lib/tarot/deck";
import { TarotCard } from "@/lib/tarot/types";

export default function CardsLibraryPage() {
  const [filter, setFilter] = useState<"all" | "major" | "wands" | "cups" | "swords" | "pentacles">("all");
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

  const filteredCards = FULL_DECK.filter((card) => {
    if (filter === "all") return true;
    if (filter === "major") return card.arcana === "major";
    return card.suit?.toLowerCase() === filter;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-1000">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl md:text-4xl text-[var(--gold-primary)] font-[family-name:var(--font-cinzel)] uppercase tracking-widest">
          Archetypal Encyclopedia
        </h1>
        <p className="text-sm text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
          Explore the 78 mirrors of the subconscious. Each card is a portal into universal human experiences, psychological shadows, and spiritual truths.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {["all", "major", "wands", "cups", "swords", "pentacles"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full border text-xs uppercase tracking-widest font-[family-name:var(--font-cinzel)] transition-colors ${
              filter === f
                ? "bg-[var(--gold-primary)] text-[var(--bg-canvas)] border-[var(--gold-primary)]"
                : "bg-transparent text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            onClick={() => setSelectedCard(card)}
            className="group cursor-pointer flex flex-col items-center gap-3"
          >
            <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden border border-[var(--border-subtle)] group-hover:border-[var(--gold-primary)] transition-all duration-500">
              <img
                src={`/cards/${card.imageFile}`}
                alt={card.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-[var(--gold-light)] text-xs tracking-widest uppercase font-semibold">View</span>
              </div>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase font-[family-name:var(--font-cinzel)] text-center">
              {card.name}
            </span>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCard && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedCard(null)}
        >
          <div 
            className="bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-1/2 p-6 flex items-center justify-center bg-[var(--bg-surface)]">
              <img
                src={`/cards/${selectedCard.imageFile}`}
                alt={selectedCard.name}
                className="w-full max-w-sm rounded-xl border border-[var(--border-subtle)] shadow-xl"
              />
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-10 space-y-6">
              <div className="space-y-1">
                <div className="text-[10px] text-[var(--gold-muted)] uppercase tracking-widest">
                  {selectedCard.arcana} Arcana {selectedCard.suit ? `• Suit of ${selectedCard.suit}` : ''}
                </div>
                <h2 className="text-3xl text-[var(--gold-primary)] font-[family-name:var(--font-cinzel)]">
                  {selectedCard.name}
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 font-semibold">Number / Element</h3>
                  <p className="text-sm text-[var(--text-primary)]">{selectedCard.number} • {selectedCard.element}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 font-semibold">Upright (Light)</h3>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">{selectedCard.summary.upright}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 font-semibold">Reversed (Shadow)</h3>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed italic">{selectedCard.summary.reversed}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCard(null)}
                className="mt-8 px-6 py-2 w-full rounded-full border border-[var(--border-subtle)] text-[var(--gold-primary)] text-xs uppercase tracking-widest hover:bg-[var(--border-subtle)] transition-colors"
              >
                Close Grimoire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
