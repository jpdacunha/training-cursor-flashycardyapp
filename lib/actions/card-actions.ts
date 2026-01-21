"use server";

import { auth } from '@clerk/nextjs/server';
import { getCardById, updateCardInDb } from '@/db/queries/card-queries';
import { getDeckById } from '@/db/queries/deck-queries';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { buildRoute } from '@/lib/routes';

const UpdateCardSchema = z.object({
  cardId: z.number().positive(),
  front: z.string().min(1, 'Front text is required').max(5000),
  back: z.string().min(1, 'Back text is required').max(5000),
});

type UpdateCardInput = z.infer<typeof UpdateCardSchema>;

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
