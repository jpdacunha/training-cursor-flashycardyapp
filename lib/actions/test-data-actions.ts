"use server";

import { auth } from '@clerk/nextjs/server';
import { loadTestDataInDb, deleteAllUserDataFromDb } from '@/db/queries/test-data-queries';
import { revalidatePath } from 'next/cache';
import { ROUTES } from '@/lib/routes';

/**
 * Server action to load test data for the current user
 * This will delete all existing user data and load the test datasets
 */
export async function loadTestData() {
  // Step 1: Authenticate
  const { userId } = await auth();
  
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  
  try {
    // Step 2: Delete all existing user data
    await deleteAllUserDataFromDb(userId);
    
    // Step 3: Load test data
    const result = await loadTestDataInDb(userId);
    
    // Step 4: Revalidate cache
    revalidatePath(ROUTES.DASHBOARD);
    revalidatePath(ROUTES.CONFIGURATION);
    
    return { 
      success: true, 
      data: {
        decksCreated: result.decks.length,
        cardsCreated: result.totalCards,
      }
    };
  } catch (error) {
    console.error('Error loading test data:', error);
    return { success: false, error: 'Failed to load test data' };
  }
}
