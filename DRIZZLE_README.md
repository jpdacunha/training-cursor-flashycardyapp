# Drizzle ORM - Documentation

## 📦 Installation

Drizzle ORM a été installé avec succès dans ce projet avec les packages suivants :

- `drizzle-orm` - ORM principal
- `@neondatabase/serverless` - Driver pour Neon PostgreSQL
- `dotenv` - Gestion des variables d'environnement
- `drizzle-kit` - CLI pour les migrations (dev)
- `tsx` - Exécution de scripts TypeScript (dev)

## 🗂️ Structure des fichiers

```
📦 project root
├ 📂 drizzle/              # Migrations SQL générées
├ 📂 src/
│  ├ 📂 db/
│  │  └ 📜 schema.ts       # Définition des tables
│  └ 📜 index.ts           # Script de test
├ 📂 lib/
│  └ 📜 db.ts              # Instance Drizzle réutilisable
├ 📂 app/
│  └ 📂 api/
│     └ 📂 users/
│        └ 📜 route.ts     # Exemple d'API route
├ 📜 .env                  # Variables d'environnement (non commité)
├ 📜 .env.example          # Template des variables
└ 📜 drizzle.config.ts     # Configuration Drizzle Kit
```

## 🔧 Configuration

### Variables d'environnement (.env)

Le fichier `.env` contient toutes les variables d'environnement de l'application :

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Neon PostgreSQL Database
DATABASE_URL=postgresql://...
```

Le fichier `.env.example` sert de template et documente toutes les variables nécessaires.

### Fichier de configuration (drizzle.config.ts)

Configuration pour Drizzle Kit pointant vers le schéma et la base de données Neon.

## 📝 Utilisation

### 1. Instance Drizzle dans l'application

Le fichier `lib/db.ts` exporte une instance Drizzle réutilisable :

```typescript
import { db } from '@/lib/db';
import { usersTable } from '@/src/db/schema';

// Récupérer des données
const users = await db.select().from(usersTable);
```

### 2. Exemple d'API Route

L'API route `/api/users` montre comment utiliser Drizzle dans Next.js :

- **GET** `/api/users` - Récupérer tous les utilisateurs
- **POST** `/api/users` - Créer un utilisateur

### 3. Script de test

Exécuter le script de test CRUD :

```bash
npx tsx src/index.ts
```

## 🚀 Commandes Drizzle Kit

### Appliquer le schéma directement (développement)

```bash
npx drizzle-kit push
```

### Générer des migrations

```bash
npx drizzle-kit generate
```

### Appliquer les migrations

```bash
npx drizzle-kit migrate
```

### Ouvrir Drizzle Studio (interface visuelle)

```bash
npx drizzle-kit studio
```

## 📊 Schéma actuel

Le schéma de base inclut une table `users` :

```typescript
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
```

## 🔗 Ressources

- [Documentation Drizzle ORM](https://orm.drizzle.team/)
- [Documentation Neon](https://neon.tech/docs)
- [Guide Drizzle + Neon](https://orm.drizzle.team/docs/get-started-neon)

## 💡 Prochaines étapes

1. Définir votre schéma de base de données dans `src/db/schema.ts`
2. Exécuter `npx drizzle-kit push` pour appliquer les changements
3. Utiliser l'instance `db` dans vos API routes et Server Components
4. Explorer Drizzle Studio pour visualiser vos données

