export type ArcanaType = "major" | "minor";
export type SuitType = "wands" | "cups" | "swords" | "pentacles" | null;
export type ElementType = "fire" | "water" | "air" | "earth" | "spirit";

export interface TarotCard {
  id: string;
  name: string;
  number: number;
  romanNumeral?: string;
  arcana: ArcanaType;
  suit: SuitType;
  element: ElementType;
  keywords: {
    upright: string[];
    reversed: string[];
  };
  archetype: string;
  summary: {
    upright: string;
    reversed: string;
  };
}

export interface SpreadPosition {
  id: string;
  title: string;
  description: string;
}

export interface SpreadDefinition {
  id: string;
  name: string;
  cardCount: number;
  description: string;
  positions: SpreadPosition[];
}
