/**
 * Dashboard feature types
 */

import type { Deck } from '@/core/domains/deck/types';

export interface DashboardStats {
  totalDecks: number;
  totalCards: number;
  recentDecks: Deck[];
}
