import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { usersTable } from '@/src/db/schema';

// GET - Récupérer tous les utilisateurs
export async function GET() {
  try {
    const users = await db.select().from(usersTable);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel utilisateur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, age, email } = body;

    if (!name || !age || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, age, email' },
        { status: 400 }
      );
    }

    const newUser = await db
      .insert(usersTable)
      .values({ name, age, email })
      .returning();

    return NextResponse.json(newUser[0], { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

