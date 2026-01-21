import { db } from '@/infrastructure/database/connection';
import { decksTable, cardsTable } from '@/infrastructure/database/schema';
import { eq, InferSelectModel } from 'drizzle-orm';
import { TEST_DATASETS, prepareCardsForDeck } from '@/tests/fixtures/test-data';

type Deck = InferSelectModel<typeof decksTable>;

/**
 * Load all test datasets into the database for a specific user
 * @param userId - The Clerk user ID to assign the test data to
 * @returns Object containing the created decks and total cards count
 */
export async function loadTestDataInDb(userId: string) {
  const createdDecks: Deck[] = [];
  let totalCardsCreated = 0;

  // Load English-Spanish deck
  const [englishSpanishDeck] = await db
    .insert(decksTable)
    .values({
      userId,
      title: TEST_DATASETS.englishSpanish.deck.title,
      description: TEST_DATASETS.englishSpanish.deck.description,
    })
    .returning();

  createdDecks.push(englishSpanishDeck);

  // Load English-Spanish cards
  const englishSpanishCards = prepareCardsForDeck(
    TEST_DATASETS.englishSpanish.cards,
    englishSpanishDeck.id
  );
  await db.insert(cardsTable).values(englishSpanishCards);
  totalCardsCreated += englishSpanishCards.length;

  // Load French History deck
  const [frenchHistoryDeck] = await db
    .insert(decksTable)
    .values({
      userId,
      title: TEST_DATASETS.frenchHistory.deck.title,
      description: TEST_DATASETS.frenchHistory.deck.description,
    })
    .returning();

  createdDecks.push(frenchHistoryDeck);

  // Load French History cards
  const frenchHistoryCards = prepareCardsForDeck(
    TEST_DATASETS.frenchHistory.cards,
    frenchHistoryDeck.id
  );
  await db.insert(cardsTable).values(frenchHistoryCards);
  totalCardsCreated += frenchHistoryCards.length;

  return {
    decks: createdDecks,
    totalCards: totalCardsCreated,
  };
}

/**
 * Delete all decks and cards for a specific user
 * @param userId - The Clerk user ID
 */
export async function deleteAllUserDataFromDb(userId: string) {
  // Delete all decks (cards will be cascade deleted)
  await db.delete(decksTable).where(eq(decksTable.userId, userId));
}
