/**
 * LLM Service Types and Interfaces
 * 
 * This file defines the LLM-agnostic interfaces for card generation services.
 * Any LLM provider (Gemini, OpenAI, Claude, etc.) must implement these interfaces.
 */

/**
 * Represents a generated flashcard
 */
export interface GeneratedCard {
  front: string;
  back: string;
}

/**
 * Existing card structure for context
 */
export interface ExistingCard {
  front: string;
  back: string;
}

/**
 * Input parameters for card generation
 */
export interface GenerateCardsInput {
  deckTitle: string;
  deckDescription: string;
  existingCards: ExistingCard[];
  count: number;
  language: string;
}

/**
 * Response from card generation
 */
export interface GenerateCardsResponse {
  success: boolean;
  cards?: GeneratedCard[];
  error?: string;
}

/**
 * LLM Service Interface
 * 
 * All LLM providers must implement this interface to ensure consistency
 */
export interface LLMService {
  /**
   * Generate flashcards based on deck context
   * @param input - Generation parameters including deck context and preferences
   * @returns Promise with generated cards or error
   */
  generateCards(input: GenerateCardsInput): Promise<GenerateCardsResponse>;
  
  /**
   * Get the name of the LLM provider
   */
  getProviderName(): string;
}

/**
 * Supported LLM providers
 */
export type LLMProvider = "gemini" | "openai" | "claude" | "custom";

/**
 * Configuration for LLM services
 */
export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model?: string;
}
