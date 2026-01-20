/**
 * Test dataset for database tests
 * Contains pre-defined decks and cards for consistent testing
 */

export const TEST_USER_IDS = {
  user1: 'user_test_alice',
  user2: 'user_test_bob',
  user3: 'user_test_charlie',
} as const;

/**
 * English-Spanish vocabulary deck
 * Purpose: Learn Spanish from English
 */
export const ENGLISH_SPANISH_DECK = {
  userId: TEST_USER_IDS.user1,
  title: 'English to Spanish Vocabulary',
  description: 'Learn essential Spanish words and phrases from English',
} as const;

export const ENGLISH_SPANISH_CARDS = [
  { front: 'Hello', back: 'Hola' },
  { front: 'Goodbye', back: 'Adiós' },
  { front: 'Please', back: 'Por favor' },
  { front: 'Thank you', back: 'Gracias' },
  { front: 'Yes', back: 'Sí' },
  { front: 'No', back: 'No' },
  { front: 'Good morning', back: 'Buenos días' },
  { front: 'Good afternoon', back: 'Buenas tardes' },
  { front: 'Good night', back: 'Buenas noches' },
  { front: 'How are you?', back: '¿Cómo estás?' },
  { front: 'I am fine', back: 'Estoy bien' },
  { front: 'What is your name?', back: '¿Cómo te llamas?' },
  { front: 'My name is...', back: 'Me llamo...' },
  { front: 'Water', back: 'Agua' },
  { front: 'Food', back: 'Comida' },
  { front: 'House', back: 'Casa' },
  { front: 'Family', back: 'Familia' },
  { front: 'Friend', back: 'Amigo/Amiga' },
  { front: 'Love', back: 'Amor' },
  { front: 'Time', back: 'Tiempo' },
] as const;

/**
 * French History deck
 * Purpose: Learn key facts and dates about French history
 */
export const FRENCH_HISTORY_DECK = {
  userId: TEST_USER_IDS.user1,
  title: 'French History Quiz',
  description: 'Essential questions and answers about the history of France',
} as const;

export const FRENCH_HISTORY_CARDS = [
  {
    front: 'When did the French Revolution begin?',
    back: '1789, with the storming of the Bastille on July 14',
  },
  {
    front: 'Who was the Sun King?',
    back: 'Louis XIV (14th), who ruled France from 1643 to 1715',
  },
  {
    front: 'What was the Hundred Years\' War?',
    back: 'A series of conflicts between France and England from 1337 to 1453',
  },
  {
    front: 'Who was Joan of Arc?',
    back: 'A peasant girl who led French forces during the Hundred Years\' War and was later canonized as a saint',
  },
  {
    front: 'When did Napoleon Bonaparte crown himself Emperor?',
    back: 'December 2, 1804, at Notre-Dame Cathedral in Paris',
  },
  {
    front: 'What was the Reign of Terror?',
    back: 'A period during the French Revolution (1793-1794) marked by mass executions of perceived enemies',
  },
  {
    front: 'Who was Charlemagne?',
    back: 'King of the Franks who united much of Western Europe and was crowned Holy Roman Emperor in 800 AD',
  },
  {
    front: 'When did France become a republic for the first time?',
    back: 'September 22, 1792, after the abolition of the monarchy',
  },
  {
    front: 'What was the Treaty of Versailles?',
    back: 'The peace treaty signed in 1919 that ended World War I, signed at the Palace of Versailles',
  },
  {
    front: 'Who was Cardinal Richelieu?',
    back: 'Chief minister to Louis XIII who strengthened royal power and French influence in the 17th century',
  },
  {
    front: 'When did the Fifth Republic of France begin?',
    back: '1958, with Charles de Gaulle as its first president',
  },
  {
    front: 'What was the Estates-General?',
    back: 'An assembly representing the three estates of French society: clergy, nobility, and commoners',
  },
  {
    front: 'Who was Napoleon III?',
    back: 'Napoleon Bonaparte\'s nephew who became the first president of France and later its last monarch (1852-1870)',
  },
  {
    front: 'When did France abolish slavery?',
    back: 'First in 1794 during the Revolution, then definitively in 1848',
  },
  {
    front: 'What was the Paris Commune?',
    back: 'A revolutionary socialist government that ruled Paris from March to May 1871',
  },
  {
    front: 'Who was Clovis I?',
    back: 'The first king of the Franks to unite all Frankish tribes under one ruler (circa 481-511 AD)',
  },
  {
    front: 'When did France surrender to Nazi Germany in WWII?',
    back: 'June 22, 1940, leading to the division between occupied and Vichy France',
  },
  {
    front: 'What was the Edict of Nantes?',
    back: 'A decree issued by Henry IV in 1598 granting religious tolerance to Protestants',
  },
  {
    front: 'Who were the Jacobins?',
    back: 'The most radical political club during the French Revolution, led by Robespierre',
  },
  {
    front: 'When was the guillotine last used in France?',
    back: 'September 10, 1977; capital punishment was abolished in France in 1981',
  },
] as const;

/**
 * Helper function to add deck ID to cards
 */
export function prepareCardsForDeck(
  cards: readonly { front: string; back: string }[],
  deckId: number
) {
  return cards.map((card) => ({
    deckId,
    front: card.front,
    back: card.back,
  }));
}

/**
 * Complete test datasets with metadata
 */
export const TEST_DATASETS = {
  englishSpanish: {
    deck: ENGLISH_SPANISH_DECK,
    cards: ENGLISH_SPANISH_CARDS,
    expectedCardCount: ENGLISH_SPANISH_CARDS.length,
  },
  frenchHistory: {
    deck: FRENCH_HISTORY_DECK,
    cards: FRENCH_HISTORY_CARDS,
    expectedCardCount: FRENCH_HISTORY_CARDS.length,
  },
} as const;
