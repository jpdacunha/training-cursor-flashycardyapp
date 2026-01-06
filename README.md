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
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── 📂 components/               # React components
│   └── 📂 ui/                   # shadcn/ui components
├── 📂 documentation/            # Project documentation
│   ├── database.md              # Database and ORM guide
│   └── testing.md               # Testing documentation
├── 📂 drizzle/                  # Database migrations
├── 📂 lib/                      # Shared utilities
│   ├── db.ts                    # Drizzle ORM instance
│   └── utils.ts                 # Utility functions
├── 📂 src/                      # Source code
│   ├── 📂 db/                   # Database schemas
│   │   └── schema.ts            # Table definitions
│   └── index.ts                 # Entry point
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
   - Protected routes

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
- **shadcn/ui** - Reusable component library (New York style, Neutral theme)
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library

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
- [**Testing Documentation**](documentation/testing.md) - Testing strategy, test suite structure, running tests, and adding new tests

## 🤝 Contributing

This project follows specific coding standards:
- All code and comments must be in English
- Use shadcn/ui components for UI elements
- Follow the established project structure
- Update documentation when making code changes

## 📝 License

This project is private and not licensed for public use.
