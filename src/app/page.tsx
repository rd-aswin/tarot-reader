"use client";

import React, { useState } from "react";
import { SacredAudioEngine } from "@/lib/audio/soundEngine";
import { MAJOR_ARCANA, SPREADS } from "@/lib/tarot/deck";
import { shuffleDeck, isCardReversed } from "@/lib/tarot/shuffle";
import { TarotCard, SpreadDefinition } from "@/lib/tarot/types";
import { db } from "@/lib/db";
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ShieldAlert, 
  Compass, 
  Check, 
  Feather
} from "lucide-react";

interface DrawnCardState {
  card: TarotCard;
  isReversed: boolean;
  isFlipped: boolean;
  positionTitle: string;
  positionDesc: string;
}

function createReadingRecord(
  spreadName: string,
  question: string,
  cards: Array<{ id: string; name: string; position: string; isReversed: boolean }>,
  reflectionNotes: string
) {
  const generatedId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `rec-${Math.random().toString(36).substring(2)}`;

  return {
    uuid: generatedId,
    createdAt: new Date(),
    spreadType: spreadName,
    question: question || "Open Reflection",
    cards,
    reflectionNotes,
  };
}

export default function SanctuaryHomePage() {
  // Navigation & Lifecycle
  const [hasBegun, setHasBegun] = useState<boolean>(false);
  const [ageConfirmed, setAgeConfirmed] = useState<boolean>(false);
  const [selectedSpread, setSelectedSpread] = useState<SpreadDefinition>(SPREADS[0]);
  const [userQuery, setUserQuery] = useState<string>("");
  
  // Crisis Keywords Interceptor (Derived state)
  const crisisPatterns = /\b(suicide|kill myself|end my life|self harm|overdose|want to die)\b/i;
  const crisisDetected = crisisPatterns.test(userQuery);
  
  // Audio state
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  
  // Card dealing & reading state
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [cardsDealt, setCardsDealt] = useState<boolean>(false);
  const [drawnCards, setDrawnCards] = useState<DrawnCardState[]>([]);
  
  // Journaling state
  const [reflectionNotes, setReflectionNotes] = useState<string>("");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Audio Engine instance
  const audioEngine = typeof window !== "undefined" ? SacredAudioEngine.getInstance() : null;

  // Ceremony Initiation (Web Audio unlock)
  const handleBeginCeremony = async () => {
    if (audioEngine) {
      await audioEngine.initContext();
      audioEngine.playSingingBowl(432);
      audioEngine.startAmbientDrone();
    }
    setHasBegun(true);
  };

  const handleToggleAudio = () => {
    if (audioEngine) {
      const muted = audioEngine.toggleMute();
      setIsAudioMuted(muted);
    }
  };

  // Deck Shuffling & Deal
  const handleStartReading = () => {
    if (!ageConfirmed || crisisDetected) return;

    if (audioEngine) {
      audioEngine.playCardSlide();
    }
    setIsShuffling(true);

    setTimeout(() => {
      const shuffled = shuffleDeck(MAJOR_ARCANA);
      const dealt: DrawnCardState[] = selectedSpread.positions.map((pos, idx) => ({
        card: shuffled[idx],
        isReversed: isCardReversed(0.25),
        isFlipped: false,
        positionTitle: pos.title,
        positionDesc: pos.description,
      }));

      setDrawnCards(dealt);
      setIsShuffling(false);
      setCardsDealt(true);
      if (audioEngine) {
        audioEngine.playSingingBowl(528);
      }
    }, 1200);
  };

  // Card Flip Handler
  const handleFlipCard = (index: number) => {
    if (drawnCards[index].isFlipped) return;

    if (audioEngine) {
      audioEngine.playCardSlide();
      audioEngine.playSingingBowl(432 + index * 48);
    }

    setDrawnCards((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, isFlipped: true } : item))
    );
  };

  // Save to Zero-Knowledge IndexedDB Journal
  const handleSaveReflection = async () => {
    try {
      const cardEntries = drawnCards.map((c) => ({
        id: c.card.id,
        name: c.card.name,
        position: c.positionTitle,
        isReversed: c.isReversed,
      }));

      const newRecord = createReadingRecord(
        selectedSpread.name,
        userQuery,
        cardEntries,
        reflectionNotes
      );

      await db.readings.add(newRecord);
      setSavedSuccess(true);
      if (audioEngine) {
        audioEngine.playSingingBowl(528);
      }
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Failed to save to local IndexedDB:", err);
    }
  };

  const handleResetReading = () => {
    setCardsDealt(false);
    setDrawnCards([]);
    setReflectionNotes("");
    if (audioEngine) {
      audioEngine.playCardSlide();
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start p-4 md:p-8 relative">
      {/* Subtle Ambient Header Navigation */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 border-b border-[rgba(212,175,55,0.15)] mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-[#14141B]">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wider text-[#F4EFE6] font-[family-name:var(--font-cinzel)]">
              THE DIGITAL SANCTUARY
            </h1>
            <p className="text-[11px] text-[#9E9EB2] tracking-wide">
              Contemplative Archetypes & Self-Reflection
            </p>
          </div>
        </div>

        {hasBegun && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleAudio}
              className="p-2 rounded-lg border border-[rgba(212,175,55,0.2)] hover:border-[#D4AF37]/50 bg-[#14141B] text-[#9E9EB2] hover:text-[#F4EFE6] transition-colors"
              aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#D4AF37]" />}
            </button>
            {cardsDealt && (
              <button
                onClick={handleResetReading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(212,175,55,0.2)] hover:border-[#D4AF37]/50 bg-[#14141B] text-xs text-[#9E9EB2] hover:text-[#F4EFE6] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Spread</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* STAGE 1: The Digital Vestibule (Entrance Threshold) */}
      {!hasBegun && (
        <div className="max-w-2xl w-full my-auto text-center space-y-8 py-12 px-6 rounded-2xl scrying-glass animate-in fade-in duration-1000">
          <div className="space-y-4">
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
              Threshold of Contemplation
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-wide text-[#F4EFE6] font-[family-name:var(--font-cormorant)]">
              Step Beyond the Outer Noise
            </h2>
            <p className="text-sm md:text-base text-[#9E9EB2] max-w-lg mx-auto leading-relaxed">
              This space is an intentional sanctuary. We provide no fortune-telling or deterministic guarantees—only a quiet mirror for your subconscious thoughts and personal introspection.
            </p>
          </div>

          <div className="pt-4 flex flex-col items-center gap-4">
            <button
              onClick={handleBeginCeremony}
              className="px-8 py-3.5 rounded-xl text-sm font-semibold tracking-wider text-[#0B0B0E] bg-gradient-to-r from-[#D4AF37] via-[#F5E5A4] to-[#D4AF37] hover:brightness-110 shadow-lg shadow-[#D4AF37]/10 transition-all cursor-pointer font-[family-name:var(--font-cinzel)]"
            >
              BEGIN THE CEREMONY
            </button>
            <span className="text-[11px] text-[#68687D]">
              Audio enabled upon entry • 432Hz ambient resonance
            </span>
          </div>
        </div>
      )}

      {/* STAGE 2: Sanctuary Reading Canvas & Interaction */}
      {hasBegun && (
        <div className="w-full max-w-5xl flex flex-col items-center space-y-10 animate-in fade-in duration-700">
          {/* Crisis Intervention Safety Banner */}
          {crisisDetected && (
            <div className="w-full p-4 rounded-xl border border-red-500/40 bg-red-950/40 text-red-100 text-sm space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-semibold text-red-300">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <span>Immediate Support is Available</span>
              </div>
              <p className="text-xs text-red-200/90 leading-relaxed">
                If you are experiencing overwhelming emotional distress or thoughts of self-harm, please connect with trained, compassionate professionals who can support you right now. Tarot cards are symbolic reflections and cannot provide crisis counseling.
              </p>
              <div className="flex flex-wrap gap-4 pt-1 font-medium text-xs">
                <span>🇺🇸 US & 🇨🇦 Canada: Call or text <strong>988</strong> (Suicide & Crisis Lifeline)</span>
                <span>🇬🇧 UK: Call <strong>111</strong> or <strong>116 123</strong> (Samaritans)</span>
                <span>💬 Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong></span>
              </div>
            </div>
          )}

          {/* Intention Formulation & Setup (Before Deal) */}
          {!cardsDealt && (
            <div className="w-full max-w-2xl space-y-6 scrying-glass p-6 md:p-8 rounded-2xl">
              {/* Question Framing Input */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest text-[#D4AF37] font-[family-name:var(--font-cinzel)]">
                  Focus Your Mind (Optional Inquiry)
                </label>
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="e.g., What internal attitudes are shaping my career crossroads?"
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0B0E] border border-[rgba(212,175,55,0.25)] focus:border-[#D4AF37] focus:outline-none text-[#F4EFE6] placeholder-[#68687D] text-sm"
                />
                <p className="text-[11px] text-[#9E9EB2]">
                  Frame questions around internal personal agency rather than external fortune-telling.
                </p>
              </div>

              {/* Spread Selection */}
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-widest text-[#D4AF37] font-[family-name:var(--font-cinzel)]">
                  Select Spread Geometry
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SPREADS.map((spread) => (
                    <button
                      key={spread.id}
                      onClick={() => setSelectedSpread(spread)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedSpread.id === spread.id
                          ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#F4EFE6]"
                          : "border-[rgba(212,175,55,0.15)] bg-[#14141B]/70 text-[#9E9EB2] hover:border-[rgba(212,175,55,0.35)]"
                      }`}
                    >
                      <div className="font-medium text-xs text-[#F4EFE6] mb-1 font-[family-name:var(--font-cinzel)]">
                        {spread.name}
                      </div>
                      <div className="text-[11px] text-[#9E9EB2] line-clamp-2">
                        {spread.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mandatory Age & Entertainment Scope Acknowledgment */}
              <div className="pt-2 border-t border-[rgba(212,175,55,0.15)]">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={ageConfirmed}
                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#D4AF37] accent-[#D4AF37] cursor-pointer"
                  />
                  <span className="text-xs text-[#9E9EB2] leading-relaxed">
                    I confirm that I am at least <strong className="text-[#F4EFE6]">18 years of age</strong> and understand this reading is offered strictly for <strong className="text-[#F4EFE6]">entertainment, mindfulness, and personal self-reflection</strong>, not as professional advice.
                  </span>
                </label>
              </div>

              {/* Deal Initiation Button */}
              <div className="pt-2 flex justify-center">
                <button
                  disabled={!ageConfirmed || isShuffling || crisisDetected}
                  onClick={handleStartReading}
                  className={`w-full py-3.5 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold font-[family-name:var(--font-cinzel)] transition-all ${
                    ageConfirmed && !crisisDetected
                      ? "bg-gradient-to-r from-[#D4AF37] via-[#F5E5A4] to-[#D4AF37] text-[#0B0B0E] hover:brightness-110 shadow-lg shadow-[#D4AF37]/10 cursor-pointer"
                      : "bg-[#1D1D27] text-[#68687D] cursor-not-allowed border border-[#68687D]/20"
                  }`}
                >
                  {isShuffling ? "CONSECRATING THE CARDS..." : "SHUFFLE & DEAL SPREAD"}
                </button>
              </div>
            </div>
          )}

          {/* Cards Active Board (After Deal) */}
          {cardsDealt && (
            <div className="w-full space-y-10">
              {/* Inquiry Prompt Display */}
              {userQuery && (
                <div className="text-center space-y-1">
                  <span className="text-[11px] text-[#D4AF37] uppercase tracking-widest font-[family-name:var(--font-cinzel)]">
                    Inquiry Focus
                  </span>
                  <p className="text-lg md:text-xl text-[#F4EFE6] font-[family-name:var(--font-cormorant)] italic">
                    &ldquo;{userQuery}&rdquo;
                  </p>
                </div>
              )}

              {/* 3D Card Dealing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                {drawnCards.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center space-y-3 w-full max-w-[240px]">
                    <div className="text-center space-y-0.5">
                      <span className="text-[11px] font-semibold tracking-wider text-[#D4AF37] uppercase font-[family-name:var(--font-cinzel)]">
                        {item.positionTitle}
                      </span>
                      <p className="text-[11px] text-[#9E9EB2] line-clamp-1">
                        {item.positionDesc}
                      </p>
                    </div>

                    {/* 3D Perspective Card Flipper */}
                    <div 
                      onClick={() => handleFlipCard(idx)}
                      className={`card-scene w-[200px] h-[340px] cursor-pointer group`}
                    >
                      <div
                        className={`card-flipper w-full h-full relative ${
                          item.isFlipped 
                            ? item.isReversed 
                              ? "is-reversed" 
                              : "is-flipped" 
                            : ""
                        }`}
                      >
                        {/* Card Facedown Back */}
                        <div className="card-face card-face-back flex flex-col items-center justify-center p-4 text-center group-hover:border-[#D4AF37]/60 transition-colors">
                          <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center mb-3">
                            <Compass className="w-6 h-6 text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors" />
                          </div>
                          <span className="text-xs text-[#9E9EB2] tracking-wider uppercase font-[family-name:var(--font-cinzel)]">
                            Tap to Reveal
                          </span>
                        </div>

                        {/* Card Faceup Front */}
                        <div className="card-face card-face-front flex flex-col justify-between p-4 text-left">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-[#D4AF37] font-[family-name:var(--font-cinzel)]">
                              {item.card.romanNumeral}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-[#9E9EB2] border border-[#9E9EB2]/30 px-1.5 py-0.5 rounded">
                              {item.isReversed ? "Reversed" : "Upright"}
                            </span>
                          </div>

                          <div className="my-auto py-4 text-center">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-[#14141B]">
                              <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                            </div>
                            <h3 className="text-base font-semibold text-[#F4EFE6] font-[family-name:var(--font-cinzel)]">
                              {item.card.name}
                            </h3>
                            <span className="text-[11px] text-[#9E9EB2] italic">
                              {item.card.archetype}
                            </span>
                          </div>

                          <div className="text-[11px] text-[#9E9EB2] border-t border-[rgba(212,175,55,0.2)] pt-2 line-clamp-3">
                            {item.isReversed ? item.card.summary.reversed : item.card.summary.upright}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Keywords underneath */}
                    {item.isFlipped && (
                      <div className="flex flex-wrap gap-1 justify-center pt-1 animate-in fade-in">
                        {(item.isReversed ? item.card.keywords.reversed : item.card.keywords.upright).map((kw, kwIdx) => (
                          <span key={kwIdx} className="text-[10px] bg-[#1D1D27] text-[#9E9EB2] px-2 py-0.5 rounded-full border border-[rgba(212,175,55,0.15)]">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* STAGE 3: Synthesis & Zero-Knowledge Journaling */}
              {drawnCards.every((c) => c.isFlipped) && (
                <div className="w-full max-w-2xl mx-auto scrying-glass p-6 md:p-8 rounded-2xl space-y-6 animate-in fade-in duration-1000">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Feather className="w-5 h-5" />
                    <h3 className="text-base font-semibold tracking-wider font-[family-name:var(--font-cinzel)]">
                      Private Reflection Journal
                    </h3>
                  </div>
                  <p className="text-xs text-[#9E9EB2] leading-relaxed">
                    Tarot delivers meaning through what it evokes in your mind. What thoughts, intuitive gut checks, or personal insights did this spread illuminate for you?
                  </p>

                  <textarea
                    rows={4}
                    value={reflectionNotes}
                    onChange={(e) => setReflectionNotes(e.target.value)}
                    placeholder="Write your contemplative notes here. Stored privately on your device via Zero-Knowledge client-side storage..."
                    className="w-full p-4 rounded-xl bg-[#0B0B0E] border border-[rgba(212,175,55,0.25)] focus:border-[#D4AF37] focus:outline-none text-sm text-[#F4EFE6] placeholder-[#68687D]"
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <span className="text-[11px] text-[#68687D]">
                      🔒 Encrypted locally in your browser (IndexedDB). Zero server transmission.
                    </span>
                    <button
                      onClick={handleSaveReflection}
                      className="px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wider text-[#0B0B0E] bg-gradient-to-r from-[#D4AF37] to-[#F5E5A4] hover:brightness-110 transition-all font-[family-name:var(--font-cinzel)] cursor-pointer flex items-center gap-2"
                    >
                      {savedSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-800" />
                          <span>SAVED TO VAULT</span>
                        </>
                      ) : (
                        <span>SAVE TO SANCTUARY</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
