/**
 * LLM Service Factory
 * 
 * This module provides a factory function to get the appropriate LLM service
 * based on environment configuration.
 */

import type { LLMService, LLMProvider } from "@/core/domains/ai/types";
import { GeminiService } from "./gemini-service";

/**
 * Get the configured LLM service instance
 * 
 * @returns LLMService instance based on environment configuration
 * @throws Error if provider is not configured or unknown
 */
export function getLLMService(): LLMService {
  const provider = (process.env.LLM_PROVIDER || "gemini") as LLMProvider;

  switch (provider) {
    case "gemini": {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error(
          "GEMINI_API_KEY environment variable is not set. Please configure your Gemini API key."
        );
      }

      const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
      return new GeminiService(apiKey, model);
    }

    case "openai":
      throw new Error(
        "OpenAI provider is not yet implemented. Set LLM_PROVIDER=gemini in your environment."
      );

    case "claude":
      throw new Error(
        "Claude provider is not yet implemented. Set LLM_PROVIDER=gemini in your environment."
      );

    case "custom":
      throw new Error(
        "Custom provider requires additional configuration. Set LLM_PROVIDER=gemini in your environment."
      );

    default:
      throw new Error(
        `Unknown LLM provider: ${provider}. Supported providers: gemini, openai, claude, custom.`
      );
  }
}

/**
 * Export types for use in other modules
 */
export type { LLMService, GenerateCardsInput, GenerateCardsResponse, GeneratedCard } from "@/core/domains/ai/types";
