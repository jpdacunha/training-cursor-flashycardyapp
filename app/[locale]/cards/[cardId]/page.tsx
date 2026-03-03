import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DEFAULT_REDIRECTS } from "@/core/constants/routes";
import { getCardDetailById } from "@/features/cards/queries";
import { CardDetailClient } from "./card-detail-client";

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ locale: string; cardId: string }>;
}) {
  const { locale, cardId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect(DEFAULT_REDIRECTS.UNAUTHENTICATED(locale));
  }

  const parsedCardId = parseInt(cardId);

  if (Number.isNaN(parsedCardId)) {
    redirect(DEFAULT_REDIRECTS.NOT_FOUND(locale));
  }

  const card = await getCardDetailById(parsedCardId, userId);

  if (!card) {
    redirect(DEFAULT_REDIRECTS.NOT_FOUND(locale));
  }

  return <CardDetailClient card={card} />;
}
