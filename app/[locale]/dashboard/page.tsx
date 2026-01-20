import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { decksTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
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
    redirect("/sign-in");
  }

  // Fetch user's decks from database
  const decks = await db
    .select()
    .from(decksTable)
    .where(eq(decksTable.userId, userId));

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardClient decks={decks} />
    </div>
  );
}
