import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCardWithDeck } from "@/features/cards/queries";
import { DEFAULT_REDIRECTS } from "@/core/constants/routes";
import { CardDetailClient } from "./card-detail-client";

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ locale: string; deckId: string; cardId: string }>;
}) {
  const { locale, deckId, cardId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect(DEFAULT_REDIRECTS.UNAUTHENTICATED(locale));
  }

  const result = await getCardWithDeck(parseInt(cardId), userId);

  if (!result || result.deck.id !== parseInt(deckId)) {
    redirect(DEFAULT_REDIRECTS.NOT_FOUND(locale));
  }

  return <CardDetailClient card={result.card} deck={result.deck} />;
}
