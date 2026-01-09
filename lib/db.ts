import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Vérifier que DATABASE_URL est défini
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be defined in .env file');
}

// Créer le client Neon
const sql = neon(process.env.DATABASE_URL);

// Créer l'instance Drizzle
export const db = drizzle({ client: sql });





