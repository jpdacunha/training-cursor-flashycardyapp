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
 * Public route patterns for Clerk middleware
 * These patterns include locale prefixes and wildcards
 */
export const PUBLIC_ROUTE_PATTERNS = [
  "/",
  "/:locale",
  "/:locale/sign-in(.*)",
  "/:locale/sign-up(.*)",
  "/:locale/credits",
];

/**
 * Default redirect destinations for different scenarios
 */
export const DEFAULT_REDIRECTS = {
  /** Where unauthenticated users are redirected */
  UNAUTHENTICATED: ROUTES.HOME,

  /** Where authenticated users are redirected by default */
  AUTHENTICATED: ROUTES.DASHBOARD,

  /** Where to redirect when a resource is not found */
  NOT_FOUND: ROUTES.DASHBOARD,

  /** After successful login */
  AFTER_LOGIN: ROUTES.DASHBOARD,

  /** After logout */
  AFTER_LOGOUT: ROUTES.HOME,
} as const;

/**
 * Helper functions to build dynamic routes
 */
export const buildRoute = {
  deck: (deckId: number | string) => `${ROUTES.DECKS}/${deckId}`,
  deckWithLocale: (locale: string, deckId: number | string) =>
    `/${locale}${ROUTES.DECKS}/${deckId}`,
} as const;

// Type exports for TypeScript
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
export type DefaultRedirect = (typeof DEFAULT_REDIRECTS)[keyof typeof DEFAULT_REDIRECTS];
