/**
 * Card domain types
 */

export interface Card {
  id: number;
  deckId: number;
  front: string;
  back: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCardInput {
  deckId: number;
  front: string;
  back: string;
}

export interface UpdateCardInput {
  id: number;
  front?: string;
  back?: string;
}

export interface BulkCreateCardsInput {
  deckId: number;
  cards: Array<{
    front: string;
    back: string;
  }>;
}
