import 'dotenv/config';
import { describe, it, expect, afterAll, beforeEach } from 'vitest';
import { createDeckInDb, deleteDeckFromDb, getUserDecks } from '@/db/queries/deck-queries';
import {
  getCardsByDeckId,
  getCardById,
  createCardInDb,
  createCardsInDb,
  updateCardInDb,
  deleteCardFromDb,
  getCardCount,
} from '@/db/queries/card-queries';
import { cleanupDatabase } from './test-utils';

describe('Card Queries', () => {
  let testDeckId: number;

  // Clean database before each test
  beforeEach(async () => {
    await cleanupDatabase();
    
    // Create a deck for card tests using query helper
    const newDeck = await createDeckInDb(
      'user_test123',
      'Test Deck',
      'Deck for card tests'
    );
    testDeckId = newDeck.id;
  });

  // Clean database after all tests complete
  afterAll(async () => {
    await cleanupDatabase();
    console.log('✓ Card tests completed - database cleaned');
  });

  describe('Create Operations', () => {
    it('should create a single card', async () => {
      const newCard = await createCardInDb(testDeckId, 'Dog', 'Anjing');

      expect(newCard).toBeDefined();
      expect(newCard.front).toBe('Dog');
      expect(newCard.back).toBe('Anjing');
      expect(newCard.deckId).toBe(testDeckId);
    });

    it('should create multiple cards for a deck', async () => {
      const cards = [
        { deckId: testDeckId, front: 'Dog', back: 'Anjing' },
        { deckId: testDeckId, front: 'Cat', back: 'Kucing' },
      ];

      const newCards = await createCardsInDb(cards);

      expect(newCards).toHaveLength(2);
      expect(newCards[0].front).toBe('Dog');
      expect(newCards[0].back).toBe('Anjing');
      expect(newCards[1].front).toBe('Cat');
      expect(newCards[1].back).toBe('Kucing');
    });

    it('should create multiple cards in bulk', async () => {
      const cards = [
        { deckId: testDeckId, front: 'One', back: 'Satu' },
        { deckId: testDeckId, front: 'Two', back: 'Dua' },
        { deckId: testDeckId, front: 'Three', back: 'Tiga' },
        { deckId: testDeckId, front: 'Four', back: 'Empat' },
        { deckId: testDeckId, front: 'Five', back: 'Lima' },
      ];

      const newCards = await createCardsInDb(cards);

      expect(newCards).toHaveLength(5);
      expect(newCards[0].front).toBe('One');
      expect(newCards[4].front).toBe('Five');
    });

    it('should auto-increment card IDs', async () => {
      const card1 = await createCardInDb(testDeckId, 'First', 'Pertama');
      const card2 = await createCardInDb(testDeckId, 'Second', 'Kedua');
      const card3 = await createCardInDb(testDeckId, 'Third', 'Ketiga');

      expect(card2.id).toBe(card1.id + 1);
      expect(card3.id).toBe(card2.id + 1);
    });
  });

  describe('Read Operations', () => {
    it('should get all cards for a deck', async () => {
      await createCardsInDb([
        { deckId: testDeckId, front: 'Hello', back: 'Halo' },
        { deckId: testDeckId, front: 'Goodbye', back: 'Selamat tinggal' },
        { deckId: testDeckId, front: 'Thank you', back: 'Terima kasih' },
      ]);

      const cards = await getCardsByDeckId(testDeckId);

      expect(cards).toHaveLength(3);
      
      // Check all cards are present
      const fronts = cards.map(c => c.front);
      expect(fronts).toContain('Hello');
      expect(fronts).toContain('Goodbye');
      expect(fronts).toContain('Thank you');
    });

    it('should return empty array for deck with no cards', async () => {
      const cards = await getCardsByDeckId(testDeckId);

      expect(cards).toHaveLength(0);
      expect(cards).toEqual([]);
    });

    it('should get a card by ID', async () => {
      const newCard = await createCardInDb(testDeckId, 'Test', 'Tes');

      const foundCard = await getCardById(newCard.id);

      expect(foundCard).toBeDefined();
      expect(foundCard?.front).toBe('Test');
      expect(foundCard?.back).toBe('Tes');
    });

    it('should return undefined for non-existent card', async () => {
      const card = await getCardById(999);

      expect(card).toBeUndefined();
    });

    it('should get card count for a deck', async () => {
      await createCardsInDb([
        { deckId: testDeckId, front: 'One', back: 'Satu' },
        { deckId: testDeckId, front: 'Two', back: 'Dua' },
        { deckId: testDeckId, front: 'Three', back: 'Tiga' },
      ]);

      const count = await getCardCount(testDeckId);

      expect(count).toBe(3);
    });

    it('should return 0 for empty deck', async () => {
      const count = await getCardCount(testDeckId);

      expect(count).toBe(0);
    });

    it('should isolate cards by deck', async () => {
      const deck2 = await createDeckInDb('user_test123', 'Deck 2');

      await createCardsInDb([
        { deckId: testDeckId, front: 'Deck1 Card1', back: 'A' },
        { deckId: testDeckId, front: 'Deck1 Card2', back: 'B' },
        { deckId: deck2.id, front: 'Deck2 Card1', back: 'C' },
      ]);

      const deck1Cards = await getCardsByDeckId(testDeckId);
      const deck2Cards = await getCardsByDeckId(deck2.id);

      expect(deck1Cards).toHaveLength(2);
      expect(deck2Cards).toHaveLength(1);
      expect(deck1Cards.every(c => c.deckId === testDeckId)).toBe(true);
      expect(deck2Cards.every(c => c.deckId === deck2.id)).toBe(true);
    });
  });

  describe('Update Operations', () => {
    it('should update card front', async () => {
      const newCard = await createCardInDb(testDeckId, 'Dog', 'Anjing');

      const updatedCard = await updateCardInDb(newCard.id, { front: 'Big Dog' });

      expect(updatedCard.front).toBe('Big Dog');
      expect(updatedCard.back).toBe('Anjing');
    });

    it('should update card back', async () => {
      const newCard = await createCardInDb(testDeckId, 'Dog', 'Anjing');

      const updatedCard = await updateCardInDb(newCard.id, { back: 'Anjing (noun)' });

      expect(updatedCard.back).toBe('Anjing (noun)');
      expect(updatedCard.front).toBe('Dog');
    });

    it('should update both front and back', async () => {
      const newCard = await createCardInDb(testDeckId, 'Old Front', 'Old Back');

      const updatedCard = await updateCardInDb(newCard.id, { 
        front: 'New Front',
        back: 'New Back'
      });

      expect(updatedCard.front).toBe('New Front');
      expect(updatedCard.back).toBe('New Back');
    });

    it('should update updatedAt timestamp', async () => {
      const newCard = await createCardInDb(testDeckId, 'Test', 'Tes');

      const updatedCard = await updateCardInDb(newCard.id, { front: 'Updated' });

      // Verify updatedAt exists and is a valid date
      expect(updatedCard.updatedAt).toBeDefined();
      expect(updatedCard.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Delete Operations', () => {
    it('should delete a card', async () => {
      const newCard = await createCardInDb(testDeckId, 'Bird', 'Burung');

      await deleteCardFromDb(newCard.id);

      const card = await getCardById(newCard.id);
      expect(card).toBeUndefined();
    });

    it('should remove card from deck card list', async () => {
      const card1 = await createCardInDb(testDeckId, 'Keep', 'Simpan');
      await createCardInDb(testDeckId, 'Delete', 'Hapus');
      await createCardInDb(testDeckId, 'Keep', 'Simpan');

      await deleteCardFromDb(card1.id);

      const cards = await getCardsByDeckId(testDeckId);
      expect(cards).toHaveLength(2);
      expect(cards.find(c => c.id === card1.id)).toBeUndefined();
    });

    it('should only delete specified card', async () => {
      const card1 = await createCardInDb(testDeckId, 'Keep This', 'Simpan');
      const card2 = await createCardInDb(testDeckId, 'Delete This', 'Hapus');

      await deleteCardFromDb(card2.id);

      const remainingCard = await getCardById(card1.id);
      expect(remainingCard).toBeDefined();
      expect(remainingCard?.front).toBe('Keep This');
    });

    it('should cascade delete cards when deck is deleted', async () => {
      // Create cards
      await createCardsInDb([
        { deckId: testDeckId, front: 'One', back: 'Satu' },
        { deckId: testDeckId, front: 'Two', back: 'Dua' },
      ]);

      // Delete the deck
      await deleteDeckFromDb(testDeckId);

      // Check that cards were also deleted
      const cards = await getCardsByDeckId(testDeckId);

      expect(cards).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in card content', async () => {
      const newCard = await createCardInDb(
        testDeckId,
        'Front: "Quotes" & Symbols!',
        'Back: <html> tags & émojis 🎉'
      );

      expect(newCard.front).toBe('Front: "Quotes" & Symbols!');
      expect(newCard.back).toBe('Back: <html> tags & émojis 🎉');
    });

    it('should handle very long text content', async () => {
      const longText = 'A'.repeat(1000);
      const newCard = await createCardInDb(testDeckId, longText, longText);

      expect(newCard.front).toBe(longText);
      expect(newCard.back).toBe(longText);
    });

    it('should handle multiline text', async () => {
      const multilineFront = 'Line 1\nLine 2\nLine 3';
      const multilineBack = 'Answer:\n- Point 1\n- Point 2\n- Point 3';
      
      const newCard = await createCardInDb(testDeckId, multilineFront, multilineBack);

      expect(newCard.front).toBe(multilineFront);
      expect(newCard.back).toBe(multilineBack);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete CRUD workflow', async () => {
      const userId = 'user_workflow_test';

      // Create deck using query helper
      const deck = await createDeckInDb(
        userId,
        'Complete Workflow Test',
        'Testing full CRUD workflow'
      );

      expect(deck.id).toBeDefined();

      // Create cards using query helper
      const cards = await createCardsInDb([
        { deckId: deck.id, front: 'Question 1', back: 'Answer 1' },
        { deckId: deck.id, front: 'Question 2', back: 'Answer 2' },
        { deckId: deck.id, front: 'Question 3', back: 'Answer 3' },
      ]);

      expect(cards).toHaveLength(3);

      // Read cards using query helper
      const fetchedCards = await getCardsByDeckId(deck.id);

      expect(fetchedCards).toHaveLength(3);

      // Update a card using query helper
      const updatedCard = await updateCardInDb(cards[0].id, { back: 'Updated Answer 1' });

      expect(updatedCard.back).toBe('Updated Answer 1');

      // Verify the update
      const verifiedCard = await getCardById(cards[0].id);
      expect(verifiedCard?.back).toBe('Updated Answer 1');

      // Delete deck (cascade delete cards) using query helper
      await deleteDeckFromDb(deck.id);

      const remainingDecks = await getUserDecks(userId);
      const remainingCards = await getCardsByDeckId(deck.id);

      expect(remainingDecks).toHaveLength(0);
      expect(remainingCards).toHaveLength(0);
    });

    it('should handle multiple decks with multiple cards', async () => {
      const deck1 = await createDeckInDb('user_test', 'Deck 1');
      const deck2 = await createDeckInDb('user_test', 'Deck 2');

      await createCardsInDb([
        { deckId: deck1.id, front: 'D1C1', back: 'A1' },
        { deckId: deck1.id, front: 'D1C2', back: 'A2' },
        { deckId: deck2.id, front: 'D2C1', back: 'B1' },
        { deckId: deck2.id, front: 'D2C2', back: 'B2' },
        { deckId: deck2.id, front: 'D2C3', back: 'B3' },
      ]);

      const deck1Cards = await getCardsByDeckId(deck1.id);
      const deck2Cards = await getCardsByDeckId(deck2.id);
      const deck1Count = await getCardCount(deck1.id);
      const deck2Count = await getCardCount(deck2.id);

      expect(deck1Cards).toHaveLength(2);
      expect(deck2Cards).toHaveLength(3);
      expect(deck1Count).toBe(2);
      expect(deck2Count).toBe(3);
    });
  });
});
