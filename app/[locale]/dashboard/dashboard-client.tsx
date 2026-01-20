"use client";

import { useTranslations, useLocale } from "next-intl";
import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InferSelectModel } from "drizzle-orm";
import { decksTable } from "@/db/schema";

type Deck = InferSelectModel<typeof decksTable>;

export default function DashboardClient({ decks }: { decks: Deck[] }) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();

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
                  <CardDescription>{deck.description || ''}</CardDescription>
                </CardHeader>
                <Separator />
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{t("createdAt")}:</span>
                    <span>{new Date(deck.createdAt).toLocaleDateString(locale)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{t("updatedAt")}:</span>
                    <span>{new Date(deck.updatedAt).toLocaleDateString(locale)}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}
