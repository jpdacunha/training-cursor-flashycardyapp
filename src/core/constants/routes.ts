/**
 * Centralized route and redirect configuration
 * Used for: redirects, navigation, and middleware route protection
 */

/**
 * Base route paths (without locale prefixes)
 */
export const ROUTES = {
  // Public routes
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  CREDITS: "/credits",

  // Protected routes
  DASHBOARD: "/dashboard",
  CONFIGURATION: "/configuration",
  DECKS: "/decks",
} as const;

/**
 * Prefix a non-localized route with a locale segment.
 * Note: For the home route ('/'), we return `/${locale}` (no trailing slash).
 */
export function withLocale(locale: string, route: string) {
  if (route === "/") return `/${locale}`;
  return `/${locale}${route}`;
}

/**
 * Public route patterns for Clerk middleware
 * These patterns include locale prefixes and wildcards
 */
export const PUBLIC_ROUTE_PATTERNS = [
  "/",
  "/:locale",
  // When `localePrefix` is `as-needed`, the default locale (e.g. `en`) omits the prefix.
  // These routes must be public both with and without the locale segment.
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/credits",
  "/:locale/sign-in(.*)",
  "/:locale/sign-up(.*)",
  "/:locale/credits",
];

/**
 * Default redirect destinations for different scenarios
 */
export const DEFAULT_REDIRECTS = {
  /** Where unauthenticated users are redirected */
  UNAUTHENTICATED: (locale: string) => withLocale(locale, ROUTES.HOME),

  /** Where authenticated users are redirected by default */
  AUTHENTICATED: (locale: string) => withLocale(locale, ROUTES.DASHBOARD),

  /** Where to redirect when a resource is not found */
  NOT_FOUND: (locale: string) => withLocale(locale, ROUTES.DASHBOARD),

  /** After successful login */
  AFTER_LOGIN: (locale: string) => withLocale(locale, ROUTES.DASHBOARD),

  /** After logout */
  AFTER_LOGOUT: (locale: string) => withLocale(locale, ROUTES.HOME),
} satisfies Record<string, (locale: string) => string>;

/**
 * Helper functions to build dynamic routes
 */
export const buildRoute = {
  deck: (deckId: number | string) => `${ROUTES.DECKS}/${deckId}`,
  deckWithLocale: (locale: string, deckId: number | string) =>
    withLocale(locale, `${ROUTES.DECKS}/${deckId}`),
  card: (deckId: number | string, cardId: number | string) =>
    `${ROUTES.DECKS}/${deckId}/cards/${cardId}`,
  cardWithLocale: (locale: string, deckId: number | string, cardId: number | string) =>
    withLocale(locale, `${ROUTES.DECKS}/${deckId}/cards/${cardId}`),
} as const;

// Type exports for TypeScript
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
export type DefaultRedirect = (typeof DEFAULT_REDIRECTS)[keyof typeof DEFAULT_REDIRECTS];
