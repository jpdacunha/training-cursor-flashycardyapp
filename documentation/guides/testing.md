# Testing Implementation

## Overview

This project uses Vitest for automated testing with a comprehensive test suite covering all database operations. The test suite includes reusable test datasets for consistent and realistic testing.

## Test Files

### Database Query Tests

**Files**: 
- `db/test/deck-queries.test.ts` - Deck operations (217 lines, multiple test scenarios)
- `db/test/card-queries.test.ts` - Card operations (360 lines, comprehensive coverage)
- `db/test/test-data.test.ts` - Integration tests using reusable datasets

All test files include:
- **Automatic cleanup** that empties all tables before each test
- **Sequence reset** to ensure consistent test IDs starting from 1
- **Isolation** - Tests don't interfere with each other

### Test Utilities

**File**: `db/test/test-utils.ts`
- `cleanupDatabase()` - Empties all tables and resets sequences

### Reusable Test Datasets

**File**: `db/test/test-data.ts`

Pre-defined, realistic test datasets for consistent testing:

1. **English to Spanish Vocabulary Deck** (20 cards)
   - Common English words with Spanish translations
   - For language learning scenarios

2. **French History Quiz Deck** (20 cards)
   - Questions and answers about French history
   - For quiz/study card scenarios

See [Database Test Data Documentation](../db/test/README.md) for detailed usage.

## Test Categories

### Deck Query Tests (`deck-queries.test.ts`)

**Create Operations**
- ✓ Create a new deck
- ✓ Create a deck without description
- ✓ Create multiple decks for same user

**Read Operations**
- ✓ Get all decks for a user
- ✓ Return empty array for user with no decks
- ✓ Get a deck by ID with ownership check
- ✓ Return undefined for non-existent deck
- ✓ Isolate decks by user

**Update Operations**
- ✓ Update deck title
- ✓ Update deck description
- ✓ Update both title and description
- ✓ Update updatedAt timestamp

**Delete Operations**
- ✓ Delete a deck
- ✓ Remove deck from user deck list
- ✓ Only delete specified deck

**Edge Cases**
- ✓ Handle special characters in title
- ✓ Handle empty description
- ✓ Handle very long title

### Card Query Tests (`card-queries.test.ts`)

**Create Operations**
- ✓ Create a single card
- ✓ Create multiple cards for a deck
- ✓ Create multiple cards in bulk
- ✓ Auto-increment card IDs

**Read Operations**
- ✓ Get all cards for a deck
- ✓ Return empty array for deck with no cards
- ✓ Get a card by ID
- ✓ Return undefined for non-existent card
- ✓ Get card count for a deck
- ✓ Return 0 for empty deck
- ✓ Isolate cards by deck

**Update Operations**
- ✓ Update card front
- ✓ Update card back
- ✓ Update both front and back
- ✓ Update updatedAt timestamp

**Delete Operations**
- ✓ Delete a card
- ✓ Remove card from deck card list
- ✓ Only delete specified card
- ✓ Cascade delete cards when deck is deleted

**Edge Cases**
- ✓ Handle special characters in card content
- ✓ Handle very long text content
- ✓ Handle multiline text

**Integration Tests**
- ✓ Handle complete CRUD workflow
- ✓ Handle multiple decks with multiple cards

### Test Dataset Integration Tests (`test-data.test.ts`)

**English-Spanish Deck**
- ✓ Create deck with all 20 vocabulary cards
- ✓ Verify card content (Hello/Hola, Thank you/Gracias, etc.)
- ✓ Verify card count

**French History Deck**
- ✓ Create deck with all 20 history question cards
- ✓ Verify historical facts (Revolution 1789, Napoleon, etc.)
- ✓ Verify card count

**Multiple Decks**
- ✓ Create both decks for the same user
- ✓ Isolate cards between both decks

**Dataset Validation**
- ✓ Verify at least 15 cards in each deck
- ✓ Verify all cards have front and back content
- ✓ Verify unique questions in each deck

## Cleanup Mechanism

The `cleanupDatabase()` function runs:
- **Before each test** (`beforeEach`) - ensures test isolation
- **After all tests** (`afterAll`) - guarantees clean state for next run

Cleanup process:
1. Delete all cards (respects foreign key constraints)
2. Delete all decks
3. Reset auto-increment sequences to 1

## Running Tests

### First Time Setup
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Specific Test Files
```bash
# Only deck query tests
npm test -- deck-queries.test.ts

# Only card query tests
npm test -- card-queries.test.ts

# Only test dataset integration tests
npm test -- test-data.test.ts
```

### Watch Mode
Automatically re-run tests when files change:
```bash
npm run test:watch
```

### Test Results Summary

```
✓ deck-queries.test.ts (15 tests)
✓ card-queries.test.ts (26 tests) 
✓ test-data.test.ts (12 tests)
✓ All database tests completed - database cleaned
```

## Configuration

**vitest.config.ts**
- Node environment configuration
- Path alias setup (@/ → project root)
- 30-second timeout for database operations

## Test Structure

Each test follows this pattern:
1. **Setup**: Create test data (in `beforeEach`)
2. **Execute**: Perform the operation being tested
3. **Assert**: Verify the expected results
4. **Cleanup**: Automatic cleanup after each test

## Database Requirements

Make sure you have:
1. A `.env` file with `DATABASE_URL` configured
2. Database migrations applied (`npx drizzle-kit push` or `npx drizzle-kit migrate`)
3. Network access to your database

## Using Test Datasets

### Basic Example

```typescript
import { 
  ENGLISH_SPANISH_DECK, 
  ENGLISH_SPANISH_CARDS, 
  prepareCardsForDeck 
} from './test-data';

it('should create a deck with cards', async () => {
  // Create deck
  const deck = await createDeckInDb(
    ENGLISH_SPANISH_DECK.userId,
    ENGLISH_SPANISH_DECK.title,
    ENGLISH_SPANISH_DECK.description
  );

  // Prepare and create cards
  const cardsData = prepareCardsForDeck(ENGLISH_SPANISH_CARDS, deck.id);
  const cards = await createCardsInDb(cardsData);

  expect(cards).toHaveLength(20);
});
```

### Benefits

1. **Consistent Data**: All tests use the same high-quality datasets
2. **Realistic Content**: Real-world flashcard data (Spanish vocabulary, French history)
3. **Reusability**: No need to recreate test data in every test
4. **Maintainability**: Update test data in one central location
5. **Type Safety**: All datasets are fully typed with TypeScript

See [Database Test Data Documentation](../db/test/README.md) for complete usage guide.

## Benefits

1. **Automated Testing**: No manual verification needed
2. **Clean State**: Each test run starts with empty tables
3. **Test Isolation**: Tests don't interfere with each other
4. **Comprehensive Coverage**: All CRUD operations tested
5. **Reusable Datasets**: High-quality test data available for all tests
6. **Easy to Extend**: Add new tests by following existing patterns
7. **Documentation**: Clear structure and detailed comments

## Adding New Tests

### Using Existing Test Data

1. Import the test data:
```typescript
import { 
  FRENCH_HISTORY_DECK, 
  FRENCH_HISTORY_CARDS, 
  prepareCardsForDeck 
} from './test-data';
```

2. Use in your test:
```typescript
it('should do something with French history cards', async () => {
  const deck = await createDeckInDb(
    FRENCH_HISTORY_DECK.userId,
    FRENCH_HISTORY_DECK.title,
    FRENCH_HISTORY_DECK.description
  );
  
  const cardsData = prepareCardsForDeck(FRENCH_HISTORY_CARDS, deck.id);
  await createCardsInDb(cardsData);
  
  // Your test logic here
});
```

### Creating Custom Test Data

1. Open the appropriate test file (e.g., `db/test/deck-queries.test.ts`)
2. Add new `it()` or `describe()` blocks
3. Follow the existing pattern
4. Run `npm test` to verify

The cleanup mechanism will automatically handle new tests!

### Adding New Reusable Datasets

See the [Database Test Data Documentation](../db/test/README.md#extending-test-data) for instructions on adding new reusable datasets.

