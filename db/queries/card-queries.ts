import { db } from '@/lib/db';
import { cardsTable, decksTable } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

/**
 * Get all cards for a specific deck
 * @param deckId - The deck ID
 * @returns Array of cards in the deck
 */
export async function getCardsByDeckId(deckId: number) {
  return await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.deckId, deckId))
    .orderBy(desc(cardsTable.createdAt));
}

/**
 * Get a specific card by ID
 * @param cardId - The card ID
 * @returns The card if found, undefined otherwise
 */
export async function getCardById(cardId: number) {
  const [card] = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.id, cardId))
    .limit(1);
  
  return card;
}

/**
 * Create a new card
 * @param deckId - The deck ID this card belongs to
 * @param front - Front side of the card
 * @param back - Back side of the card
 * @returns The newly created card
 */
export async function createCardInDb(
  deckId: number,
  front: string,
  back: string
) {
  const [newCard] = await db
    .insert(cardsTable)
    .values({
      deckId,
      front,
      back,
    })
    .returning();
  
  return newCard;
}

/**
 * Create multiple cards at once
 * @param cards - Array of cards to create
 * @returns Array of newly created cards
 */
export async function createCardsInDb(
  cards: Array<{ deckId: number; front: string; back: string }>
) {
  return await db
    .insert(cardsTable)
    .values(cards)
    .returning();
}

/**
 * Update an existing card
 * @param cardId - The card ID to update
 * @param updates - Object containing fields to update
 * @returns The updated card
 */
export async function updateCardInDb(
  cardId: number,
  updates: { front?: string; back?: string }
) {
  const [updatedCard] = await db
    .update(cardsTable)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(cardsTable.id, cardId))
    .returning();
  
  return updatedCard;
}

/**
 * Delete a card by ID
 * @param cardId - The card ID to delete
 */
export async function deleteCardFromDb(cardId: number) {
  await db.delete(cardsTable).where(eq(cardsTable.id, cardId));
}

/**
 * Delete all cards in a deck
 * @param deckId - The deck ID
 */
export async function deleteCardsByDeckId(deckId: number) {
  await db.delete(cardsTable).where(eq(cardsTable.deckId, deckId));
}

/**
 * Get card count for a deck
 * @param deckId - The deck ID
 * @returns Number of cards in the deck
 */
export async function getCardCount(deckId: number) {
  const cards = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.deckId, deckId));
  
  return cards.length;
}

/**
 * Get deck with all its cards
 * @param deckId - The deck ID
 * @param userId - The Clerk user ID for ownership verification
 * @returns Deck with cards array, or null if not found
 */
export async function getDeckWithCards(deckId: number, userId: string) {
  const [deck] = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
    .limit(1);
  
  if (!deck) {
    return null;
  }
  
  const cards = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.deckId, deckId))
    .orderBy(desc(cardsTable.createdAt));
  
  return {
    ...deck,
    cards,
  };
}
