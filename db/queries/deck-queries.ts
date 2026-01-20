import { db } from '@/lib/db';
import { decksTable } from '@/db/schema';
import { eq, and, desc, or, like } from 'drizzle-orm';

/**
 * Get all decks for a specific user
 * @param userId - The Clerk user ID
 * @returns Array of decks owned by the user
 */
export async function getUserDecks(userId: string) {
  return await db
    .select()
    .from(decksTable)
    .where(eq(decksTable.userId, userId))
    .orderBy(desc(decksTable.updatedAt));
}

/**
 * Get a specific deck by ID and verify ownership
 * @param deckId - The deck ID
 * @param userId - The Clerk user ID
 * @returns The deck if found and owned by user, undefined otherwise
 */
export async function getDeckById(deckId: number, userId: string) {
  const [deck] = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
    .limit(1);
  
  return deck;
}

/**
 * Create a new deck
 * @param userId - The Clerk user ID
 * @param title - Deck title
 * @param description - Optional deck description
 * @returns The newly created deck
 */
export async function createDeckInDb(userId: string, title: string, description?: string) {
  const [newDeck] = await db
    .insert(decksTable)
    .values({
      userId,
      title,
      description: description || '',
    })
    .returning();
  
  return newDeck;
}

/**
 * Update an existing deck
 * @param deckId - The deck ID to update
 * @param updates - Object containing fields to update
 * @returns The updated deck
 */
export async function updateDeckInDb(deckId: number, updates: { title?: string; description?: string }) {
  const [updatedDeck] = await db
    .update(decksTable)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(decksTable.id, deckId))
    .returning();
  
  return updatedDeck;
}

/**
 * Delete a deck by ID
 * @param deckId - The deck ID to delete
 */
export async function deleteDeckFromDb(deckId: number) {
  await db.delete(decksTable).where(eq(decksTable.id, deckId));
}

/**
 * Search decks by title or description
 * @param userId - The Clerk user ID
 * @param searchTerm - The search term to look for
 * @returns Array of matching decks
 */
export async function searchDecks(userId: string, searchTerm: string) {
  return await db
    .select()
    .from(decksTable)
    .where(
      and(
        eq(decksTable.userId, userId),
        or(
          like(decksTable.title, `%${searchTerm}%`),
          like(decksTable.description, `%${searchTerm}%`)
        )
      )
    )
    .orderBy(desc(decksTable.updatedAt));
}

/**
 * Get recent decks (last N decks)
 * @param userId - The Clerk user ID
 * @param limit - Maximum number of decks to return (default: 10)
 * @returns Array of recent decks
 */
export async function getRecentDecks(userId: string, limit: number = 10) {
  return await db
    .select()
    .from(decksTable)
    .where(eq(decksTable.userId, userId))
    .orderBy(desc(decksTable.updatedAt))
    .limit(limit);
}
