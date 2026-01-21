# AI Card Generation Feature

## Overview

The AI Card Generation feature allows users to automatically generate flashcards for their decks using artificial intelligence. The system uses Google's Gemini AI to create contextually relevant cards based on the deck's title, description, and existing cards.

## Architecture

The implementation follows a clean, LLM-agnostic architecture that makes it easy to switch between different AI providers:

```
┌─────────────────────────┐
│  CompleteDeckDialog     │  (UI Component)
│  - Config               │
│  - Preview              │
│  - Save                 │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│  generateCards()        │  (Server Action)
│  - Auth                 │
│  - Validate             │
│  - Generate             │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│  LLMService Interface   │  (Abstraction Layer)
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│  GeminiService          │  (Provider Implementation)
│  - Build prompt         │
│  - Call API             │
│  - Parse response       │
└─────────────────────────┘
```

## File Structure

```
lib/
├── services/
│   └── llm/
│       ├── types.ts              # LLM service interfaces and types
│       ├── gemini-service.ts     # Gemini implementation
│       └── index.ts              # Service factory
└── actions/
    ├── ai-card-actions.ts        # AI generation server action
    └── card-actions.ts           # Card CRUD actions (includes bulkCreateCards)

components/
└── complete-deck-dialog.tsx      # UI component for generation workflow

app/[locale]/decks/[deckId]/
└── deck-detail-client.tsx        # Integrated with Complete Deck button
```

## How It Works

### 1. User Initiates Generation

From the deck detail page, users click the "Complete Deck" button which opens a dialog.

### 2. Configuration

Users specify:
- **Number of cards**: 1-50 cards to generate
- **Language**: The language for the generated cards (English, French, Spanish, etc.)

The system displays:
- Deck title and description
- Number of existing cards

### 3. Generation

When the user clicks "Generate Cards":
1. `generateCards()` server action is called
2. User authentication is verified
3. Deck ownership is confirmed
4. Existing cards are fetched for context
5. LLM service generates cards with:
   - Deck title and description as context
   - Existing cards to avoid duplicates
   - Target language
   - Number of cards requested

### 4. Preview & Edit

Generated cards are displayed in a scrollable list where users can:
- Review all generated cards
- Edit individual cards (front and back)
- Regenerate if not satisfied
- Cancel or proceed to save

### 5. Save to Deck

When user clicks "Add to Deck":
1. `bulkCreateCards()` server action is called
2. All cards are inserted in a single database transaction
3. Page is refreshed to show new cards
4. Success toast notification is displayed

## Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# LLM Configuration
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

## LLM Provider Abstraction

The system is designed to support multiple LLM providers. To add a new provider:

### 1. Create Provider Implementation

```typescript
// lib/services/llm/openai-service.ts
import { LLMService, GenerateCardsInput, GenerateCardsResponse } from "./types";

export class OpenAIService implements LLMService {
  constructor(apiKey: string, model: string = "gpt-4") {
    // Initialize OpenAI client
  }

  getProviderName(): string {
    return "OpenAI";
  }

  async generateCards(input: GenerateCardsInput): Promise<GenerateCardsResponse> {
    // Implementation
  }
}
```

### 2. Update Factory

```typescript
// lib/services/llm/index.ts
import { OpenAIService } from "./openai-service";

export function getLLMService(): LLMService {
  const provider = process.env.LLM_PROVIDER || "gemini";

  switch (provider) {
    case "gemini":
      return new GeminiService(/* ... */);
    
    case "openai":
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error("OPENAI_API_KEY not set");
      return new OpenAIService(apiKey);
    
    // ... other providers
  }
}
```

### 3. Update Environment

```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
```

## Prompt Engineering

The Gemini prompt includes:

1. **Deck Context**: Title and description provide the topic
2. **Existing Cards**: Listed to avoid duplication and maintain consistency
3. **Language**: Target language for generation
4. **Format Instructions**: JSON structure specification
5. **Quality Guidelines**:
   - Educational and appropriate content
   - Varied difficulty levels
   - Clear and concise questions/answers
   - Consistency with deck theme

## Error Handling

The system handles various error scenarios:

### API Errors
- Invalid API key
- Rate limiting
- Network errors
- Quota exceeded

### Validation Errors
- Invalid number of cards (must be 1-50)
- Missing required fields
- Unauthorized access

### Generation Errors
- Malformed JSON response
- Empty results
- Parsing failures

All errors are displayed to users via toast notifications with actionable messages.

## Security

- **Authentication**: All actions require valid Clerk authentication
- **Authorization**: Users can only generate cards for their own decks
- **API Keys**: Stored in environment variables, never exposed to client
- **Server-Side Execution**: All LLM calls happen on the server
- **Input Validation**: Zod schemas validate all inputs

## Performance

- **Bulk Insertion**: Cards are inserted in a single database transaction
- **Efficient Context**: Only necessary data sent to LLM
- **Streaming Support**: Ready for streaming implementations (future)
- **Caching**: Consider implementing prompt caching (future)

## Internationalization

The feature is fully internationalized with support for:
- English (en)
- French (fr)
- Spanish (es)
- German (de)
- Italian (it)
- Portuguese (pt)
- Japanese (ja)
- Chinese (zh)
- Korean (ko)
- Russian (ru)

Both the UI text and generated card content support these languages.

## Testing

### Manual Testing Checklist

- [ ] Generate cards for empty deck
- [ ] Generate cards for deck with existing cards
- [ ] Test with different card counts (1, 10, 50)
- [ ] Test all supported languages
- [ ] Edit cards in preview before saving
- [ ] Regenerate cards
- [ ] Cancel at each step
- [ ] Test error handling (invalid API key, network error)
- [ ] Verify cards appear after saving
- [ ] Test in both English and French UI locales

### Unit Testing

Test the LLM service independently:

```typescript
import { GeminiService } from "@/lib/services/llm/gemini-service";

describe("GeminiService", () => {
  it("should generate cards", async () => {
    const service = new GeminiService("test-key");
    const result = await service.generateCards({
      deckTitle: "Test Deck",
      deckDescription: "Test Description",
      existingCards: [],
      count: 5,
      language: "en",
    });
    
    expect(result.success).toBe(true);
    expect(result.cards).toHaveLength(5);
  });
});
```

## Future Enhancements

1. **Streaming Support**: Stream cards as they're generated
2. **Batch Processing**: Generate cards in background for large requests
3. **Custom Prompts**: Allow users to provide custom generation instructions
4. **Card Templates**: Pre-built templates for common deck types
5. **Quality Scoring**: AI-powered quality assessment of generated cards
6. **Duplicate Detection**: Advanced duplicate detection using embeddings
7. **A/B Testing**: Compare generation quality across providers
8. **Usage Analytics**: Track generation statistics and success rates

## Troubleshooting

### Cards Not Generating

**Symptom**: Error message appears when clicking "Generate Cards"

**Solutions**:
1. Check `GEMINI_API_KEY` is set in `.env`
2. Verify API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Check API quota hasn't been exceeded
4. Review browser console and server logs for errors

### Poor Quality Cards

**Symptom**: Generated cards are not relevant or poorly formatted

**Solutions**:
1. Provide more detailed deck description
2. Add a few example cards manually first
3. Use more specific deck titles
4. Try different languages if applicable
5. Edit cards in preview before saving

### Language Issues

**Symptom**: Cards generated in wrong language

**Solutions**:
1. Verify correct language selected in dropdown
2. Check deck description language matches target
3. Try regenerating with clearer language selection

## Support

For issues or questions:
1. Check this documentation
2. Review [Gemini API documentation](https://ai.google.dev/docs)
3. Verify environment configuration
4. Check server logs for detailed error messages
