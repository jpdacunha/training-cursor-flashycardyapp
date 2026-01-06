# Drizzle ORM - Documentation

## 📦 Installation

Drizzle ORM has been successfully installed in this project with the following packages:

- `drizzle-orm` - Main ORM
- `@neondatabase/serverless` - Driver for Neon PostgreSQL
- `dotenv` - Environment variable management
- `drizzle-kit` - CLI for migrations (dev)
- `tsx` - TypeScript script execution (dev)

## 🗂️ File Structure

```
📦 project root
├ 📂 drizzle/              # Generated SQL migrations
├ 📂 src/
│  ├ 📂 db/
│  │  └ 📜 schema.ts       # Table definitions (decks & cards)
│  └ 📜 index.ts           # Test script
├ 📂 lib/
│  └ 📜 db.ts              # Reusable Drizzle instance
├ 📂 app/
│  └ 📂 api/               # API routes will be added here
├ 📜 .env                  # Environment variables (not committed)
├ 📜 .env.example          # Template for variables
└ 📜 drizzle.config.ts     # Drizzle Kit configuration
```

## 🔧 Configuration

### Environment Variables (.env)

The `.env` file contains all application environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Neon PostgreSQL Database
DATABASE_URL=postgresql://...
```

The `.env.example` file serves as a template and documents all required variables.

### Configuration File (drizzle.config.ts)

Configuration for Drizzle Kit pointing to the schema and Neon database.

## 📝 Usage

### 1. Drizzle Instance in the Application

The `lib/db.ts` file exports a reusable Drizzle instance:

```typescript
import { db } from '@/lib/db';
import { decksTable, cardsTable } from '@/src/db/schema';

// Retrieve decks
const decks = await db.select().from(decksTable);

// Retrieve cards for a specific deck
const cards = await db.select().from(cardsTable).where(eq(cardsTable.deckId, deckId));
```

### 2. Test Script

Execute the CRUD test script:

```bash
npx tsx src/index.ts
```

## 🚀 Drizzle Kit Commands

### Apply Schema Directly (Development)

```bash
npx drizzle-kit push
```

### Generate Migrations

```bash
npx drizzle-kit generate
```

### Apply Migrations

```bash
npx drizzle-kit migrate
```

### Open Drizzle Studio (Visual Interface)

```bash
npx drizzle-kit studio
```

## 📊 Current Schema

The schema includes two main tables for the flashcard application:

**Decks Table** - Stores flashcard decks (authentication via Clerk):
```typescript
export const decksTable = pgTable("decks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull(), // Clerk user ID
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});
```

**Cards Table** - Stores individual flashcards:
```typescript
export const cardsTable = pgTable("cards", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deckId: integer().notNull().references(() => decksTable.id, { onDelete: "cascade" }),
  front: text().notNull(), // Front of the card
  back: text().notNull(), // Back of the card
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});
```

## 🔗 Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Neon Documentation](https://neon.tech/docs)
- [Drizzle + Neon Guide](https://orm.drizzle.team/docs/get-started-neon)

## 💡 Next Steps

1. Define your database schema in `src/db/schema.ts`
2. Run `npx drizzle-kit push` to apply changes
3. Use the `db` instance in your API routes and Server Components
4. Explore Drizzle Studio to visualize your data

