"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { timeout: 10000 } // Fail fast in 10s if rate limited/stalled instead of retrying endlessly
});
const MODEL = "gemini-3.5-flash-lite";

export async function validateIntakeQuestion(query: string): Promise<{ valid: boolean; message?: string }> {
  if (!query || query.trim().length === 0) {
    return { valid: true };
  }

  const prompt = `You are the strict but compassionate ethical guardian of a digital tarot sanctuary.
Your ONLY job is to prevent the system from answering questions that cross the "Four Red Lines" of ethical tarot reading.
Do not hallucinate, do not answer the user's question, and do not provide a reading.

THE FOUR RED LINES:
1. MEDICAL/PSYCHIATRIC: Any questions about physical health, mental illness, diagnosis, pregnancy, or death. (e.g., "Do I have cancer?", "Am I depressed?")
2. LEGAL/JUDICIAL: Any questions about court cases, lawsuits, divorce proceedings, or criminal activity. (e.g., "Will I win my lawsuit?", "Should I sue?")
3. FINANCIAL SPECULATION: Any questions seeking objective financial advice, gambling predictions, or market forecasts. (e.g., "Will Bitcoin go up?", "Should I invest?")
4. THIRD-PARTY SPYING: Any questions attempting to uncover the thoughts, feelings, or secrets of another person without their consent. (e.g., "Is my ex cheating?", "Does my boss hate me?")

OUTPUT FORMAT:
- If the question crosses ANY of these lines: You MUST output exactly "INVALID: [Your response]". The response must be a gentle, 2-sentence explanation of why the sanctuary cannot answer this, immediately followed by a suggestion for a healthier, self-reflective question focused on their own internal agency.
- If the question is purely focused on self-reflection, internal growth, or personal agency, you MUST output exactly "VALID".

User Question: "${query}"`;

  try {
    const response = await ai.interactions.create({
      model: MODEL,
      input: prompt,
    });

    const text = response.output_text?.trim() || "";
    
    if (text.startsWith("INVALID:")) {
      return { 
        valid: false, 
        message: text.replace("INVALID:", "").trim() 
      };
    }
    
    return { valid: true };
  } catch (err) {
    console.error("AI Validation Error:", err);
    return { valid: true }; // Fail open so the user isn't blocked if the API fails
  }
}

export async function synthesizeReading(
  query: string, 
  cards: Array<{ name: string; position: string; isReversed: boolean; summary: string }>
): Promise<string> {
  const cardsText = cards.map(c => 
    `- Position: ${c.position}\n  Card: ${c.name} ${c.isReversed ? '(Reversed)' : ''}\n  Archetype: ${c.summary}`
  ).join("\n\n");

  const prompt = `You are a wise, empathetic psychological facilitator guiding a user through a tarot reading in a quiet digital sanctuary.
CRITICAL RULES:
1. NEVER act like a psychic, fortune-teller, or mystic predicting the objective future.
2. Treat the tarot cards STRICTLY as a "Jungian mirror"—a psychological tool for projecting subconscious thoughts and internal reflections.
3. NEVER provide medical, legal, or financial advice.
4. DO NOT hallucinate cards that were not explicitly provided in the prompt.
5. Use poetic, grounded, and supportive language (e.g., "shadow work", "internal alignment", "subconscious blockages"). Avoid occult jargon.

YOUR TASK:
Synthesize the provided cards into a cohesive, comforting 3-paragraph narrative that directly addresses the user's query.
- Paragraph 1: Acknowledge the user's situation and synthesize the early cards (e.g., Past/Present or Situation/Challenge) to validate their current emotional landscape.
- Paragraph 2: Explore the climax of the reading (e.g., the Advice, Focus, or hidden factors). What internal shifts are the archetypes asking the user to make?
- Paragraph 3: Conclude with an empowering, grounded path forward. Focus entirely on their personal agency and psychological integration.

User Query: "${query || "Seeking general guidance and reflection"}"

Drawn Cards:
${cardsText}`;

  try {
    const response = await ai.interactions.create({
      model: MODEL,
      input: prompt,
    });

    return response.output_text || "The cards remain silent. Sit with their imagery and see what feelings arise.";
  } catch (err) {
    console.error("AI Synthesis Error:", err);
    return "The sanctuary's connection is quiet right now. Take a moment to reflect on the cards' imagery on your own.";
  }
}
