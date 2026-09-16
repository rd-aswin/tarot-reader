import { TarotCard } from "./types";

/**
 * Generates an unbiased random integer in the range [0, max)
 * Eliminates modulo bias using rejection sampling backed by Web Crypto API
 */
function getSecureRandomInt(max: number): number {
  if (typeof window === "undefined" || !window.crypto) {
    return Math.floor(Math.random() * max);
  }

  const array = new Uint32Array(1);
  const maxSafe = Math.floor(0xffffffff / max) * max;

  let randomValue: number;
  do {
    window.crypto.getRandomValues(array);
    randomValue = array[0];
  } while (randomValue >= maxSafe);

  return randomValue % max;
}

/**
 * Executes a cryptographically secure Fisher-Yates shuffle on the tarot deck
 */
export function shuffleDeck(deck: TarotCard[]): TarotCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Determines card reversal probability (Default 25% for balanced reflection)
 */
export function isCardReversed(reversalChance = 0.25): boolean {
  if (typeof window === "undefined" || !window.crypto) {
    return Math.random() < reversalChance;
  }
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] / 0xffffffff < reversalChance;
}
