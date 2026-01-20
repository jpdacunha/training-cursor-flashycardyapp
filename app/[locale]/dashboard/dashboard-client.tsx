"use client";

import { useTranslations } from "next-intl";

type Deck = {
  id: number;
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function DashboardClient({ decks }: { decks: Deck[] }) {
  const t = useTranslations("Dashboard");

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>
      <p className="text-lg text-muted-foreground mb-8">{t("description")}</p>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("myDecks")}</h2>
        
        {decks.length === 0 ? (
          <p className="text-muted-foreground">{t("noDecks")}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{deck.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {deck.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
