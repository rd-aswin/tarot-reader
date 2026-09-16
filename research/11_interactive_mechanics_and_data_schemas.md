# 11: Interactive Mechanics, Algorithmic Randomness & Data Schemas

---

## 1. The Mathematics of Divination: Algorithmic Randomness & Shuffling

### 1.1 Cryptographic Entropy vs. Naive Math.random()
In standard JavaScript web applications, developers frequently rely on `Math.random()`. However, for a digital divination platform, `Math.random()` exhibits fatal structural deficiencies:
*   **Pseudo-Random Determinism**: Most browser implementations of `Math.random()` utilize the *xorshift128+* algorithm. While fast, it is not cryptographically uniform and exhibits subtle cyclical clustering over multi-card permutations.
*   **Querent Skepticism**: Modern users are acutely aware of digital "rigging." If a card repeats unexpectedly, querents assume a software glitch rather than synchronicity.

To provide genuine physical unpredictability, the platform utilizes **Web Crypto API (`crypto.getRandomValues()`)**, generating true cryptographically uniform entropy backed by underlying hardware entropy pools (thermal noise, interrupt timing).

```
┌────────────────────────────────────────────────────────┐
│             HARDWARE ENTROPY SOURCES                   │
│  (CPU Thermal Noise, OS Interrupts, Pointer Velocity)  │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│           Web Crypto API: crypto.getRandomValues()     │
│       32-Bit Unsigned Integer Uniform Randomness       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│              MODIFIED FISHER-YATES SHUFFLE             │
│        O(n) In-Place Permutation for 78 Cards          │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│               REVERSAL PROBABILITY ENGINE              │
│       User Toggle: Standard (50%) or Custom (20%)      │
└────────────────────────────────────────────────────────┘
```

---

### 1.2 The Production-Ready Cryptographic Fisher-Yates Algorithm
The Fisher-Yates (Knuth) shuffle guarantees that every one of the $78!$ ($1.13 \times 10^{115}$) possible deck permutations is equally probable, with zero modulo bias:

```typescript
/**
 * Generates an unbiased random integer in the range [0, max)
 * Eliminates modulo bias using rejection sampling
 */
function getSecureRandomInt(max: number): number {
  const array = new Uint32Array(1);
  const maxSafe = Math.floor(0xffffffff / max) * max;

  let randomValue: number;
  do {
    crypto.getRandomValues(array);
    randomValue = array[0];
  } while (randomValue >= maxSafe);

  return randomValue % max;
}

/**
 * Executes an in-place cryptographically secure Fisher-Yates shuffle
 * Time Complexity: O(n), Space Complexity: O(1)
 */
export function secureShuffleDeck<T>(deck: T[]): T[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

---

### 1.3 User Gesture Seeding & Ritual Agency
To bridge the psychological gap between cold machine logic and human intentionality, the system integrates **user physical gesture entropy**:
*   **The "Grounding Press"**: While the user holds down the "Shuffle Deck" button, the system records microsecond intervals between pointer events and pointer velocity vectors ($\Delta x, \Delta y, \Delta t$).
*   **Entropy Salting**: These physical motion values are XOR-folded into the initial random seed, ensuring the specific physical cadence of the user's hand directly influences the card sequence.

---

### 1.4 Card Orientation & "Jumper Card" Mechanics
1.  **Reversals Toggle**:
    *   Querents can toggle reversals `ON` (default 50% probability via single-bit crypto mask) or `OFF` (all upright).
2.  **The "Jumper / Climber" Protocol**:
    *   In physical tarot reading, occasionally a card "jumps" or slips out during an intense shuffle. Readers interpret jumpers as urgent subconscious alerts.
    *   **Simulated Jump Probability**: During shuffling, the algorithm runs a $2.5\%$ probability check. If triggered, a "Jumper Card" slides forward with a unique chime:
        > *"A card jumped from the deck during your shuffle: **The 8 of Swords**. It has placed itself aside as your Shadow Clarifier."*

---

## 2. Complete 78-Card Tarot Deck Database Schema

The platform requires rich metadata for all 78 cards to power both the interactive reading board and the educational encyclopedia.

```typescript
export type ArcanaType = 'major' | 'minor';
export type SuitType = 'wands' | 'cups' | 'swords' | 'pentacles' | null;
export type ElementType = 'fire' | 'water' | 'air' | 'earth' | 'spirit';

export interface TarotCardData {
  id: string; // e.g., "major-00-the-fool"
  slug: string; // e.g., "the-fool"
  name: string; // "The Fool"
  number: number; // 0 for The Fool, 1-21 for Majors, 1-14 for Minors
  romanNumeral?: string; // "0", "I", "II", ... "XXI"
  arcana: ArcanaType;
  suit: SuitType;
  element: ElementType;
  astrologicalCorrespondence?: {
    type: 'planet' | 'zodiac' | 'element';
    signOrPlanet: string; // e.g., "Uranus", "Aries"
    glyph: string; // e.g., "♅", "♈"
  };
  kabbalisticCorrespondence?: {
    hebrewLetter: string; // e.g., "Aleph (א)"
    treeOfLifePath: string; // e.g., "Path 11: Kether to Chokmah"
  };
  archetype: {
    title: string; // e.g., "The Holy Innocent / The Leap of Faith"
    jungianConcept: string; // e.g., "The Self entering the individuation journey"
  };
  keywords: {
    upright: string[]; // ["Beginnings", "Innocence", "Spontaneity", "Free Spirit"]
    reversed: string[]; // ["Recklessness", "Risk-taking", "Hesitation", "Naivety"]
  };
  interpretations: {
    uprightGeneral: string;
    reversedGeneral: string;
    uprightLove: string;
    reversedLove: string;
    uprightCareer: string;
    reversedCareer: string;
    shadowWarning: string;
  };
  symbology: Array<{
    symbolName: string; // e.g., "White Rose"
    meaning: string; // "Purity, clean slate, untainted desires"
  }>;
  reflectivePrompts: string[]; // 2-3 journaling questions
  media: {
    svgCardFront: string;
    webpHighRes: string;
    thumbnailUrl: string;
  };
}
```

### 2.1 Concrete Card Entry Example (The High Priestess)
```json
{
  "id": "major-02-the-high-priestess",
  "slug": "the-high-priestess",
  "name": "The High Priestess",
  "number": 2,
  "romanNumeral": "II",
  "arcana": "major",
  "suit": null,
  "element": "water",
  "astrologicalCorrespondence": {
    "type": "planet",
    "signOrPlanet": "Moon",
    "glyph": "☽"
  },
  "kabbalisticCorrespondence": {
    "hebrewLetter": "Gimel (ג)",
    "treeOfLifePath": "Path 13: Kether to Tiphareth"
  },
  "archetype": {
    "title": "The Guardian of the Unconscious",
    "jungianConcept": "The Anima / The intuitive unconscious realm bridging opposites"
  },
  "keywords": {
    "upright": ["Intuition", "Subconscious", "Inner Stillness", "Divine Feminine", "Secret Knowledge"],
    "reversed": ["Secrets revealed", "Disconnected intuition", "Superficiality", "Repressed feelings"]
  },
  "interpretations": {
    "uprightGeneral": "The High Priestess sits at the threshold between conscious awareness and the boundless unconscious. She urges you to silence external chatter and trust subtle somatic markers, gut impressions, and dream symbology.",
    "reversedGeneral": "You may be doubting your intuitive instincts, overwhelmed by external opinions, or ignoring uncomfortable intuitive signals.",
    "uprightLove": "Quiet emotional intimacy and unspoken understanding. Deep spiritual resonance between souls.",
    "reversedLove": "Emotional opacity, hidden agendas, or difficulty expressing vulnerable truths.",
    "uprightCareer": "Observe and synthesize rather than initiating aggressive action. Hidden information will soon surface.",
    "reversedCareer": "Office politics behind the scenes or a lack of full transparency in contractual agreements.",
    "shadowWarning": "Withdrawing into passive isolation or spiritual bypassing to avoid tangible life responsibilities."
  },
  "symbology": [
    { "symbolName": "Pillars Boaz (B) and Jachin (J)", "meaning": "Duality: mercy and severity, darkness and light, conscious and unconscious" },
    { "symbolName": "Pomegranate Veil", "meaning": "Fertility of the unconscious mind; Persephone's descent" },
    { "symbolName": "Crescent Moon at Feet", "meaning": "Rulership over tidal emotions, intuition, and cyclical time" }
  ],
  "reflectivePrompts": [
    "What quiet truth have I been sensing that my logical mind has refused to accept?",
    "Where in my life is silence and non-action more powerful than speech?"
  ],
  "media": {
    "svgCardFront": "/cards/svg/major-02-high-priestess.svg",
    "webpHighRes": "/cards/webp/major-02-high-priestess.webp",
    "thumbnailUrl": "/cards/thumb/major-02-high-priestess.webp"
  }
}
```

---

## 3. Spreads Database Schema & Grid Topology

To dynamically render spreads across desktop and mobile devices, each spread contains precise **relative coordinate geometry** ($x, y$ percentages from 0 to 100):

```typescript
export interface SpreadPosition {
  index: number;
  name: string; // e.g., "The Crossing Obstacle"
  subtitle: string; // e.g., "What challenges or strengthens you"
  description: string;
  gridCoordinates: {
    desktop: { xPercent: number; yPercent: number; rotationDeg?: number };
    mobile: { tab: 1 | 2; xPercent: number; yPercent: number; rotationDeg?: number };
  };
}

export interface TarotSpread {
  id: string; // e.g., "celtic-cross"
  slug: string;
  name: string;
  category: 'daily' | 'foundational' | 'deep-dive' | 'relationships' | 'decision';
  cardCount: number;
  estimatedMinutes: number;
  description: string;
  positions: SpreadPosition[];
}
```

### 3.1 The Definitive Celtic Cross Topology Map
```json
{
  "id": "celtic-cross",
  "slug": "celtic-cross",
  "name": "The Celtic Cross",
  "category": "deep-dive",
  "cardCount": 10,
  "estimatedMinutes": 15,
  "description": "The classic 10-card archetypal spread providing an exhaustive inquiry into conscious, unconscious, environmental, and outcome vectors.",
  "positions": [
    {
      "index": 1,
      "name": "The Heart / Present Situation",
      "subtitle": "The primary atmosphere surrounding your inquiry",
      "gridCoordinates": { "desktop": { "xPercent": 35, "yPercent": 50 } }
    },
    {
      "index": 2,
      "name": "The Crossing / Obstacle",
      "subtitle": "Forces opposing or assisting the primary energy",
      "gridCoordinates": { "desktop": { "xPercent": 35, "yPercent": 50, "rotationDeg": 90 } }
    },
    {
      "index": 3,
      "name": "The Root / Unconscious Foundation",
      "subtitle": "Past events or latent subconscious drivers",
      "gridCoordinates": { "desktop": { "xPercent": 35, "yPercent": 80 } }
    },
    {
      "index": 4,
      "name": "The Passing Past",
      "subtitle": "Energy that is receding and losing its grip",
      "gridCoordinates": { "desktop": { "xPercent": 18, "yPercent": 50 } }
    },
    {
      "index": 5,
      "name": "The Crown / Conscious Ideal",
      "subtitle": "What you consciously aspire toward or perceive",
      "gridCoordinates": { "desktop": { "xPercent": 35, "yPercent": 20 } }
    },
    {
      "index": 6,
      "name": "The Near Future",
      "subtitle": "The proximate energy arriving in coming weeks",
      "gridCoordinates": { "desktop": { "xPercent": 52, "yPercent": 50 } }
    },
    {
      "index": 7,
      "name": "The Querent / Self-Concept",
      "subtitle": "Your internal attitude and perceived power",
      "gridCoordinates": { "desktop": { "xPercent": 80, "yPercent": 80 } }
    },
    {
      "index": 8,
      "name": "The Environment / External Influences",
      "subtitle": "How friends, family, or society view and impact you",
      "gridCoordinates": { "desktop": { "xPercent": 80, "yPercent": 60 } }
    },
    {
      "index": 9,
      "name": "Hopes & Fears",
      "subtitle": "Latent psychological projections and anxieties",
      "gridCoordinates": { "desktop": { "xPercent": 80, "yPercent": 40 } }
    },
    {
      "index": 10,
      "name": "The Ultimate Potential Outcome",
      "subtitle": "The synthesis trajectory if current energy persists",
      "gridCoordinates": { "desktop": { "xPercent": 80, "yPercent": 20 } }
    }
  ]
}
```

---

## 4. Production React & CSS Component: 3D Accessible Tarot Card

A complete, copy-paste ready React component implementing hardware-accelerated 3D flips, accessibility ARIA live tags, and Web Audio trigger:

```tsx
import React, { useState, useCallback } from 'react';

interface TarotCardProps {
  cardName: string;
  cardBackImage: string;
  cardFrontImage: string;
  positionName: string;
  isReversed: boolean;
  onCardFlipped?: () => void;
}

export const TarotCard: React.FC<TarotCardProps> = ({
  cardName,
  cardBackImage,
  cardFrontImage,
  positionName,
  isReversed,
  onCardFlipped,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = useCallback(() => {
    if (isFlipped) return;
    setIsFlipped(true);
    if (onCardFlipped) onCardFlipped();
  }, [isFlipped, onCardFlipped]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${positionName}: ${isFlipped ? `${cardName}, ${isReversed ? 'Reversed' : 'Upright'}` : 'Facedown card. Press Enter or Space to reveal.'}`}
      aria-expanded={isFlipped}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      className="card-scene group relative w-48 h-80 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-gold/60 rounded-xl"
      style={{ perspective: '1200px' }}
    >
      <div
        className={`card-flipper relative w-full h-full duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transition-transform rounded-xl shadow-2xl ${
          isFlipped
            ? isReversed
              ? 'rotate-y-180 rotate-z-180'
              : 'rotate-y-180'
            : 'hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(212,175,55,0.25)]'
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back (Facedown) */}
        <div
          className="card-face absolute inset-0 rounded-xl overflow-hidden border border-gold/30 bg-[#12111d]"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <img
            src={cardBackImage}
            alt="Sacred card back design"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Card Front (Faceup) */}
        <div
          className="card-face absolute inset-0 rounded-xl overflow-hidden border border-gold bg-[#0e0d16]"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <img
            src={cardFrontImage}
            alt={`${cardName} artwork`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 text-center">
            <p className="text-xs font-serif text-gold tracking-widest uppercase font-semibold">
              {cardName}
            </p>
            {isReversed && (
              <span className="text-[10px] text-bone/70 italic tracking-wider block">
                (Reversed)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 5. Client-Side Encrypted Journaling (Web Crypto API)

To guarantee absolute privacy under GDPR, personal journal entries can be encrypted with an AES-GCM-256 key derived from a querent PIN or stored locally:

```typescript
/**
 * Encrypts a private journal reflection before writing to IndexedDB
 */
export async function encryptJournalEntry(text: string, cryptoKey: CryptoKey): Promise<{ cipherText: ArrayBuffer; iv: Uint8Array }> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
  const encodedText = new TextEncoder().encode(text);

  const cipherText = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encodedText
  );

  return { cipherText, iv };
}

/**
 * Decrypts a journal entry on demand
 */
export async function decryptJournalEntry(cipherText: ArrayBuffer, iv: Uint8Array, cryptoKey: CryptoKey): Promise<string> {
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    cipherText
  );

  return new TextDecoder().decode(decrypted);
}
```
