import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getUserDecks } from "@/db/queries/deck-queries";
import { DEFAULT_REDIRECTS } from "@/lib/routes";
import DashboardClient from "./dashboard-client";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Dashboard" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect(DEFAULT_REDIRECTS.UNAUTHENTICATED);
  }

  // Fetch user's decks using query helper
  const decks = await getUserDecks(userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardClient decks={decks} />
    </div>
  );
}
