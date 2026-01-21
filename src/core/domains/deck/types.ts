/**
 * Deck domain types
 */

export interface Deck {
  id: number;
  userId: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DeckStatus = 'active' | 'archived' | 'completed';

export interface DeckWithCardCount extends Deck {
  cardCount: number;
}

export interface CreateDeckInput {
  title: string;
  description?: string;
}

export interface UpdateDeckInput {
  id: number;
  title?: string;
  description?: string;
}
