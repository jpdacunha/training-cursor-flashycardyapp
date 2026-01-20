import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDeckById } from "@/db/queries/deck-queries";
import { DEFAULT_REDIRECTS } from "@/lib/routes";

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Empty content for now */}
    </div>
  );
}
