"use server";

import { auth } from "@clerk/nextjs/server";
import { getDeckById } from "@/features/decks/queries";
import { getCardsByDeckId } from "@/features/cards/queries";
import { getLLMService } from "@/features/ai-generation/services/llm-service";
import { z } from "zod";

/**
 * Zod schema for card generation input
 */
const GenerateCardsSchema = z.object({
  deckId: z.number().positive(),
  count: z.number().min(1).max(50),
  language: z.enum(["en", "fr", "es", "de", "it", "pt", "ja", "zh", "ko", "ru"]),
});

type GenerateCardsInput = z.infer<typeof GenerateCardsSchema>;

/**
 * Generate flashcards using AI based on deck context
 * 
 * This action does NOT save cards to the database. It returns generated cards
 * for preview/editing before the user decides to save them.
 * 
 * @param input - Generation parameters
 * @returns Success response with generated cards or error
 */
export async function generateCards(input: GenerateCardsInput) {
  // Step 1: Authenticate
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // Step 2: Validate input
  const validationResult = GenerateCardsSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.flatten().fieldErrors,
    };
  }

  const { deckId, count, language } = validationResult.data;

  try {
    // Step 3: Verify deck ownership
    const deck = await getDeckById(deckId, userId);

    if (!deck) {
      return { success: false, error: "Deck not found or unauthorized" };
    }

    // Step 4: Get existing cards for context
    const existingCards = await getCardsByDeckId(deckId);

    // Step 5: Get LLM service and generate cards
    const llmService = getLLMService();

    const result = await llmService.generateCards({
      deckTitle: deck.title,
      deckDescription: deck.description || "",
      existingCards: existingCards.map((card) => ({
        front: card.front,
        back: card.back,
      })),
      count,
      language,
    });

    if (!result.success || !result.cards) {
      return {
        success: false,
        error: result.error || "Failed to generate cards",
      };
    }

    // Step 6: Return generated cards for preview (NOT saved to DB yet)
    return {
      success: true,
      data: result.cards,
      message: `Generated ${result.cards.length} cards`,
    };
  } catch (error) {
    console.error("Error generating cards:", error);

    let errorMessage = "Failed to generate cards. Please try again.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
}
