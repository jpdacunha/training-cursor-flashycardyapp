/**
 * Branded type utilities for type-safe IDs
 */
export type Brand<T, TBrand extends string> = T & { readonly __brand: TBrand };

// Domain-specific ID types
export type UserId = Brand<string, 'UserId'>;
export type DeckId = Brand<number, 'DeckId'>;
export type CardId = Brand<number, 'CardId'>;
export type SessionId = Brand<string, 'SessionId'>;

/**
 * Type-safe ID constructors
 */
export const UserId = (id: string): UserId => id as UserId;
export const DeckId = (id: number): DeckId => id as DeckId;
export const CardId = (id: number): CardId => id as CardId;
export const SessionId = (id: string): SessionId => id as SessionId;
