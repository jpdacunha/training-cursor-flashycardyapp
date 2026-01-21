# FlashyCardyApp

A modern flashcard application built with Next.js, featuring user authentication and a powerful database-backed storage system for creating and managing study decks.

## 📋 Project Description

FlashyCardyApp is a web-based flashcard application designed to help users create, organize, and study flashcard decks. Users can create personalized decks, add cards with front/back content, and manage their study materials efficiently. The application provides secure user authentication and a clean, intuitive interface for an optimal learning experience.

## 🏗️ Architecture Overview

### Project Structure

```
📦 training-cursor-flashycardyapp/
├── 📂 app/                      # Next.js App Router
│   ├── 📂 api/                  # API routes
│   ├── 📂 [locale]/             # Locale-specific routes
│   │   ├── layout.tsx           # Locale layout with UI
│   │   └── page.tsx             # Home page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── 📂 components/               # React components
│   ├── 📂 ui/                   # shadcn/ui components (official only)
│   ├── 📂 custom/               # Custom components (only when shadcn/ui doesn't provide)
│   ├── header.tsx               # Header component
│   ├── footer.tsx               # Footer component
│   ├── language-switcher.tsx    # Language selection component
│   └── structured-data.tsx      # SEO structured data
├── 📂 db/                       # Database layer
│   ├── schema.ts                # Table definitions (decks & cards)
│   ├── 📂 queries/              # Database query helpers
│   │   ├── card-queries.ts      # Card-related queries
│   │   └── deck-queries.ts      # Deck-related queries
│   └── 📂 test/                 # Database tests
│       ├── card-queries.test.ts # Card query tests
│       ├── deck-queries.test.ts # Deck query tests
│       ├── test-data.ts         # Reusable test datasets
│       ├── test-data.test.ts    # Test data validation
│       └── test-utils.ts        # Test utilities
├── 📂 documentation/            # Project documentation
│   ├── database.md              # Database and ORM guide
│   ├── internationalization.md  # i18n setup and usage
│   └── testing.md               # Testing documentation
├── 📂 drizzle/                  # Database migrations
├── 📂 i18n/                     # Internationalization config
│   ├── request.ts               # next-intl configuration
│   └── routing.ts               # Locale routing setup
├── 📂 lib/                      # Shared utilities
│   ├── db.ts                    # Drizzle ORM instance
│   ├── routes.ts                # Centralized route configuration
│   └── utils.ts                 # Utility functions
├── 📂 messages/                 # Translation files
│   ├── en.json                  # English translations
│   └── fr.json                  # French translations
└── 📜 README.md                 # This file
```

### Architecture Layers

1. **Frontend Layer** (Next.js 16)
   - React 19 components
   - Server and Client components
   - shadcn/ui for UI components
   - Tailwind CSS for styling

2. **Authentication Layer** (Clerk)
   - User authentication and management
   - Session handling
   - Protected routes via middleware
   - Centralized route configuration ([lib/routes.ts](mdc:lib/routes.ts))

3. **API Layer** (Next.js API Routes)
   - RESTful endpoints
   - Server-side business logic
   - Database operations

4. **Database Layer** (Neon PostgreSQL + Drizzle ORM)
   - Serverless PostgreSQL database
   - Type-safe ORM queries
   - Automated migrations

## 🛠️ Technologies Used

### Core Framework
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type-safe JavaScript

### Database & ORM
- **Drizzle ORM 0.45.1** - Type-safe ORM
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **Drizzle Kit 0.31.8** - Database migrations and schema management

### Authentication
- **Clerk** - User authentication and management
  - `@clerk/nextjs 6.36.5` - Next.js integration
  - `@clerk/themes 2.4.46` - Themed components

### UI & Styling
- **shadcn/ui** - Primary UI component library (New York style, Neutral theme)
  - All standard UI components are official shadcn/ui implementations
  - Components use modern `data-slot` attribute pattern
  - Located in `components/ui/` directory (reserved for shadcn/ui only)
  - Custom components allowed ONLY when shadcn/ui doesn't provide equivalent
  - Custom components placed in `components/custom/` directory
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Headless UI primitives (used by shadcn/ui)
- **Lucide React** - Icon library

### Internationalization
- **next-intl** - i18n solution for Next.js App Router
- Support for English (en) and French (fr)
- Locale-based routing with automatic detection

### Testing
- **Vitest 2.1.8** - Unit testing framework
- Automated CRUD tests with database cleanup

### Development Tools
- **ESLint 9** - Code linting
- **tsx** - TypeScript execution
- **dotenv** - Environment variable management

## 🎯 Functional Description

### Core Features

1. **User Authentication**
   - Secure sign-up and sign-in via Clerk
   - User session management
   - Protected routes and data isolation

2. **Deck Management**
   - Create flashcard decks with titles and descriptions
   - View all user-owned decks
   - Update deck information
   - Delete decks (with cascade deletion of cards)

3. **Card Management**
   - Create flashcards with front and back content
   - View all cards in a deck
   - Update card content
   - Delete individual cards
   - Automatic cleanup when parent deck is deleted

### Database Schema

**Decks Table**
- User-owned flashcard collections
- Fields: id, userId, title, description, timestamps

**Cards Table**
- Individual flashcards within decks
- Fields: id, deckId, front, back, timestamps
- Foreign key with cascade delete

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- PostgreSQL database (Neon recommended)
- Clerk account for authentication

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (copy `.env.example` to `.env`):
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Neon PostgreSQL Database
DATABASE_URL=your_neon_database_url
```

4. Apply database migrations:
```bash
npx drizzle-kit push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

### Database Management

```bash
npx drizzle-kit push      # Apply schema changes (development)
npx drizzle-kit generate  # Generate migrations
npx drizzle-kit migrate   # Apply migrations
npx drizzle-kit studio    # Open Drizzle Studio (visual database browser)
```

## 📚 Documentation

Detailed documentation is available in the `documentation/` directory:

- [**Database Guide**](documentation/database.md) - Complete guide to Drizzle ORM setup, schema definitions, database operations, and migration management
- [**Internationalization**](documentation/internationalization.md) - i18n setup, adding languages, translation management, and usage patterns
- [**shadcn/ui Integration**](documentation/shadcn-ui.md) - shadcn/ui architecture, component usage, customization guide, and best practices
- [**Testing Documentation**](documentation/testing.md) - Testing strategy, test suite structure, running tests, and adding new tests
- [**Database Test Data**](src/db/README.md) - Reusable test datasets, query helpers, and database testing guide

## 🤝 Contributing

This project follows specific coding standards:

### Code & Language
- All code and comments must be in English

### UI Components
- **EXCLUSIVELY use official shadcn/ui components** for standard UI elements
- `components/ui/` directory is **RESERVED** for official shadcn/ui components only
- Custom components allowed **ONLY** when shadcn/ui doesn't provide equivalent
- Custom components must:
  - Be placed in `components/custom/` directory (NOT `components/ui/`)
  - Include JSDoc documentation explaining why they're needed
  - Verify that shadcn/ui doesn't offer the component
  - Use shadcn/ui components as building blocks when possible
- See `.cursor/rules/architecture-shadcn-ui.mdc` for complete guidelines

### General
- Follow the established project structure
- Update documentation when making code changes

## 📝 License

This project is private and not licensed for public use.
