/**
 * Internationalization feature types
 */

export type Locale = 'en' | 'fr';

export interface LocaleConfig {
  locale: Locale;
  label: string;
  flag: string;
}

export interface RoutingConfig {
  locales: Locale[];
  defaultLocale: Locale;
  localePrefix: 'always' | 'as-needed' | 'never';
}
