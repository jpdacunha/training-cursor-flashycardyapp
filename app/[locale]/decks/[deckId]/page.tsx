import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDeckById } from "@/db/queries/deck-queries";
import { getCardsByDeckId } from "@/db/queries/card-queries";
import { DEFAULT_REDIRECTS } from "@/lib/routes";
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
