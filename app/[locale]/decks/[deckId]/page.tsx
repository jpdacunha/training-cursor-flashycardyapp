import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDeckById } from "@/features/decks/queries";
import { getCardsByDeckId } from "@/features/cards/queries";
import { DEFAULT_REDIRECTS } from "@/core/constants/routes";
import { DeckDetailClient } from "./deck-detail-client";

export default async function DeckDetailPage({
  params,
}: {
  params: Promise<{ locale: string; deckId: string }>;
}) {
  const { locale, deckId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect(DEFAULT_REDIRECTS.UNAUTHENTICATED(locale));
  }
  const deck = await getDeckById(parseInt(deckId), userId);

  if (!deck) {
    redirect(DEFAULT_REDIRECTS.NOT_FOUND(locale));
  }

  const cards = await getCardsByDeckId(parseInt(deckId));

  return <DeckDetailClient deck={deck} cards={cards} />;
}
