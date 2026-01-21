import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDeckById } from "@/features/decks/queries";
import { getCardsByDeckId } from "@/features/cards/queries";
import { DEFAULT_REDIRECTS } from "@/core/constants/routes";
import { DeckDetailClient } from "./deck-detail-client";

export default async function DeckDetailPage({
  params,
}: {
  params: { deckId: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect(DEFAULT_REDIRECTS.UNAUTHENTICATED);
  }

  const { deckId } = await params;
  const deck = await getDeckById(parseInt(deckId), userId);

  if (!deck) {
    redirect(DEFAULT_REDIRECTS.NOT_FOUND);
  }

  const cards = await getCardsByDeckId(parseInt(deckId));

  return <DeckDetailClient deck={deck} cards={cards} />;
}
