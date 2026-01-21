import { db } from '@/infrastructure/database/connection';
import { decksTable, cardsTable } from '@/infrastructure/database/schema';
import { sql } from 'drizzle-orm';

/**
 * Cleanup function to empty all tables and reset sequences
 * Used by test files to ensure clean state
 */
export async function cleanupDatabase() {
  // Delete all cards first (due to foreign key constraints)
  await db.delete(cardsTable);
  // Delete all decks
  await db.delete(decksTable);
  // Reset sequences to start from 1
  await db.execute(sql`ALTER SEQUENCE decks_id_seq RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE cards_id_seq RESTART WITH 1`);
}
