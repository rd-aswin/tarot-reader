import { TarotCard } from "./types";

export interface ElementalDignity {
  dominantElement: "fire" | "water" | "air" | "earth" | "spirit" | "mixed";
  synthesisMessage: string;
}

export function calculateElementalDignities(cards: TarotCard[]): ElementalDignity {
  if (!cards || cards.length === 0) {
    return { dominantElement: "mixed", synthesisMessage: "" };
  }

  const counts = {
    fire: 0,
    water: 0,
    air: 0,
    earth: 0,
    spirit: 0,
  };

  cards.forEach((card) => {
    if (counts[card.element] !== undefined) {
      counts[card.element]++;
    }
  });

  const total = cards.length;
  const dominantThreshold = Math.max(2, Math.ceil(total * 0.4)); // 40% dominance rule

  let dominant: keyof typeof counts | "mixed" = "mixed";
  let maxCount = 0;

  (Object.keys(counts) as Array<keyof typeof counts>).forEach((el) => {
    if (counts[el] > maxCount) {
      maxCount = counts[el];
      if (maxCount >= dominantThreshold) {
        dominant = el;
      }
    } else if (counts[el] === maxCount && maxCount >= dominantThreshold) {
      // Tie
      dominant = "mixed";
    }
  });

  // Check for elemental conflict
  const hasFire = counts.fire > 0;
  const hasWater = counts.water > 0;
  const hasAir = counts.air > 0;
  const hasEarth = counts.earth > 0;

  const conflictFireWater = hasFire && hasWater && counts.fire >= total * 0.25 && counts.water >= total * 0.25;
  const conflictAirEarth = hasAir && hasEarth && counts.air >= total * 0.25 && counts.earth >= total * 0.25;

  let message = "";

  const domStr = dominant as string;

  if (domStr === "spirit") {
    message = "Major Arcana dominance: This reading represents profound, unavoidable psychological shifts and soul-level lessons rather than trivial everyday matters.";
  } else if (domStr === "fire") {
    message = "Fire dominance: This spread burns with passion, action, and ambition. The current energy demands bold moves, but beware of burnout or impulsivity.";
  } else if (domStr === "water") {
    message = "Water dominance: A deeply emotional and intuitive reading. Feelings, relationships, and subconscious currents are heavily steering this situation.";
  } else if (domStr === "air") {
    message = "Air dominance: This spread is ruled by intellect, communication, and strategy. Over-analyzing or mental anxiety may be present, requiring clear, objective thought.";
  } else if (domStr === "earth") {
    message = "Earth dominance: Grounded, material, and practical energies prevail. This is a time for slow, steady building, financial pragmatism, and physical well-being.";
  } else {
    message = "A highly balanced or mixed spread, indicating a complex situation requiring integration of emotion, intellect, and practical action.";
  }

  if (conflictFireWater) {
    message += " Note: A Fire/Water conflict is present, suggesting boiling tension between your passionate desires and deep emotional needs.";
  }
  if (conflictAirEarth) {
    message += " Note: An Air/Earth conflict is present, indicating a struggle between idealistic strategic thinking and harsh practical realities.";
  }

  return {
    dominantElement: dominant,
    synthesisMessage: message,
  };
}
