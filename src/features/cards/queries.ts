import { db } from '@/infrastructure/database/connection';
import { cardsTable, decksTable } from '@/infrastructure/database/schema';
import { eq, and, asc } from 'drizzle-orm';
import { randomBytes } from 'crypto';

const CARD_PUBLIC_ID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function isUniqueViolation(error: unknown): boolean {
  const anyError = error as any;
  return (
    anyError?.code === '23505' ||
    (typeof anyError?.message === 'string' &&
      anyError.message.toLowerCase().includes('duplicate key value'))
  );
}

function generateCardPublicId(length = 10): string {
  const alphabet = CARD_PUBLIC_ID_ALPHABET;
  const alphabetLength = alphabet.length;
  const out: string[] = [];

  // Rejection sampling to avoid modulo bias.
  // 62 * 4 = 248, so we only accept bytes < 248.
  while (out.length < length) {
    const bytes = randomBytes(length);
    for (const byte of bytes) {
      if (byte >= 248) continue;
      out.push(alphabet[byte % alphabetLength]);
      if (out.length === length) break;
    }
  }

  return out.join('');
}

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
    .orderBy(asc(cardsTable.id));
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
  for (let attempt = 0; attempt < 5; attempt++) {
    const publicId = generateCardPublicId(10);

    try {
      const [newCard] = await db
        .insert(cardsTable)
        .values({
          deckId,
          publicId,
          front,
          back,
        })
        .returning();

      return newCard;
    } catch (error) {
      if (isUniqueViolation(error) && attempt < 4) {
        continue;
      }
      throw error;
    }
  }

  // Should be unreachable
  throw new Error('Failed to generate a unique card publicId');
}

/**
 * Create multiple cards at once
 * @param cards - Array of cards to create
 * @returns Array of newly created cards
 */
export async function createCardsInDb(
  cards: Array<{ deckId: number; front: string; back: string }>
) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const used = new Set<string>();
    const cardsWithIds = cards.map((card) => {
      let publicId = generateCardPublicId(10);
      while (used.has(publicId)) {
        publicId = generateCardPublicId(10);
      }
      used.add(publicId);
      return { ...card, publicId };
    });

    try {
      return await db.insert(cardsTable).values(cardsWithIds).returning();
    } catch (error) {
      if (isUniqueViolation(error) && attempt < 4) {
        continue;
      }
      throw error;
    }
  }

  throw new Error('Failed to generate unique card publicIds');
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
    .orderBy(asc(cardsTable.id));
  
  return {
    ...deck,
    cards,
  };
}
