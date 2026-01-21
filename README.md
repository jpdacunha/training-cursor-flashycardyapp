# FlashyCardyApp

A modern flashcard application built with Next.js, featuring user authentication and a powerful database-backed storage system for creating and managing study decks.

## 📋 Project Description

FlashyCardyApp is a web-based flashcard application designed to help users create, organize, and study flashcard decks. Users can create personalized decks, add cards with front/back content, and manage their study materials efficiently. The application provides secure user authentication and a clean, intuitive interface for an optimal learning experience.

## 🏗️ Architecture Overview

### Project Structure

This project uses an **enterprise-scale architecture** with domain-driven + feature-based organization:

```
📦 training-cursor-flashycardyapp/
├── 📂 src/                      # Source code (new enterprise structure)
│   ├── 📂 core/                 # Core business logic
│   │   ├── 📂 domains/          # Domain models and types
│   │   │   ├── user/           # User domain
│   │   │   ├── deck/           # Deck domain
│   │   │   ├── card/           # Card domain
│   │   │   └── ai/             # AI/LLM domain
│   │   ├── 📂 types/            # Cross-domain shared types
│   │   └── 📂 constants/        # Application-wide constants (routes, config)
│   │
│   ├── 📂 features/             # Feature modules (vertical slices)
│   │   ├── 📂 decks/           # Deck management
│   │   │   ├── actions.ts      # Server actions
│   │   │   ├── queries.ts      # Database queries
│   │   │   └── components/     # Feature components
│   │   ├── 📂 cards/           # Card management
│   │   ├── 📂 ai-generation/   # AI card generation
│   │   ├── 📂 dashboard/       # Dashboard feature
│   │   └── 📂 internationalization/ # i18n feature
│   │
│   ├── 📂 infrastructure/       # Infrastructure layer
│   │   ├── 📂 database/        # Database schema, migrations, connection
│   │   └── 📂 authentication/  # Auth middleware
│   │
│   └── 📂 shared/              # Shared utilities and components
│       ├── 📂 components/      # UI components (shadcn/ui), layout, common
│       ├── 📂 hooks/           # Shared React hooks
│       ├── 📂 utils/           # Utility functions
│       └── 📂 types/           # Shared utility types (branded types)
│
├── 📂 app/                      # Next.js App Router (routing only)
│   └── 📂 [locale]/             # Locale-specific routes
├── 📂 tests/                    # Test files
│   ├── 📂 unit/                # Unit tests
│   ├── 📂 integration/         # Integration tests
│   └── 📂 fixtures/            # Test data and utilities
├── 📂 docs/                     # Project documentation
├── 📂 config/                   # Configuration files
├── 📂 messages/                 # Translation files (en, fr)
└── 📂 public/                   # Static assets
```

### Architecture Layers

The application follows a **layered architecture** with clear separation of concerns:

1. **Core Layer** (`src/core/`)
   - Domain models and business logic
   - Application-wide types and constants
   - No dependencies on features or infrastructure

2. **Features Layer** (`src/features/`)
   - Self-contained feature modules (vertical slices)
   - Each feature owns its actions, queries, components, and types
   - Examples: decks, cards, ai-generation, dashboard

3. **Infrastructure Layer** (`src/infrastructure/`)
   - Technical concerns (database, authentication, monitoring)
   - Drizzle ORM for type-safe database queries
   - Clerk authentication middleware

4. **Shared Layer** (`src/shared/`)
   - Reusable UI components (shadcn/ui)
   - Common hooks and utilities
   - Shared types (branded types for type safety)

5. **Routing Layer** (`app/`)
   - Next.js App Router with locale support
   - Minimal page components that import from features

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

### AI & Machine Learning
- **Google Generative AI** - AI-powered card generation
- **Gemini 1.5 Flash** - Fast and efficient LLM model
- LLM-agnostic architecture supporting multiple providers

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

4. **AI Card Generation** ✨ NEW
   - Automatically generate flashcards using AI
   - Context-aware generation based on deck title and description
   - Avoids duplicates by analyzing existing cards
   - Multi-language support (10+ languages)
   - Preview and edit cards before adding to deck
   - LLM-agnostic architecture (currently using Gemini)

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

# LLM Configuration (for AI card generation)
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

**Note**: To use AI card generation, you'll need a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

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

### Architecture
- [**Source Code Organization**](.cursor/rules/architecture-source-organisation.mdc) - 🏢 **ENTERPRISE STRUCTURE**: Complete specification for domain-driven + feature-based architecture

### Features
- [**AI Card Generation**](docs/features/ai-card-generation.md) - AI-powered flashcard generation using Gemini
- [**Internationalization**](docs/features/internationalization.md) - i18n setup, adding languages, and translation management

### Guides
- [**Database Guide**](docs/guides/database.md) - Drizzle ORM setup, schema, queries, and migrations
- [**Testing Guide**](docs/guides/testing.md) - Testing strategy, test structure, and best practices
- [**shadcn/ui Components**](docs/guides/shadcn-ui.md) - Component usage guidelines and patterns
- [**AI Generation Quick Start**](docs/guides/quickstart-ai-generation.md) - Quick start guide for AI features

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
