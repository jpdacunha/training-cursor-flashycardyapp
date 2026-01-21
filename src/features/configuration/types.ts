/**
 * Configuration feature types
 */

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'fr';
  notifications: boolean;
}

export interface ConfigurationSettings {
  preferences: UserPreferences;
}
