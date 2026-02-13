import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/features/cards/queries', () => ({
  getCardById: vi.fn(),
  deleteCardFromDb: vi.fn(),
}));

vi.mock('@/features/decks/queries', () => ({
  getDeckById: vi.fn(),
}));

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { getCardById, deleteCardFromDb } from '@/features/cards/queries';
import { getDeckById } from '@/features/decks/queries';
import { deleteCard } from '@/features/cards/actions';
import { buildRoute } from '@/core/constants/routes';

describe('cards/actions deleteCard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns unauthorized when user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const result = await deleteCard({ cardId: 1 });

    expect(result.success).toBe(false);
  });

  it('returns not found when card does not exist', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_1' } as any);
    vi.mocked(getCardById).mockResolvedValue(undefined as any);

    const result = await deleteCard({ cardId: 123 });

    expect(result.success).toBe(false);
    expect(vi.mocked(deleteCardFromDb)).not.toHaveBeenCalled();
  });

  it('returns unauthorized when deck is not owned by user', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_1' } as any);
    vi.mocked(getCardById).mockResolvedValue({ id: 5, deckId: 99 } as any);
    vi.mocked(getDeckById).mockResolvedValue(null as any);

    const result = await deleteCard({ cardId: 5 });

    expect(result.success).toBe(false);
    expect(vi.mocked(deleteCardFromDb)).not.toHaveBeenCalled();
  });

  it('deletes a card and revalidates the deck route', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_1' } as any);
    vi.mocked(getCardById).mockResolvedValue({ id: 5, deckId: 99 } as any);
    vi.mocked(getDeckById).mockResolvedValue({ id: 99 } as any);

    const result = await deleteCard({ cardId: 5 });

    expect(result.success).toBe(true);
    expect(vi.mocked(deleteCardFromDb)).toHaveBeenCalledWith(5);
    expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith(buildRoute.deck(99));
  });
});
