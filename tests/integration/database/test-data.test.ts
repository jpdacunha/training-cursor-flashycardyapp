import 'dotenv/config';
import { describe, it, expect, afterAll, beforeEach } from 'vitest';
import { createDeckInDb, getUserDecks } from '@/features/decks/queries';
import { createCardsInDb, getCardsByDeckId, getCardCount } from '@/features/cards/queries';
import { cleanupDatabase } from '@/tests/fixtures/test-utils';
import {
  TEST_DATASETS,
  ENGLISH_SPANISH_DECK,
  ENGLISH_SPANISH_CARDS,
  FRENCH_HISTORY_DECK,
  FRENCH_HISTORY_CARDS,
  prepareCardsForDeck,
} from '@/tests/fixtures/test-data';

describe('Test Data Integration', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    console.log('✓ Test data tests completed - database cleaned');
  });

  describe('English-Spanish Deck', () => {
    it('should create English-Spanish vocabulary deck with all cards', async () => {
      // Create the deck
      const deck = await createDeckInDb(
        ENGLISH_SPANISH_DECK.userId,
        ENGLISH_SPANISH_DECK.title,
        ENGLISH_SPANISH_DECK.description
      );

      expect(deck).toBeDefined();
      expect(deck.title).toBe('English to Spanish Vocabulary');

      // Create all cards for the deck
      const cardsData = prepareCardsForDeck(ENGLISH_SPANISH_CARDS, deck.id);
      const cards = await createCardsInDb(cardsData);

      expect(cards).toHaveLength(TEST_DATASETS.englishSpanish.expectedCardCount);
      expect(cards).toHaveLength(20);
    });

    it('should verify English-Spanish card content', async () => {
      const deck = await createDeckInDb(
        ENGLISH_SPANISH_DECK.userId,
        ENGLISH_SPANISH_DECK.title,
        ENGLISH_SPANISH_DECK.description
      );

      const cardsData = prepareCardsForDeck(ENGLISH_SPANISH_CARDS, deck.id);
      await createCardsInDb(cardsData);

      const cards = await getCardsByDeckId(deck.id);

      // Verify specific cards exist
      const helloCard = cards.find((c) => c.front === 'Hello');
      expect(helloCard).toBeDefined();
      expect(helloCard?.back).toBe('Hola');

      const thankYouCard = cards.find((c) => c.front === 'Thank you');
      expect(thankYouCard).toBeDefined();
      expect(thankYouCard?.back).toBe('Gracias');

      const waterCard = cards.find((c) => c.front === 'Water');
      expect(waterCard).toBeDefined();
      expect(waterCard?.back).toBe('Agua');
    });

    it('should get correct card count for English-Spanish deck', async () => {
      const deck = await createDeckInDb(
        ENGLISH_SPANISH_DECK.userId,
        ENGLISH_SPANISH_DECK.title,
        ENGLISH_SPANISH_DECK.description
      );

      const cardsData = prepareCardsForDeck(ENGLISH_SPANISH_CARDS, deck.id);
      await createCardsInDb(cardsData);

      const count = await getCardCount(deck.id);

      expect(count).toBe(20);
      expect(count).toBeGreaterThanOrEqual(15);
    });
  });

  describe('French History Deck', () => {
    it('should create French History quiz deck with all cards', async () => {
      // Create the deck
      const deck = await createDeckInDb(
        FRENCH_HISTORY_DECK.userId,
        FRENCH_HISTORY_DECK.title,
        FRENCH_HISTORY_DECK.description
      );

      expect(deck).toBeDefined();
      expect(deck.title).toBe('French History Quiz');

      // Create all cards for the deck
      const cardsData = prepareCardsForDeck(FRENCH_HISTORY_CARDS, deck.id);
      const cards = await createCardsInDb(cardsData);

      expect(cards).toHaveLength(TEST_DATASETS.frenchHistory.expectedCardCount);
      expect(cards).toHaveLength(20);
    });

    it('should verify French History card content', async () => {
      const deck = await createDeckInDb(
        FRENCH_HISTORY_DECK.userId,
        FRENCH_HISTORY_DECK.title,
        FRENCH_HISTORY_DECK.description
      );

      const cardsData = prepareCardsForDeck(FRENCH_HISTORY_CARDS, deck.id);
      await createCardsInDb(cardsData);

      const cards = await getCardsByDeckId(deck.id);

      // Verify specific history questions
      const revolutionCard = cards.find((c) =>
        c.front.includes('French Revolution begin')
      );
      expect(revolutionCard).toBeDefined();
      expect(revolutionCard?.back).toContain('1789');

      const sunKingCard = cards.find((c) => c.front.includes('Sun King'));
      expect(sunKingCard).toBeDefined();
      expect(sunKingCard?.back).toContain('Louis XIV');

      const napoleonCard = cards.find((c) =>
        c.front.includes('Napoleon Bonaparte crown')
      );
      expect(napoleonCard).toBeDefined();
      expect(napoleonCard?.back).toContain('1804');
    });

    it('should get correct card count for French History deck', async () => {
      const deck = await createDeckInDb(
        FRENCH_HISTORY_DECK.userId,
        FRENCH_HISTORY_DECK.title,
        FRENCH_HISTORY_DECK.description
      );

      const cardsData = prepareCardsForDeck(FRENCH_HISTORY_CARDS, deck.id);
      await createCardsInDb(cardsData);

      const count = await getCardCount(deck.id);

      expect(count).toBe(20);
      expect(count).toBeGreaterThanOrEqual(15);
    });
  });

  describe('Multiple Decks Integration', () => {
    it('should create both decks for the same user', async () => {
      // Create English-Spanish deck
      const deck1 = await createDeckInDb(
        ENGLISH_SPANISH_DECK.userId,
        ENGLISH_SPANISH_DECK.title,
        ENGLISH_SPANISH_DECK.description
      );

      const cards1 = prepareCardsForDeck(ENGLISH_SPANISH_CARDS, deck1.id);
      await createCardsInDb(cards1);

      // Create French History deck
      const deck2 = await createDeckInDb(
        FRENCH_HISTORY_DECK.userId,
        FRENCH_HISTORY_DECK.title,
        FRENCH_HISTORY_DECK.description
      );

      const cards2 = prepareCardsForDeck(FRENCH_HISTORY_CARDS, deck2.id);
      await createCardsInDb(cards2);

      // Verify both decks exist for user
      const userDecks = await getUserDecks(ENGLISH_SPANISH_DECK.userId);

      expect(userDecks).toHaveLength(2);

      // Verify card counts
      const deck1Count = await getCardCount(deck1.id);
      const deck2Count = await getCardCount(deck2.id);

      expect(deck1Count).toBe(20);
      expect(deck2Count).toBe(20);
    });

    it('should isolate cards between both decks', async () => {
      const deck1 = await createDeckInDb(
        ENGLISH_SPANISH_DECK.userId,
        ENGLISH_SPANISH_DECK.title,
        ENGLISH_SPANISH_DECK.description
      );

      const deck2 = await createDeckInDb(
        FRENCH_HISTORY_DECK.userId,
        FRENCH_HISTORY_DECK.title,
        FRENCH_HISTORY_DECK.description
      );

      const cards1 = prepareCardsForDeck(ENGLISH_SPANISH_CARDS, deck1.id);
      const cards2 = prepareCardsForDeck(FRENCH_HISTORY_CARDS, deck2.id);

      await createCardsInDb(cards1);
      await createCardsInDb(cards2);

      const deck1Cards = await getCardsByDeckId(deck1.id);
      const deck2Cards = await getCardsByDeckId(deck2.id);

      // Verify isolation
      expect(deck1Cards.every((c) => c.deckId === deck1.id)).toBe(true);
      expect(deck2Cards.every((c) => c.deckId === deck2.id)).toBe(true);

      // Verify content types
      const hasSpanishVocab = deck1Cards.some((c) => c.back.includes('Hola'));
      const hasHistoryQuestion = deck2Cards.some((c) =>
        c.front.includes('French Revolution')
      );

      expect(hasSpanishVocab).toBe(true);
      expect(hasHistoryQuestion).toBe(true);
    });
  });

  describe('Dataset Validation', () => {
    it('should have at least 15 cards in English-Spanish deck', () => {
      expect(ENGLISH_SPANISH_CARDS.length).toBeGreaterThanOrEqual(15);
    });

    it('should have at least 15 cards in French History deck', () => {
      expect(FRENCH_HISTORY_CARDS.length).toBeGreaterThanOrEqual(15);
    });

    it('should have all cards with front and back content', () => {
      const allCards = [...ENGLISH_SPANISH_CARDS, ...FRENCH_HISTORY_CARDS];

      allCards.forEach((card) => {
        expect(card.front).toBeDefined();
        expect(card.front.length).toBeGreaterThan(0);
        expect(card.back).toBeDefined();
        expect(card.back.length).toBeGreaterThan(0);
      });
    });

    it('should have unique questions in each deck', () => {
      const englishFronts = ENGLISH_SPANISH_CARDS.map((c) => c.front);
      const historyFronts = FRENCH_HISTORY_CARDS.map((c) => c.front);

      const uniqueEnglishFronts = new Set(englishFronts);
      const uniqueHistoryFronts = new Set(historyFronts);

      expect(uniqueEnglishFronts.size).toBe(englishFronts.length);
      expect(uniqueHistoryFronts.size).toBe(historyFronts.length);
    });
  });
});
