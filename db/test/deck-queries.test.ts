import 'dotenv/config';
import { describe, it, expect, afterAll, beforeEach } from 'vitest';
import {
  getUserDecks,
  getDeckById,
  createDeckInDb,
  updateDeckInDb,
  deleteDeckFromDb,
} from '@/db/queries/deck-queries';
import { cleanupDatabase } from './test-utils';

describe('Deck Queries', () => {
  // Clean database before each test
  beforeEach(async () => {
    await cleanupDatabase();
  });

  // Clean database after all tests complete
  afterAll(async () => {
    await cleanupDatabase();
    console.log('✓ Deck tests completed - database cleaned');
  });

  describe('Create Operations', () => {
    it('should create a new deck', async () => {
      const newDeck = await createDeckInDb(
        'user_test123',
        'Indonesian Language',
        'Learn Indonesian from English'
      );

      expect(newDeck).toBeDefined();
      expect(newDeck.id).toBe(1);
      expect(newDeck.title).toBe('Indonesian Language');
      expect(newDeck.userId).toBe('user_test123');
      expect(newDeck.description).toBe('Learn Indonesian from English');
    });

    it('should create a deck without description', async () => {
      const newDeck = await createDeckInDb('user_test123', 'Simple Deck');

      expect(newDeck).toBeDefined();
      expect(newDeck.title).toBe('Simple Deck');
      expect(newDeck.description).toBe('');
    });

    it('should create multiple decks for same user', async () => {
      await createDeckInDb('user_test123', 'Spanish', 'Learn Spanish');
      await createDeckInDb('user_test123', 'French', 'Learn French');
      await createDeckInDb('user_test123', 'German', 'Learn German');

      const decks = await getUserDecks('user_test123');

      expect(decks).toHaveLength(3);
    });
  });

  describe('Read Operations', () => {
    it('should get all decks for a user', async () => {
      // Insert test data using query helpers
      await createDeckInDb('user_test123', 'Spanish', 'Learn Spanish');
      await createDeckInDb('user_test123', 'French', 'Learn French');
      await createDeckInDb('user_test456', 'German', 'Learn German');

      const user123Decks = await getUserDecks('user_test123');
      const user456Decks = await getUserDecks('user_test456');

      expect(user123Decks).toHaveLength(2);
      expect(user456Decks).toHaveLength(1);
      expect(user123Decks[0].title).toBe('French'); // Most recent first
      expect(user123Decks[1].title).toBe('Spanish');
    });

    it('should return empty array for user with no decks', async () => {
      const decks = await getUserDecks('user_no_decks');

      expect(decks).toHaveLength(0);
      expect(decks).toEqual([]);
    });

    it('should get a deck by ID with ownership check', async () => {
      const newDeck = await createDeckInDb('user_test123', 'Test Deck', 'Test Description');

      const foundDeck = await getDeckById(newDeck.id, 'user_test123');
      const notFoundDeck = await getDeckById(newDeck.id, 'wrong_user');

      expect(foundDeck).toBeDefined();
      expect(foundDeck?.title).toBe('Test Deck');
      expect(notFoundDeck).toBeUndefined();
    });

    it('should return undefined for non-existent deck', async () => {
      const deck = await getDeckById(999, 'user_test123');

      expect(deck).toBeUndefined();
    });

    it('should isolate decks by user', async () => {
      await createDeckInDb('user_alice', 'Alice Deck 1');
      await createDeckInDb('user_alice', 'Alice Deck 2');
      await createDeckInDb('user_bob', 'Bob Deck 1');

      const aliceDecks = await getUserDecks('user_alice');
      const bobDecks = await getUserDecks('user_bob');

      expect(aliceDecks).toHaveLength(2);
      expect(bobDecks).toHaveLength(1);
      expect(aliceDecks.every(d => d.userId === 'user_alice')).toBe(true);
      expect(bobDecks.every(d => d.userId === 'user_bob')).toBe(true);
    });
  });

  describe('Update Operations', () => {
    it('should update deck title', async () => {
      const newDeck = await createDeckInDb('user_test123', 'German', 'Learn German');

      const updatedDeck = await updateDeckInDb(newDeck.id, { title: 'Advanced German' });

      expect(updatedDeck.title).toBe('Advanced German');
      expect(updatedDeck.description).toBe('Learn German');
    });

    it('should update deck description', async () => {
      const newDeck = await createDeckInDb('user_test123', 'Spanish', 'Basic Spanish');

      const updatedDeck = await updateDeckInDb(newDeck.id, { 
        description: 'Advanced Spanish for Business' 
      });

      expect(updatedDeck.title).toBe('Spanish');
      expect(updatedDeck.description).toBe('Advanced Spanish for Business');
    });

    it('should update both title and description', async () => {
      const newDeck = await createDeckInDb('user_test123', 'French', 'Learn French');

      const updatedDeck = await updateDeckInDb(newDeck.id, { 
        title: 'French Advanced',
        description: 'Advanced French Grammar'
      });

      expect(updatedDeck.title).toBe('French Advanced');
      expect(updatedDeck.description).toBe('Advanced French Grammar');
    });

    it('should update updatedAt timestamp', async () => {
      const newDeck = await createDeckInDb('user_test123', 'Test Deck');

      const updatedDeck = await updateDeckInDb(newDeck.id, { title: 'Updated Deck' });

      // Verify updatedAt exists and is a valid date
      expect(updatedDeck.updatedAt).toBeDefined();
      expect(updatedDeck.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Delete Operations', () => {
    it('should delete a deck', async () => {
      const newDeck = await createDeckInDb('user_test123', 'Japanese', 'Learn Japanese');

      await deleteDeckFromDb(newDeck.id);

      const deck = await getDeckById(newDeck.id, 'user_test123');
      expect(deck).toBeUndefined();
    });

    it('should remove deck from user deck list', async () => {
      const deck1 = await createDeckInDb('user_test123', 'Deck 1');
      await createDeckInDb('user_test123', 'Deck 2');
      await createDeckInDb('user_test123', 'Deck 3');

      await deleteDeckFromDb(deck1.id);

      const decks = await getUserDecks('user_test123');
      expect(decks).toHaveLength(2);
      expect(decks.find(d => d.id === deck1.id)).toBeUndefined();
    });

    it('should only delete specified deck', async () => {
      const deck1 = await createDeckInDb('user_test123', 'Keep This');
      const deck2 = await createDeckInDb('user_test123', 'Delete This');

      await deleteDeckFromDb(deck2.id);

      const remainingDeck = await getDeckById(deck1.id, 'user_test123');
      expect(remainingDeck).toBeDefined();
      expect(remainingDeck?.title).toBe('Keep This');
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in title', async () => {
      const newDeck = await createDeckInDb(
        'user_test123',
        'Test: "Quotes" & Symbols!',
        'Description with <html> tags'
      );

      expect(newDeck.title).toBe('Test: "Quotes" & Symbols!');
      expect(newDeck.description).toBe('Description with <html> tags');
    });

    it('should handle empty description', async () => {
      const newDeck = await createDeckInDb('user_test123', 'No Description', '');

      expect(newDeck.description).toBe('');
    });

    it('should handle very long title', async () => {
      const longTitle = 'A'.repeat(255);
      const newDeck = await createDeckInDb('user_test123', longTitle);

      expect(newDeck.title).toBe(longTitle);
    });
  });
});
