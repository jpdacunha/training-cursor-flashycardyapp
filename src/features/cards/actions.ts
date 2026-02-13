"use server";

import { auth } from '@clerk/nextjs/server';
import {
  getCardById,
  updateCardInDb,
  createCardInDb,
  createCardsInDb,
  deleteCardFromDb,
} from '@/features/cards/queries';
import { getDeckById } from '@/features/decks/queries';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { buildRoute } from '@/core/constants/routes';

const CreateCardSchema = z.object({
  deckId: z.number().positive(),
  front: z.string().min(1, 'Front text is required').max(5000),
  back: z.string().min(1, 'Back text is required').max(5000),
});

type CreateCardInput = z.infer<typeof CreateCardSchema>;

const UpdateCardSchema = z.object({
  cardId: z.number().positive(),
  front: z.string().min(1, 'Front text is required').max(5000),
  back: z.string().min(1, 'Back text is required').max(5000),
});

type UpdateCardInput = z.infer<typeof UpdateCardSchema>;

const BulkCreateCardsSchema = z.object({
  deckId: z.number().positive(),
  cards: z.array(
    z.object({
      front: z.string().min(1, 'Front text is required').max(5000),
      back: z.string().min(1, 'Back text is required').max(5000),
    })
  ).min(1, 'At least one card is required').max(50, 'Maximum 50 cards at once'),
});

type BulkCreateCardsInput = z.infer<typeof BulkCreateCardsSchema>;

const DeleteCardSchema = z.object({
  cardId: z.number().positive(),
});

type DeleteCardInput = z.infer<typeof DeleteCardSchema>;

/**
 * Create a new card in a deck
 * @param input - Deck ID and card content
 * @returns Success response with new card or error
 */
export async function createCard(input: CreateCardInput) {
  const { userId } = await auth();
  
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  
  const validationResult = CreateCardSchema.safeParse(input);
  
  if (!validationResult.success) {
    return { 
      success: false, 
      error: validationResult.error.flatten().fieldErrors 
    };
  }
  
  const { deckId, front, back } = validationResult.data;
  
  try {
    // Verify the deck belongs to the user
    const deck = await getDeckById(deckId, userId);
    
    if (!deck) {
      return { success: false, error: 'Deck not found or unauthorized' };
    }
    
    // Create the card
    const newCard = await createCardInDb(deckId, front, back);
    
    revalidatePath(buildRoute.deck(deckId));
    
    return { success: true, data: newCard };
  } catch (error) {
    console.error('Error creating card:', error);
    return { success: false, error: 'Failed to create card' };
  }
}

/**
 * Update a card's content
 * @param input - Card ID and updated content
 * @returns Success response with updated card or error
 */
export async function updateCard(input: UpdateCardInput) {
  const { userId } = await auth();
  
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  
  const validationResult = UpdateCardSchema.safeParse(input);
  
  if (!validationResult.success) {
    return { 
      success: false, 
      error: validationResult.error.flatten().fieldErrors 
    };
  }
  
  const { cardId, front, back } = validationResult.data;
  
  try {
    // Get the card to verify it exists
    const card = await getCardById(cardId);
    
    if (!card) {
      return { success: false, error: 'Card not found' };
    }
    
    // Verify the deck belongs to the user
    const deck = await getDeckById(card.deckId, userId);
    
    if (!deck) {
      return { success: false, error: 'Unauthorized to modify this card' };
    }
    
    // Update the card
    const updatedCard = await updateCardInDb(cardId, { front, back });
    
    revalidatePath(buildRoute.deck(deck.id));
    
    return { success: true, data: updatedCard };
  } catch (error) {
    console.error('Error updating card:', error);
    return { success: false, error: 'Failed to update card' };
  }
}

/**
 * Create multiple cards at once (bulk creation)
 * @param input - Deck ID and array of cards to create
 * @returns Success response with created cards or error
 */
export async function bulkCreateCards(input: BulkCreateCardsInput) {
  const { userId } = await auth();
  
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  
  const validationResult = BulkCreateCardsSchema.safeParse(input);
  
  if (!validationResult.success) {
    return { 
      success: false, 
      error: validationResult.error.flatten().fieldErrors 
    };
  }
  
  const { deckId, cards } = validationResult.data;
  
  try {
    // Verify the deck belongs to the user
    const deck = await getDeckById(deckId, userId);
    
    if (!deck) {
      return { success: false, error: 'Deck not found or unauthorized' };
    }
    
    // Create all cards at once
    const cardsWithDeckId = cards.map(card => ({
      deckId,
      front: card.front,
      back: card.back,
    }));
    
    const newCards = await createCardsInDb(cardsWithDeckId);
    
    revalidatePath(buildRoute.deck(deckId));
    
    return { 
      success: true, 
      data: newCards,
      message: `${newCards.length} cards created successfully`
    };
  } catch (error) {
    console.error('Error creating cards:', error);
    return { success: false, error: 'Failed to create cards' };
  }
}

/**
 * Delete a card
 * @param input - Card ID
 * @returns Success response or error
 */
export async function deleteCard(input: DeleteCardInput) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const validationResult = DeleteCardSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.flatten().fieldErrors,
    };
  }

  const { cardId } = validationResult.data;

  try {
    const card = await getCardById(cardId);

    if (!card) {
      return { success: false, error: 'Card not found' };
    }

    const deck = await getDeckById(card.deckId, userId);

    if (!deck) {
      return { success: false, error: 'Unauthorized to delete this card' };
    }

    await deleteCardFromDb(cardId);

    revalidatePath(buildRoute.deck(deck.id));

    return { success: true };
  } catch (error) {
    console.error('Error deleting card:', error);
    return { success: false, error: 'Failed to delete card' };
  }
}
