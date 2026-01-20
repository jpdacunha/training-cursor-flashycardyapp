"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
              <Card key={deck.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{deck.title}</CardTitle>
                  <CardDescription>{deck.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
