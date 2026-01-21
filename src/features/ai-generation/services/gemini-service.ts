/**
 * Gemini LLM Service Implementation
 * 
 * This service implements the LLMService interface using Google's Gemini API.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  LLMService,
  GenerateCardsInput,
  GenerateCardsResponse,
  GeneratedCard,
} from "@/core/domains/ai/types";

export class GeminiService implements LLMService {
  private genAI: GoogleGenerativeAI;
  private model: string;

  constructor(apiKey: string, model: string = "gemini-1.5-flash") {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = model;
  }

  getProviderName(): string {
    return "Gemini";
  }

  /**
   * Build a comprehensive prompt for card generation
   */
  private buildPrompt(input: GenerateCardsInput): string {
    const { deckTitle, deckDescription, existingCards, count, language } = input;

    let prompt = `You are a flashcard generation assistant. Generate ${count} high-quality flashcards for a deck titled "${deckTitle}".`;

    if (deckDescription) {
      prompt += `\n\nDeck description: ${deckDescription}`;
    }

    prompt += `\n\nLanguage: Generate all cards in ${language}.`;

    if (existingCards.length > 0) {
      prompt += `\n\nThe deck already has ${existingCards.length} cards. Here they are:\n`;
      existingCards.forEach((card, index) => {
        prompt += `${index + 1}. Front: "${card.front}" | Back: "${card.back}"\n`;
      });
      prompt += `\nIMPORTANT: Generate NEW cards that are DIFFERENT from the existing ones. Avoid duplicates and maintain consistency with the existing cards' style and difficulty level.`;
    }

    prompt += `\n\nInstructions:
1. Each card should have a "front" (question/term) and "back" (answer/definition)
2. Cards should be educational and appropriate for studying
3. Vary the difficulty and coverage of topics
4. Maintain consistency with the deck's theme
5. Ensure cards are clear, concise, and useful for learning
6. Generate exactly ${count} cards

Return your response as a valid JSON array with this exact structure:
[
  {
    "front": "Question or term here",
    "back": "Answer or definition here"
  }
]

CRITICAL: Return ONLY the JSON array, no additional text, explanations, or markdown formatting.`;

    return prompt;
  }

  /**
   * Parse and validate the LLM response
   */
  private parseResponse(responseText: string): GeneratedCard[] {
    try {
      // Remove markdown code blocks if present
      let cleanedText = responseText.trim();
      
      // Remove ```json and ``` markers
      cleanedText = cleanedText.replace(/^```json\s*/i, "");
      cleanedText = cleanedText.replace(/^```\s*/i, "");
      cleanedText = cleanedText.replace(/\s*```$/i, "");
      cleanedText = cleanedText.trim();

      const parsed = JSON.parse(cleanedText);

      if (!Array.isArray(parsed)) {
        throw new Error("Response is not an array");
      }

      // Validate each card
      const validCards: GeneratedCard[] = [];
      for (const item of parsed) {
        if (
          typeof item === "object" &&
          item !== null &&
          typeof item.front === "string" &&
          typeof item.back === "string" &&
          item.front.trim().length > 0 &&
          item.back.trim().length > 0
        ) {
          validCards.push({
            front: item.front.trim(),
            back: item.back.trim(),
          });
        }
      }

      return validCards;
    } catch (error) {
      console.error("Failed to parse Gemini response:", error);
      console.error("Response text:", responseText);
      throw new Error("Failed to parse AI response. The response format was invalid.");
    }
  }

  /**
   * Generate flashcards using Gemini API
   */
  async generateCards(input: GenerateCardsInput): Promise<GenerateCardsResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const prompt = this.buildPrompt(input);

      console.log("Sending prompt to Gemini...");
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("Received response from Gemini");

      const cards = this.parseResponse(text);

      if (cards.length === 0) {
        return {
          success: false,
          error: "No valid cards were generated. Please try again.",
        };
      }

      // Limit to requested count in case LLM generated more
      const limitedCards = cards.slice(0, input.count);

      return {
        success: true,
        cards: limitedCards,
      };
    } catch (error) {
      console.error("Gemini card generation error:", error);

      let errorMessage = "Failed to generate cards. Please try again.";

      if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes("API key")) {
          errorMessage = "Invalid API key. Please check your Gemini API configuration.";
        } else if (error.message.includes("quota")) {
          errorMessage = "API quota exceeded. Please try again later.";
        } else if (error.message.includes("parse")) {
          errorMessage = error.message;
        } else {
          errorMessage = `Generation error: ${error.message}`;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
