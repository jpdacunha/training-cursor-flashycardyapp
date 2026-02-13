"use server";

import { auth } from '@clerk/nextjs/server';
import { loadTestDataInDb, deleteAllUserDataFromDb } from '@/tests/fixtures/test-data-queries';
import { revalidatePath } from 'next/cache';
import { ROUTES } from '@/core/constants/routes';

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
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Error loading test data:', {
      message: err.message,
      name: err.name,
      stack: err.stack,
    });

    // Keep the user-facing error generic, but return a debug hint for dev.
    return {
      success: false,
      error: 'Failed to load test data',
      debug: process.env.NODE_ENV === 'production' ? undefined : err.stack ?? err.message,
    };
  }
}
