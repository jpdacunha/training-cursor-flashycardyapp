import 'dotenv/config';
import { describe, it, expect, afterAll, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import { decksTable, cardsTable } from './schema';
import { eq, sql } from 'drizzle-orm';

// Cleanup function to empty all tables
async function cleanupDatabase() {
  // Delete all cards first (due to foreign key constraints)
  await db.delete(cardsTable);
  // Delete all decks
  await db.delete(decksTable);
  // Reset sequences to start from 1
  await db.execute(sql`ALTER SEQUENCE decks_id_seq RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE cards_id_seq RESTART WITH 1`);
}

describe('Database CRUD Operations', () => {
  // Clean database before each test
  beforeEach(async () => {
    await cleanupDatabase();
  });

  // Clean database after all tests complete
  afterAll(async () => {
    await cleanupDatabase();
    console.log('✓ All tables emptied successfully');
  });

  describe('Decks Operations', () => {
    it('should create a new deck', async () => {
      const deck: typeof decksTable.$inferInsert = {
        userId: 'user_test123',
        title: 'Indonesian Language',
        description: 'Learn Indonesian from English',
      };

      const [newDeck] = await db.insert(decksTable).values(deck).returning();

      expect(newDeck).toBeDefined();
      expect(newDeck.id).toBe(1);
      expect(newDeck.title).toBe('Indonesian Language');
      expect(newDeck.userId).toBe('user_test123');
      expect(newDeck.description).toBe('Learn Indonesian from English');
    });

    it('should get all decks', async () => {
      // Insert test data
      await db.insert(decksTable).values([
        {
          userId: 'user_test123',
          title: 'Spanish',
          description: 'Learn Spanish',
        },
        {
          userId: 'user_test456',
          title: 'French',
          description: 'Learn French',
        },
      ]);

      const decks = await db.select().from(decksTable);

      expect(decks).toHaveLength(2);
      expect(decks[0].title).toBe('Spanish');
      expect(decks[1].title).toBe('French');
    });

    it('should update a deck', async () => {
      const [newDeck] = await db
        .insert(decksTable)
        .values({
          userId: 'user_test123',
          title: 'German',
          description: 'Learn German',
        })
        .returning();

      await db
        .update(decksTable)
        .set({ title: 'Advanced German' })
        .where(eq(decksTable.id, newDeck.id));

      const [updatedDeck] = await db
        .select()
        .from(decksTable)
        .where(eq(decksTable.id, newDeck.id));

      expect(updatedDeck.title).toBe('Advanced German');
    });

    it('should delete a deck', async () => {
      const [newDeck] = await db
        .insert(decksTable)
        .values({
          userId: 'user_test123',
          title: 'Japanese',
          description: 'Learn Japanese',
        })
        .returning();

      await db.delete(decksTable).where(eq(decksTable.id, newDeck.id));

      const decks = await db.select().from(decksTable);
      expect(decks).toHaveLength(0);
    });
  });

  describe('Cards Operations', () => {
    let testDeckId: number;

    beforeEach(async () => {
      // Create a deck for card tests
      const [newDeck] = await db
        .insert(decksTable)
        .values({
          userId: 'user_test123',
          title: 'Test Deck',
          description: 'Deck for card tests',
        })
        .returning();
      testDeckId = newDeck.id;
    });

    it('should create cards for a deck', async () => {
      const cards: typeof cardsTable.$inferInsert[] = [
        {
          deckId: testDeckId,
          front: 'Dog',
          back: 'Anjing',
        },
        {
          deckId: testDeckId,
          front: 'Cat',
          back: 'Kucing',
        },
      ];

      const newCards = await db.insert(cardsTable).values(cards).returning();

      expect(newCards).toHaveLength(2);
      expect(newCards[0].front).toBe('Dog');
      expect(newCards[0].back).toBe('Anjing');
      expect(newCards[1].front).toBe('Cat');
      expect(newCards[1].back).toBe('Kucing');
    });

    it('should get all cards for a deck', async () => {
      await db.insert(cardsTable).values([
        { deckId: testDeckId, front: 'Hello', back: 'Halo' },
        { deckId: testDeckId, front: 'Goodbye', back: 'Selamat tinggal' },
        { deckId: testDeckId, front: 'Thank you', back: 'Terima kasih' },
      ]);

      const cards = await db
        .select()
        .from(cardsTable)
        .where(eq(cardsTable.deckId, testDeckId));

      expect(cards).toHaveLength(3);
      expect(cards[0].front).toBe('Hello');
      expect(cards[1].front).toBe('Goodbye');
      expect(cards[2].front).toBe('Thank you');
    });

    it('should update a card', async () => {
      const [newCard] = await db
        .insert(cardsTable)
        .values({
          deckId: testDeckId,
          front: 'Dog',
          back: 'Anjing',
        })
        .returning();

      await db
        .update(cardsTable)
        .set({ back: 'Anjing (noun)' })
        .where(eq(cardsTable.id, newCard.id));

      const [updatedCard] = await db
        .select()
        .from(cardsTable)
        .where(eq(cardsTable.id, newCard.id));

      expect(updatedCard.back).toBe('Anjing (noun)');
    });

    it('should delete a card', async () => {
      const [newCard] = await db
        .insert(cardsTable)
        .values({
          deckId: testDeckId,
          front: 'Bird',
          back: 'Burung',
        })
        .returning();

      await db.delete(cardsTable).where(eq(cardsTable.id, newCard.id));

      const cards = await db
        .select()
        .from(cardsTable)
        .where(eq(cardsTable.deckId, testDeckId));

      expect(cards).toHaveLength(0);
    });

    it('should cascade delete cards when deck is deleted', async () => {
      // Create cards
      await db.insert(cardsTable).values([
        { deckId: testDeckId, front: 'One', back: 'Satu' },
        { deckId: testDeckId, front: 'Two', back: 'Dua' },
      ]);

      // Delete the deck
      await db.delete(decksTable).where(eq(decksTable.id, testDeckId));

      // Check that cards were also deleted
      const cards = await db
        .select()
        .from(cardsTable)
        .where(eq(cardsTable.deckId, testDeckId));

      expect(cards).toHaveLength(0);
    });
  });

  describe('Complex Operations', () => {
    it('should handle complete CRUD workflow', async () => {
      // Create deck
      const [deck] = await db
        .insert(decksTable)
        .values({
          userId: 'user_workflow_test',
          title: 'Complete Workflow Test',
          description: 'Testing full CRUD workflow',
        })
        .returning();

      expect(deck.id).toBeDefined();

      // Create cards
      const cards = await db
        .insert(cardsTable)
        .values([
          { deckId: deck.id, front: 'Question 1', back: 'Answer 1' },
          { deckId: deck.id, front: 'Question 2', back: 'Answer 2' },
          { deckId: deck.id, front: 'Question 3', back: 'Answer 3' },
        ])
        .returning();

      expect(cards).toHaveLength(3);

      // Read cards
      const fetchedCards = await db
        .select()
        .from(cardsTable)
        .where(eq(cardsTable.deckId, deck.id));

      expect(fetchedCards).toHaveLength(3);

      // Update a card
      await db
        .update(cardsTable)
        .set({ back: 'Updated Answer 1' })
        .where(eq(cardsTable.id, cards[0].id));

      const [updatedCard] = await db
        .select()
        .from(cardsTable)
        .where(eq(cardsTable.id, cards[0].id));

      expect(updatedCard.back).toBe('Updated Answer 1');

      // Delete deck (cascade delete cards)
      await db.delete(decksTable).where(eq(decksTable.id, deck.id));

      const remainingDecks = await db.select().from(decksTable);
      const remainingCards = await db.select().from(cardsTable);

      expect(remainingDecks).toHaveLength(0);
      expect(remainingCards).toHaveLength(0);
    });
  });
});





