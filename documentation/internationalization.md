# Internationalization (i18n)

This document describes the internationalization implementation in FlashyCardyApp, providing support for multiple languages.

## Overview

The application uses **next-intl** for internationalization, supporting English (en) and French (fr) locales. The implementation follows Next.js App Router best practices with locale-based routing.

## Supported Languages

- **English (en)** - Default language
- **French (fr)** - Secondary language

## Architecture

### Directory Structure

```
📦 training-cursor-flashycardyapp/
├── 📂 app/
│   ├── layout.tsx                    # Root layout with locale setup
│   └── 📂 [locale]/                  # Locale-specific routes
│       ├── layout.tsx                # Locale layout with UI
│       └── page.tsx                  # Home page with translations
├── 📂 components/
│   └── language-switcher.tsx         # Language selection component
├── 📂 i18n/
│   ├── request.ts                    # next-intl configuration
│   └── routing.ts                    # Routing and navigation setup
├── 📂 messages/
│   ├── en.json                       # English translations
│   └── fr.json                       # French translations
└── middleware.ts                     # Combined Clerk + i18n middleware
```

### Key Components

#### 1. Translation Files

Translation files are stored in JSON format in the `messages/` directory:

- `messages/en.json` - English translations
- `messages/fr.json` - French translations

**Structure Example:**

```json
{
  "Layout": {
    "title": "Flashy Cardy App",
    "signIn": "Sign In",
    "signUp": "Sign Up"
  },
  "Home": {
    "title": "To get started, edit the page.tsx file.",
    "description": "Looking for a starting point..."
  }
}
```

#### 2. Routing Configuration

**File:** `i18n/routing.ts`

Defines supported locales, default locale, and locale prefix behavior:

```typescript
export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});
```

The `localePrefix: 'as-needed'` setting means:
- Default locale (en) doesn't show prefix: `/`
- Other locales show prefix: `/fr`

#### 3. Request Configuration

**File:** `i18n/request.ts`

Handles loading the correct translation messages based on the current locale:

```typescript
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
```

#### 4. Middleware Integration

**File:** `middleware.ts`

The middleware combines Clerk authentication with next-intl locale detection:

```typescript
const intlMiddleware = createMiddleware(routing);

export default clerkMiddleware(
  async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect();
    }
    return intlMiddleware(request);
  }
);
```

This ensures that:
1. Authentication is checked first
2. Locale is detected and applied
3. Public routes remain accessible

## Usage

### In Server Components

```typescript
import { useTranslations } from 'next-intl';

export default function ServerComponent() {
  const t = useTranslations('Home');
  
  return <h1>{t('title')}</h1>;
}
```

### In Client Components

```typescript
"use client";

import { useTranslations } from 'next-intl';

export default function ClientComponent() {
  const t = useTranslations('Layout');
  
  return <button>{t('signIn')}</button>;
}
```

### Rich Text Formatting

For text with embedded links or formatting:

```typescript
{t.rich('description', {
  templates: (chunks) => (
    <a href="..." className="...">
      {chunks}
    </a>
  )
})}
```

### Navigation with Locale Awareness

Use the custom navigation utilities from `i18n/routing.ts`:

```typescript
import { Link, useRouter, usePathname } from '@/i18n/routing';

// Link component automatically handles locales
<Link href="/about">About</Link>

// Router with locale support
const router = useRouter();
router.push('/profile');

// Pathname without locale prefix
const pathname = usePathname();
```

## Language Switcher Component

**File:** `components/language-switcher.tsx`

A dropdown menu component that allows users to switch between languages:

- Uses a Globe icon button
- Displays language names with flag emojis
- Highlights the current language
- Maintains the current page when switching languages

**Features:**
- 🇬🇧 English
- 🇫🇷 Français

## Adding New Languages

To add a new language (e.g., Spanish):

1. **Create translation file:**
   ```bash
   # Create messages/es.json with all translations
   ```

2. **Update routing configuration:**
   ```typescript
   // i18n/routing.ts
   export const routing = defineRouting({
     locales: ['en', 'fr', 'es'],
     defaultLocale: 'en',
     localePrefix: 'as-needed'
   });
   ```

3. **Update language switcher:**
   ```typescript
   // components/language-switcher.tsx
   const languages = {
     en: { label: "English", flag: "🇬🇧" },
     fr: { label: "Français", flag: "🇫🇷" },
     es: { label: "Español", flag: "🇪🇸" }
   };
   ```

## Adding New Translation Keys

When adding new UI text:

1. **Add to all translation files:**
   ```json
   // messages/en.json
   {
     "NewFeature": {
       "title": "New Feature",
       "description": "This is a new feature"
     }
   }
   ```

   ```json
   // messages/fr.json
   {
     "NewFeature": {
       "title": "Nouvelle fonctionnalité",
       "description": "Ceci est une nouvelle fonctionnalité"
     }
   }
   ```

2. **Use in components:**
   ```typescript
   const t = useTranslations('NewFeature');
   return <h1>{t('title')}</h1>;
   ```

## Best Practices

1. **Organize by namespace:** Group related translations under meaningful namespaces (e.g., `Layout`, `Home`, `Settings`)

2. **Use consistent naming:** Use camelCase for translation keys

3. **Avoid hardcoded text:** Always use translation keys, never hardcode UI text

4. **Test in all languages:** Verify UI layout works with text in all supported languages

5. **Keep translations in sync:** When adding new keys, update all language files

6. **Use rich text for complex formatting:** For text with embedded HTML, use `t.rich()` instead of string concatenation

7. **Provide context in key names:** Use descriptive key names (e.g., `confirmDeleteButton` instead of just `confirm`)

## Clerk Localization

Clerk authentication modals automatically adapt to the user's browser language. To customize Clerk translations, configure the `ClerkProvider`:

```typescript
<ClerkProvider
  appearance={{ baseTheme: dark }}
  localization={{
    // Custom Clerk translations
  }}
>
```

## Testing i18n

When testing components with translations:

1. Mock the `next-intl` hooks:
   ```typescript
   vi.mock('next-intl', () => ({
     useTranslations: () => (key: string) => key
   }));
   ```

2. Test with different locales
3. Verify text rendering in both languages
4. Check layout doesn't break with longer/shorter text

## URL Structure

The application uses the following URL structure:

- **Default locale (en):**
  - Home: `/`
  - About: `/about`

- **French locale:**
  - Home: `/fr`
  - About: `/fr/about`

The locale is automatically detected from:
1. URL path
2. User's browser language
3. Default locale (en)

## Troubleshooting

### Translations not showing

- Verify JSON syntax in message files
- Check namespace and key names match
- Ensure `useTranslations` is called with correct namespace

### Locale not detected

- Check middleware configuration
- Verify routing setup in `i18n/routing.ts`
- Clear browser cache and cookies

### Links not working

- Use `Link` from `@/i18n/routing` instead of `next/link`
- For external links, use standard `<a>` tags

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/)

