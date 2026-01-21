"use server";

import { auth } from "@clerk/nextjs/server";
import { getDeckById, updateDeckInDb, createDeckInDb } from "@/db/queries/deck-queries";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ROUTES, buildRoute } from "@/lib/routes";

const CreateDeckSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

type CreateDeckInput = z.infer<typeof CreateDeckSchema>;

const UpdateDeckSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

type UpdateDeckInput = z.infer<typeof UpdateDeckSchema>;

export async function createDeck(input: CreateDeckInput) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validationResult = CreateDeckSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.flatten().fieldErrors,
    };
  }

  const { title, description } = validationResult.data;

  try {
    const newDeck = await createDeckInDb(userId, title, description);

    revalidatePath(ROUTES.DASHBOARD);

    return { success: true, data: newDeck };
  } catch (error) {
    console.error("Error creating deck:", error);
    return { success: false, error: "Failed to create deck" };
  }
}

export async function updateDeck(input: UpdateDeckInput) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validationResult = UpdateDeckSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.flatten().fieldErrors,
    };
  }

  const { id, ...updates } = validationResult.data;

  try {
    const deck = await getDeckById(id, userId);

    if (!deck) {
      return { success: false, error: "Deck not found" };
    }

    const updatedDeck = await updateDeckInDb(id, updates);

    revalidatePath(ROUTES.DASHBOARD);
    revalidatePath(buildRoute.deck(id));

    return { success: true, data: updatedDeck };
  } catch (error) {
    console.error("Error updating deck:", error);
    return { success: false, error: "Failed to update deck" };
  }
}
